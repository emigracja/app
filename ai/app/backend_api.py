import logging
import os
import uuid

import requests

from .schemas import ArticleStockImpact, Stock

logger = logging.getLogger(__name__)

BACKEND_API_URL = os.getenv("BACKEND_API_URL", None)
if BACKEND_API_URL is None:
    raise ValueError("BACKEND_API_URL environment variable is not set. The application won't work correctly.")


def get_stocks() -> list[Stock]:
    # TODO: #20: Adapt it to the final URL once #3 is completed
    logging.info("Attempting to fetch the list of stocks from the backend API.")
    url = f"{BACKEND_API_URL}/stock"
    response = requests.get(url)
    response.raise_for_status()

    # Transform response JSON to Stock objects
    stocks = [Stock(**stock) for stock in response.json()]
    return stocks


def send_article_stock_impact(article_id: uuid.UUID, article_stock_impact: ArticleStockImpact) -> bool:
    # TODO: #20: Adapt it to the final URL and schema once #6 is completed
    logger.info(
        f"Notifying the backend API about stock {article_stock_impact.stock_id} impacting article {article_id} with {article_stock_impact.impact} impact due to reason '{article_stock_impact.reason}'."
    )

    request_body = {
        "stock_id": str(article_stock_impact.stock_id),
        "impact": article_stock_impact.impact.name,
        "reason": article_stock_impact.reason,
    }

    url = f"{BACKEND_API_URL}/article/impact"
    try:
        response = requests.post(url, json=request_body)
    except Exception as e:
        logger.warning(
            f"Failed to notify the backend API about stock {article_stock_impact.stock_id} impacting article {article_id} with {article_stock_impact.impact} impact due to reason '{article_stock_impact.reason}'."
        )
        logger.exception(e)
        return False

    if response.status_code > 399:
        logger.warning(
            f"Failed to notify the backend API about stock {article_stock_impact.stock_id} impacting article {article_id} with {article_stock_impact.impact} impact due to reason '{article_stock_impact.reason}'."
        )
        logger.warning(response.text)
        return False

    return True
