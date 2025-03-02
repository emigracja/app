import logging
from time import sleep
from uuid import UUID

from . import backend_api, llm
from .database import get_article_indexing_job, update_article_indexing_job
from .schemas import ArticleIndexingJob, ArticleIndexingJobStatus

logger = logging.getLogger(__name__)


def handle_article_indexing_job(id: UUID) -> None:
    logging.info(f"Attempting to process job {id}.")
    article_indexing_job = get_article_indexing_job(id)
    if article_indexing_job is None:
        logging.error(f"The article indexing job does not exist. Abandoning the job.")
        return

    if article_indexing_job.status != ArticleIndexingJobStatus.queued:
        logging.error(
            f"Received an article indexing job in an invalid state {article_indexing_job.status}! Abandoning the job."
        )
        return

    article_indexing_job.status = ArticleIndexingJobStatus.processing
    update_article_indexing_job(article_indexing_job)
    success = _process_article_indexing_job(article_indexing_job)
    article_indexing_job.status = ArticleIndexingJobStatus.completed if success else ArticleIndexingJobStatus.failed
    update_article_indexing_job(article_indexing_job)
    logging.info(f"Job {id} has been completed. Success: {success}")


def _process_article_indexing_job(article_indexing_job: ArticleIndexingJob) -> None:
    stocks = backend_api.get_stocks()
    for impact in llm.does_article_impact_stocks(article_indexing_job.article, stocks):
        if not backend_api.send_article_stock_impact(impact):
            return False

    return True
