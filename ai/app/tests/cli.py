import json
import logging
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

# Add Tuple to imports if not already there from previous steps
from typing import Any, Dict, Iterator, List, Optional, Set, Tuple

import typer
from pydantic import BaseModel, Field, ValidationError

# Assuming imports are set up correctly after refactor
from app.indexer.llm import does_article_impact_stocks
from app.schemas import (
    ArticleContent,
    ArticleStockImpact,
    ArticleStockImpactSeverity,
    Stock,
)

# Import benchmark models (adjust path if needed after refactor)
from .benchmark import (
    BenchmarkRun,
    BenchmarkSingleResult,
    BenchmarkTestCase,
    load_json_data,
    severity_enum_to_string,
)

# Define base tests directory relative to this file or using absolute path logic
# Assuming this script lives in app/tests/
BASE_TESTS_DIR = f"/app/tests"
SUITES_DIR = f"{BASE_TESTS_DIR}/suites"
RESULTS_DIR = f"{BASE_TESTS_DIR}/results"
logger = logging.getLogger(__name__)

app = typer.Typer(no_args_is_help=True)


@app.command()
def run(
    # Add suite_name argument, defaulting to 'simple'
    suite_name: str = typer.Argument("simple", help="Name of the test suite directory under tests/suites/"),
    # Base directories for suites and results
    suites_dir: Path = typer.Option(SUITES_DIR, help="Base directory containing test suites."),
    results_dir: Path = typer.Option(RESULTS_DIR, help="Directory to save benchmark results."),
):
    """
    Runs a specific benchmark test suite for stock impact prediction accuracy.
    """
    logger.info(f"--- Starting Benchmark Run for Suite: {suite_name} ---")

    # --- Dynamically build paths based on suite_name ---
    suite_path = suites_dir / suite_name
    stocks_path = suite_path / "stocks.json"
    test_cases_path = suite_path / "test-cases.json"

    if not suite_path.is_dir():
        logger.error(f"Suite directory not found: {suite_path}")
        raise typer.Exit(code=1)

    # --- 1. Load Data ---
    logger.info(f"Loading stocks for suite '{suite_name}' from: {stocks_path}")
    # Load stocks using the existing Stock schema (requires UUIDs in json)
    all_stocks_list: List[Stock] = load_json_data(stocks_path, Stock)
    stock_map_by_symbol: Dict[str, Stock] = {s.symbol: s for s in all_stocks_list}
    stock_map_by_id: Dict[uuid.UUID, Stock] = {s.id: s for s in all_stocks_list}
    logger.info(f"Loaded {len(all_stocks_list)} stocks for suite '{suite_name}'.")

    logger.info(f"Loading test cases for suite '{suite_name}' from: {test_cases_path}")
    test_cases: List[BenchmarkTestCase] = load_json_data(test_cases_path, BenchmarkTestCase)
    logger.info(f"Loaded {len(test_cases)} test cases for suite '{suite_name}'.")

    # --- 2. Prepare for Run ---
    # Ensure base results dir exists
    results_dir.mkdir(parents=True, exist_ok=True)
    benchmark_results: List[BenchmarkSingleResult] = []
    total_evaluated = 0
    total_correct = 0
    # Initialize token counters
    total_input_tokens = 0
    total_output_tokens = 0

    start_time = time.perf_counter()

    # --- 3. Execute Benchmark ---
    for i, test_case in enumerate(test_cases):
        logger.info(f"Processing test case {i+1}/{len(test_cases)}: '{test_case.name}' from suite '{suite_name}'")

        article_content = ArticleContent(
            title=test_case.name,
            description=test_case.description,
        )

        target_symbols = set(test_case.stock_impacts.keys())
        stocks_to_analyze: List[Stock] = []
        for symbol in target_symbols:
            stock = stock_map_by_symbol.get(symbol)
            if stock:
                stocks_to_analyze.append(stock)
            else:
                logger.warning(
                    f"Suite '{suite_name}' test case '{test_case.name}' refers to stock symbol '{symbol}' not found in {stocks_path}. Skipping."
                )

        if not stocks_to_analyze:
            logger.warning(
                f"No valid stocks found for test case '{test_case.name}' in suite '{suite_name}'. Skipping analysis."
            )
            continue

        try:
            # --- Call the core function (assuming token updates are included) ---
            impact_iterator: Iterator[ArticleStockImpact]
            impact_iterator = does_article_impact_stocks(article_content, stocks_to_analyze)

            for impact_result in impact_iterator:
                total_evaluated += 1

                stock = stock_map_by_id.get(impact_result.stock_id)
                if not stock:
                    logger.error(
                        f"Received impact for unknown stock ID {impact_result.stock_id} in test case '{test_case.name}' (Suite: {suite_name}). Skipping."
                    )
                    continue

                expected_severities_str = test_case.stock_impacts.get(stock.symbol, [])
                expected_severities_lower = [s.lower() for s in expected_severities_str]

                predicted_severity_str = severity_enum_to_string(impact_result.impact)
                is_correct = predicted_severity_str in expected_severities_lower

                if is_correct:
                    total_correct += 1

                benchmark_results.append(
                    BenchmarkSingleResult(
                        test_case_name=test_case.name,
                        stock_symbol=stock.symbol,
                        stock_name=stock.name,
                        expected_severities=expected_severities_lower,
                        predicted_severity=predicted_severity_str,
                        is_correct=is_correct,
                        reasoning=impact_result.reason,
                    )
                )

        except Exception as e:
            logger.error(f"Error processing test case '{test_case.name}' in suite '{suite_name}': {e}", exc_info=True)

    end_time = time.perf_counter()
    duration_ms = (end_time - start_time) * 1000

    # --- 4. Calculate Final Metrics ---
    accuracy = (total_correct / total_evaluated) * 100 if total_evaluated > 0 else 0.0

    # --- 5. Save Results ---
    # Include suite_name in the data to be saved
    run_data = BenchmarkRun(
        suite_name=suite_name,  # Added suite name here
        date=datetime.now(timezone.utc),
        time_ms=duration_ms,
        input_tokens_used=None,
        output_tokens_used=None,
        total_cases_evaluated=total_evaluated,
        correct_cases=total_correct,
        accuracy=accuracy,
        results=benchmark_results,
    )

    # Keep filename structure, suite name is inside the JSON content
    results_filename = f"test-results-{suite_name}-{run_data.date.strftime('%Y%m%dT%H%M%S%z')}.json"
    results_path = results_dir / results_filename

    try:
        with open(results_path, 'w', encoding='utf-8') as f:
            f.write(run_data.model_dump_json(indent=2))

        logger.info(f"Benchmark results for suite '{suite_name}' saved to: {results_path}")
    except Exception as e:
        logger.error(f"Failed to save results for suite '{suite_name}' to {results_path}: {e}")

    # --- 6. Print Summary ---
    logger.info(f"--- Benchmark Run Summary for Suite: {suite_name} ---")
    logger.info(f"Execution Time: {duration_ms:.2f} ms")
    logger.info(f"Test Cases Processed: {len(test_cases)}")
    logger.info(f"Total Stock Impacts Evaluated: {total_evaluated}")
    logger.info(f"Correct Predictions: {total_correct}")
    logger.info(f"Accuracy: {accuracy:.2f}%")
    logger.info(f"Input Tokens Used: {total_input_tokens}")
    logger.info(f"Output Tokens Used: {total_output_tokens}")
    logger.info(f"Results file: {results_path}")
    logger.info(f"--- Benchmark Run Finished for Suite: {suite_name} ---")
