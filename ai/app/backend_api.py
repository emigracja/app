import logging
import uuid
import requests


from .schemas import ArticleStockImpact, Stock

logger = logging.getLogger(__name__)


def get_stocks() -> list[Stock]:
    # TODO: Fetch the list from backend API
    return [
        Stock(
            id=uuid.uuid4(),
            symbol="AAPL",
            name="Apple Inc.",
            description="Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.",
            city="Cupertino",
            country="United States",
        ),
        Stock(
            id=uuid.uuid4(),
            symbol="MSFT",
            name="Microsoft Corporation",
            description="Microsoft Corporation is an American multinational technology company that produces computer software, consumer electronics, personal computers, and related services.",
            ekd="Technology",
            city="Redmond",
            country="United States",
        ),
        Stock(
            id=uuid.uuid4(),
            symbol="AMZN",
            name="Amazon.com Inc.",
            description="Amazon.com Inc. is an American multinational technology company that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
            ekd="Consumer Cyclical",
            city="Seattle",
            country="United States",
        ),
    ]


def send_article_stock_impact(article_id: uuid.UUID, article_stock_impact: ArticleStockImpact) -> bool:
    # TODO: Adapt it to the final schema once #6 is completed
    # TODO: Move the backend URL to env 
    logger.info(
        f"Notifying the backend API about stock {article_stock_impact.stock_id} impacting article {article_id} with {article_stock_impact.impact} impact due to reason '{article_stock_impact.reason}'."
    )

    request_body = {
        "stock_id": str(article_stock_impact.stock_id),
        "impact": article_stock_impact.impact.name,
        "reason": article_stock_impact.reason,
    }

    url = "http://backend:8080/article/impact"
    response = requests.post(url, json=request_body)
    if response.status_code > 399:
        logger.warning(
            f"Failed to notify the backend API about stock {article_stock_impact.stock_id} impacting article {article_id} with {article_stock_impact.impact} impact due to reason '{article_stock_impact.reason}'."
        )
        logger.warning(response.text)
        return False

    return True
