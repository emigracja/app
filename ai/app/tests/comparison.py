import csv
import json
import logging
import os
from pathlib import Path

import typer

from app.tests import cli as runner_cli
from app.tests.benchmark import calculate_cost_for_run

logger = logging.getLogger(__name__)

comparison_app = typer.Typer(
    no_args_is_help=True, help="Tools for generating comparison reports by running multiple benchmarks."
)

BASE_TESTS_DIR = Path("/app/tests")
DEFAULT_SUITES_DIR = BASE_TESTS_DIR / "suites"
DEFAULT_RESULTS_DIR = BASE_TESTS_DIR / "results"

CSV_RESULTS_FILE_NAME = "tests.csv"
CSV_HEADERS = [
    "suite_name",
    "llm_identifier",
    "news_impact_variant",
    "date",
    "input_tokens_used",
    "output_tokens_used",
    "cached_tokens",
    "thinking_tokens",
    "cost",
    "total_cases_evaluated",
    "correct_cases",
    "accuracy",
    "tests_filename",
]

LLMS_TO_TEST = [
    "openai/gpt-4o",
    "openai/gpt-4o-mini",
    "openai/gpt-4.1",
    "openai/gpt-4.1-mini",
    "openai/gpt-4.1-nano",
    "google/gemini-2.0-flash",
    "google/gemini-2.5-flash-preview-05-20",
    "google/gemini-2.5-pro-preview-05-06",
    "anthropic/claude-sonnet-4-20250514",
    "anthropic/claude-3-5-haiku-20241022",
]
VARIANTS_TO_TEST = [
    "DEFAULT_COT",
    "DEFAULT_NO_COT",
]


@comparison_app.command("generate-csv")
def generate_comparison_csv(
    suite_name: str = typer.Argument(
        "simple", help="Name of the test suite directory under the suites directory (e.g., 'simple')."
    ),
    suites_dir: Path = typer.Option(DEFAULT_SUITES_DIR, "--suites-dir", help="Base directory containing test suites."),
    results_dir: Path = typer.Option(
        DEFAULT_RESULTS_DIR, "--results-dir", help="Directory to save benchmark JSON results and the aggregate CSV."
    ),
):
    """
    Runs the benchmark suite for multiple LLM and variant combinations,
    calculates costs, and appends results to a CSV file (default: /app/tests/results/tests.csv).
    This command calls the 'run' command for each combination, passing LLM and variant as parameters.
    """
    logger.info(f"Starting CSV generation for suite: {suite_name}")
    logger.info(f"Suites will be read from: {suites_dir}")
    logger.info(f"Individual JSON results and CSV will be saved to: {results_dir}")

    results_dir.mkdir(parents=True, exist_ok=True)
    rows_to_write = []

    for llm_id in LLMS_TO_TEST:
        for variant_symbol in VARIANTS_TO_TEST:
            logger.info(
                f"--- Processing combination for Suite: {suite_name}, LLM: {llm_id}, Variant: {variant_symbol} ---"
            )

            try:
                json_result_path: Path = runner_cli.run(
                    suite_name=suite_name,
                    suites_dir=suites_dir,
                    results_dir=results_dir,
                    llm=llm_id,
                    variant=variant_symbol,
                )
                logger.info(f"Successfully completed run. Results at: {json_result_path}")

                with open(json_result_path, 'r', encoding='utf-8') as f:
                    run_data_dict = json.load(f)

                cost = calculate_cost_for_run(
                    llm_identifier=run_data_dict["llm_identifier"],
                    input_tokens=run_data_dict.get("input_tokens_used"),
                    output_tokens=run_data_dict.get("output_tokens_used"),
                    cached_tokens=run_data_dict.get("cached_tokens"),
                    thinking_tokens=run_data_dict.get("thinking_tokens_used"),
                )

                row = {
                    "suite_name": run_data_dict["suite_name"],
                    "llm_identifier": run_data_dict["llm_identifier"],
                    "news_impact_variant": run_data_dict["llm_variant_symbol"],
                    "date": run_data_dict["date"],
                    "input_tokens_used": run_data_dict.get("input_tokens_used"),
                    "output_tokens_used": run_data_dict.get("output_tokens_used"),
                    "cached_tokens": run_data_dict.get("cached_tokens"),
                    "thinking_tokens": run_data_dict.get("thinking_tokens_used"),
                    "cost": f"{cost:.8f}" if cost is not None else None,
                    "total_cases_evaluated": run_data_dict["total_cases_evaluated"],
                    "correct_cases": run_data_dict["correct_cases"],
                    "accuracy": f"{float(run_data_dict['accuracy']):.2f}",
                    "tests_filename": json_result_path.name,
                }
                rows_to_write.append(row)

            except Exception as e:
                logger.error(
                    f"Failed to run or process results for Suite: {suite_name}, LLM: {llm_id}, Variant: {variant_symbol}. Error: {e}",
                    exc_info=True,
                )

    if rows_to_write:
        csv_file_path = results_dir / CSV_RESULTS_FILE_NAME
        file_exists = csv_file_path.exists()
        try:
            with open(csv_file_path, 'a', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=CSV_HEADERS)
                if not file_exists:
                    writer.writeheader()
                for row_data in rows_to_write:
                    writer.writerow(row_data)
            logger.info(f"Appended {len(rows_to_write)} rows to {csv_file_path}")
        except IOError as e:
            logger.error(f"Failed to write to CSV file {csv_file_path}: {e}")
    else:
        logger.info("No rows were generated to write to CSV.")

    logger.info(f"CSV generation process finished for suite: {suite_name}")
