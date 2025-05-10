import logging
from time import sleep
from uuid import UUID

from app import backend_api
from app.database import get_article, update_article
from app.schemas import Article, ArticleStatus, LLMUsage

from . import llm

logger = logging.getLogger(__name__)


def index_article(id: UUID) -> None:
    logging.info(f"Attempting to index article {id}.")
    article = get_article(id)
    if article is None:
        logging.error(f"The article does not exist. Abandoning the job.")
        return

    if article.status != ArticleStatus.queued:
        logging.error(f"Received an article in an invalid state {article.status}! Abandoning the job.")
        return

    article.status = ArticleStatus.processing
    update_article(article)
    error_message = None
    try:
        sent_notifications, omitted_notifications = _process_article(article)
        success = omitted_notifications == 0
        if not success:
            error_message = f"Failed to send {omitted_notifications} notifications out of {sent_notifications + omitted_notifications} article stock impacts."
    except Exception as e:
        logging.exception(e)
        success = False
        error_message = str(e)

    article.status = ArticleStatus.completed if success else ArticleStatus.failed
    article.error_message = error_message
    update_article(article)
    logging.info(f"Indexing article {id} has been completed. Success: {success}")


def _process_article(article: Article) -> tuple[int, int]:
    stocks = backend_api.get_stocks()
    sent_notifications, omitted_notifications = 0, 0
    for impact in llm.does_article_impact_stocks(article.content, stocks):
        # Ignore LLM usage information
        if isinstance(impact, LLMUsage):
            logging.info(f"LLM usage detected: {impact}")
            continue

        article.impacted_stocks.append(impact)
        if article.external_id is None:
            logging.info(f"Article {article.id} has no external ID. Skipping notification.")
            omitted_notifications += 1
            continue

        if backend_api.send_article_stock_impact(article.external_id, impact):
            sent_notifications += 1
        else:
            omitted_notifications += 1

    return sent_notifications, omitted_notifications
