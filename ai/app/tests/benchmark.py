# app/tests/benchmark.py

import json
import logging
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

import typer
from pydantic import BaseModel, Field, ValidationError

from app.schemas import ArticleStockImpactSeverity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Configuration ---
TESTS_DIR = "/app/tests"
TEST_CASES_PATH = f"{TESTS_DIR}/test-cases.json"
STOCKS_PATH = f"{TESTS_DIR}/stocks.json"
RESULTS_DIR = f"{TESTS_DIR}/results"


class BenchmarkTestCase(BaseModel):
    name: str  # Corresponds to article title for identification
    description: str  # Corresponds to article description
    # Maps stock *symbol* to a list of *accepted severity strings* (e.g., ["none", "low"])
    stock_impacts: Dict[str, List[str]]


class BenchmarkSingleResult(BaseModel):
    test_case_name: str
    stock_symbol: str
    stock_name: str
    expected_severities: List[str]
    predicted_severity: str
    is_correct: bool
    reasoning: Optional[str] = None


class BenchmarkRun(BaseModel):
    suite_name: str
    date: datetime
    llm_identifier: str = Field(description="LLM provider and model used (e.g., 'openai/gpt-4o')")
    llm_variant_symbol: str = Field(
        description="Symbol of the LLM variant used for news impact analysis (e.g., 'DEFAULT_COT')"
    )
    time_ms: float
    input_tokens_used: Optional[int] = None
    cached_tokens: Optional[int] = None
    output_tokens_used: Optional[int] = None
    total_cases_evaluated: int
    correct_cases: int
    accuracy: float
    results: List[BenchmarkSingleResult]


MODEL_PRICING = {
    "openai/gpt-4.1": {
        "input_per_million": 2.00,
        "cached_input_per_million": 0.50,
        "output_per_million": 8.00,
    },
    "google/gemini-2.5-flash-preview-05-20": {
        "input_per_million": 0.15,
        "cached_input_per_million": 0.0375,
        "output_per_million": 0.60,  # Assuming "Non-thinking" output price
    },
    "google/gemini-2.0-flash": {
        "input_per_million": 0.10,
        "cached_input_per_million": 0.025,
        "output_per_million": 0.40,
    },
    "openai/gpt-4o-mini": {
        "input_per_million": 0.60,
        "cached_input_per_million": 0.3,
        "output_per_million": 2.40,
    },
    "openai/gpt-4o": {
        "input_per_million": 5.00,
        "cached_input_per_million": 2.50,
        "output_per_million": 20.00,
    },
}


def calculate_cost_for_run(
    llm_identifier: str,
    input_tokens: Optional[int],
    output_tokens: Optional[int],
    cached_tokens: Optional[int],
) -> Optional[float]:
    """
    Calculates the estimated cost for a benchmark run based on token usage and LLM pricing.
    Returns None if pricing is not available or if essential token counts are missing.
    """
    pricing_info = MODEL_PRICING.get(llm_identifier)
    if not pricing_info:
        logger.debug(f"No pricing information found for LLM: {llm_identifier}. Cost will be NULL.")
        return None

    _input_tokens = input_tokens if input_tokens is not None else 0
    _output_tokens = output_tokens if output_tokens is not None else 0
    _cached_tokens = cached_tokens if cached_tokens is not None else 0

    if _cached_tokens > _input_tokens:
        logger.error(
            f"Cached tokens ({_cached_tokens}) exceed input tokens ({_input_tokens}) for {llm_identifier}. "
            "This shouldn't happen! Assuming all input tokens are cached."
        )
        _cached_tokens = _input_tokens

    non_cached_input_tokens = _input_tokens - _cached_tokens

    cost = 0.0
    cost += (non_cached_input_tokens / 1_000_000) * pricing_info["input_per_million"]

    if "cached_input_per_million" in pricing_info:
        cost += (_cached_tokens / 1_000_000) * pricing_info["cached_input_per_million"]

    cost += (_output_tokens / 1_000_000) * pricing_info["output_per_million"]

    return round(cost, 8)  # Using 8 decimal places for precision


def load_json_data(path: Path, model: BaseModel) -> List[Any]:
    """Loads and validates a list of JSON objects from a file."""
    if not path.exists():
        logger.error(f"File not found: {path}")
        raise typer.Exit(code=1)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise ValueError("JSON root must be a list.")
        # Check if each dict item has an ID, if not, add a random UUID
        for item in data:
            if not item.get('id'):
                item['id'] = str(uuid.uuid4())
        # Validate each item in the list
        return [model.parse_obj(item) for item in data]
    except (json.JSONDecodeError, ValidationError, ValueError) as e:
        logger.error(f"Error loading or validating {path}: {e}")
        raise typer.Exit(code=1)


def severity_enum_to_string(severity: ArticleStockImpactSeverity) -> str:
    """Converts ArticleStockImpactSeverity enum member to lowercase string."""
    return severity.name.lower()
