import logging
from time import sleep
from uuid import UUID

from . import llm

from app import backend_api
from app.database import get_article, update_article
from app.schemas import Article, ArticleStatus

logger = logging.getLogger(__name__)


def index_article(id: UUID) -> None:
    logging.info(f"Attempting to index article {id}.")
    article = get_article(id)
    if article is None:
        logging.error(f"The article does not exist. Abandoning the job.")
        return

    if article.status != ArticleStatus.queued:
        logging.error(
            f"Received an article in an invalid state {article.status}! Abandoning the job."
        )
        return

    article.status = ArticleStatus.processing
    update_article(article)
    success = _process_article(article)
    article.status = ArticleStatus.completed if success else ArticleStatus.failed
    update_article(article)
    logging.info(f"Indexing article {id} has been completed. Success: {success}")


def _process_article(article: Article) -> None:
    stocks = backend_api.get_stocks()
    for impact in llm.does_article_impact_stocks(article.content, stocks):
        if not backend_api.send_article_stock_impact(impact):
            return False

    return True
