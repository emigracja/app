import logging
from time import sleep
from uuid import UUID
from .database import get_article_indexing_job, update_article_indexing_job
from .schemas import ArticleIndexingJobStatus

logger = logging.getLogger(__name__)

def process_article_indexing_job(id: UUID) -> None:
    logging.info(f"Attempting to process job {id}.")
    article_indexing_job = get_article_indexing_job(id)
    if article_indexing_job is None:
        logging.error(f"The article indexing job does not exist. Abandoning the job.")
        return

    if article_indexing_job.status != ArticleIndexingJobStatus.queued:
        logging.error(f"Received an article indexing job in an invalid state {article_indexing_job.status}! Abandoning the job.")
        return 

    article_indexing_job.status = ArticleIndexingJobStatus.processing
    update_article_indexing_job(article_indexing_job)

    print("indexing article!")
    sleep(10)
    print("still indexing")
    sleep(10)
    print(f"fully indexed {id}") 

    article_indexing_job.status = ArticleIndexingJobStatus.completed
    update_article_indexing_job(article_indexing_job)
    logging.info(f"Job {id} has been completed.")
