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

from app.indexer.llm import does_article_impact_stocks
from app.schemas import (
    ArticleContent,
    ArticleStockImpact,
    ArticleStockImpactSeverity,
    Stock,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Configuration ---
TESTS_DIR = "/app/tests"
TEST_CASES_PATH = f"{TESTS_DIR}/test-cases.json"
STOCKS_PATH = f"{TESTS_DIR}/stocks.json"
RESULTS_DIR = f"{TESTS_DIR}/results"


# --- Pydantic Models for JSON Validation and Results ---


class BenchmarkStock(Stock):
    # Inherits all fields from app.schemas.Stock
    # Ensure stocks.json provides all required fields including 'id' (UUID)
    pass


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
    time_ms: float
    input_tokens_used: Optional[int] = None
    output_tokens_used: Optional[int] = None
    total_cases_evaluated: int
    correct_cases: int
    accuracy: float
    results: List[BenchmarkSingleResult]


# --- Helper Functions ---


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
