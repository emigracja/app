import logging
import os
import time
import uuid

import dramatiq
from dramatiq.brokers.rabbitmq import RabbitmqBroker
from dramatiq.middleware import Middleware
from dramatiq.rate_limits import BucketRateLimiter
from dramatiq.rate_limits.backends import RedisBackend
from pika import PlainCredentials

from app import backend_api
from app.database import get_article, update_article
from app.indexer import llm as indexer_llm
from app.schemas import ArticleStatus, ArticleStockImpact, LLMUsage

if not logging.getLogger().handlers:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)

mandatory_env_vars = ["RABBITMQ_HOST", "RABBITMQ_PORT", "RABBITMQ_USER", "RABBITMQ_PASSWORD"]
for var in mandatory_env_vars:
    if not os.getenv(var):
        raise SystemExit(f"Environment variable {var} is not set. The application won't work correctly.")

broker = RabbitmqBroker(
    host=os.getenv("RABBITMQ_HOST"),
    port=int(os.getenv("RABBITMQ_PORT")),
    credentials=PlainCredentials(os.getenv("RABBITMQ_USER"), os.getenv("RABBITMQ_PASSWORD")),
)

REDIS_URL = f"redis://default:{os.getenv('REDIS_PASSWORD')}@{os.getenv('REDIS_HOST')}:{os.getenv('REDIS_PORT')}/"
rate_limiter_backend = RedisBackend(url=REDIS_URL)
# Up to 10 articles / minute
# (1 every 6 seconds)
article_rate_limiter = BucketRateLimiter(backend=rate_limiter_backend, key="article-processing", limit=1, bucket=6_000)

how_often_bucket_refreshes_ms = {
    "llm-usage": 6_000,
}


def acquire_rate_limiter(rate_limiter) -> bool:
    logging.info(f"Trying to acquire rate_limiter {rate_limiter.key}")
    bucket_refresh_ms = how_often_bucket_refreshes_ms.get(rate_limiter.key, 1000)
    wait_for_ms = int(bucket_refresh_ms / 3)
    # Attempt 6 times (arbitrary choice)
    for n in range(6):
        with rate_limiter.acquire(raise_on_failure=False) as acquired:
            if acquired:
                logging.info(f"Rate limiter acquired on try #{n}")
                return True
        logging.debug(f"Rate limiter not acquired on try #{n}. Attempting again in {wait_for_ms} ms")
        time.sleep(wait_for_ms / 1000)
    logging.info(f"Failed to acquire rate limiter after 6 tries.")
    return False


def acquire_article_rate_limiter() -> bool:
    return acquire_rate_limiter(article_rate_limiter)


class HandleArticleProcessingFailureMiddleware(Middleware):
    """
    Handles the final failure of the process_news after all retries are exhausted.
    Updates the article status in the database to 'failed'.
    """

    def after_nack(self, broker, message):
        if message.actor_name != "process_news":
            return

        try:
            if not message.args:
                logger.error(f"Middleware: [{message.actor_name}] Message has no arguments. Cannot extract article_id.")
                return

            article_id_str = message.args[0]
            article_id = uuid.UUID(article_id_str)

            logger.warning(
                f"Middleware: [{message.actor_name}] Task for article {article_id} failed permanently "
                f"after exhausting all retries. Updating status to '{ArticleStatus.failed}'."
            )

            article = get_article(article_id)
            if not article:
                logger.error(
                    f"Middleware: [{message.actor_name}] Article {article_id} not found in database "
                    "when trying to mark as failed."
                )
                return

            article.status = ArticleStatus.failed

            if not update_article(article):
                logger.error(
                    f"Middleware: CRITICAL - [{message.actor_name}] Failed to update article {article_id} "
                    f"to '{ArticleStatus.failed}' status after permanent task failure."
                )
            else:
                logger.info(f"Middleware: [{message.actor_name}] Article {article_id} successfully marked as failed.")

        except Exception as e:
            logger.error(
                f"Middleware: [{message.actor_name}] Exception in after_nack while processing "
                f"message for article_id_str '{message.args[0] if message.args else 'N/A'}': {e}",
                exc_info=True,
            )


# Add the middleware to the broker
broker.add_middleware(HandleArticleProcessingFailureMiddleware())
dramatiq.set_broker(broker)


@dramatiq.actor(queue_name="process_news", max_retries=1, min_backoff=60_000)  # 1 minute
def process_news(article_id_str: str):
    article_id = uuid.UUID(article_id_str)
    logger.info(f"Dramatiq: Received task to process article {article_id}.")
    if not acquire_article_rate_limiter():
        raise f"Dramatiq: Rate limit exceeded for article processing - {article_id}."

    article = get_article(article_id)
    if article is None:
        logger.error(f"Dramatiq: Article {article_id} does not exist. Abandoning task.")
        return

    if article.status in (ArticleStatus.processing, ArticleStatus.failed):
        logger.info(f"Requeuing processing for article {article_id} in state {article.status}.")
    elif article.status != ArticleStatus.queued:
        logger.warning(f"Dramatiq: Article {article_id} is in ignored state - {article.status}. Abandoning task.")
        return

    article.status = ArticleStatus.processing
    if not update_article(article):
        raise f"Dramatiq: Failed to update article {article_id} status to 'processing'."

    logger.info(f"Dramatiq: Started processing article {article_id}.")
    try:
        stocks = backend_api.get_stocks()
        for impact_or_usage in indexer_llm.does_article_impact_stocks(article.content, stocks):
            if isinstance(impact_or_usage, LLMUsage):
                logger.info(f"Dramatiq: LLM usage for article {article_id}: {impact_or_usage}")
                continue

            article_stock_impact: ArticleStockImpact = impact_or_usage
            article.impacted_stocks.append(article_stock_impact)

            if article.external_id is None:
                logger.info(
                    f"Dramatiq: Article {article.id} has no external_id. Skipping notification for stock {article_stock_impact.stock_id}."
                )
                continue

        notify_backend.send(str(article.external_id), article_stock_impact.model_dump(mode='json'))

        article.status = ArticleStatus.completed
        article.error_message = None
        update_article(article)
        logger.info(f"Dramatiq: Article {article_id} processing completed successfully and notifications queued.")

    except Exception as e:
        logger.error(f"Dramatiq: Error during article {article_id} processing. Error: {e}", exc_info=True)
        article.error_message = str(e)
        update_article(article)
        raise


@dramatiq.actor(
    queue_name="notify_backend",
    max_retries=2,
    min_backoff=60_000,  # First retry after ~1 min (60,000 ms).
    # Dramatiq's exponential backoff (min_backoff * 2^(retry_attempt-1))
    # means the second retry will be after ~2 mins (120,000 ms).
)
def notify_backend(article_external_id_str: str, article_stock_impact_data: dict):
    article_external_id = uuid.UUID(article_external_id_str)
    article_stock_impact = ArticleStockImpact(**article_stock_impact_data)

    logger.info(
        f"Dramatiq: Attempting to notify backend for article {article_external_id}, stock {article_stock_impact.stock_id}."
    )

    success = backend_api.send_article_stock_impact(article_external_id, article_stock_impact)

    if not success:
        raise Exception(
            f"Backend API notification indicated failure for article {article_external_id}, "
            f"stock {article_stock_impact.stock_id}. Task will be retried by Dramatiq."
        )

    logger.info(
        f"Dramatiq: Backend notification successful for article {article_external_id}, stock {article_stock_impact.stock_id}."
    )
