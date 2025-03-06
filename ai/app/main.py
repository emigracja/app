import logging
from os import environ
from typing import Union
from uuid import UUID

from fastapi import BackgroundTasks, FastAPI, Response

from . import database, worker, schemas
from .schemas import Article, ArticleIndexingJob

# set DEBUG level of logs
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


app = FastAPI()


@app.get("/")
def read_root() -> schemas.ApiResponse[dict]:
    return schemas.ApiResponse(data={"hello": "world"})


def index_article(article: Article, background_tasks: BackgroundTasks) -> ArticleIndexingJob:
    indexing_job = database.create_article_indexing_job(article)
    background_tasks.add_task(worker.handle_article_indexing_job, indexing_job.id)
    return indexing_job


@app.post("/articles")
def process_article(article: Article, background_tasks: BackgroundTasks) -> schemas.ApiResponse[ArticleIndexingJob]:
    try:
        job = index_article(article, background_tasks)
        return schemas.ApiResponse(data=job)
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))


@app.get("/articles")
def get_articles() -> schemas.ApiResponse[schemas.ArticleIndexingJobs]:
    try:
        jobs = database.get_article_indexing_jobs()
        return schemas.ApiResponse(data=schemas.ArticleIndexingJobs(jobs=jobs))
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))

@app.get("/articles/{id}")
def get_article(id: UUID, response: Response) -> schemas.ApiResponse[ArticleIndexingJob]:
    try:
        job = database.get_article_indexing_job(id)
        if job is None:
            response.status_code = 404
            return schemas.ApiResponse(error="Article not found.", error_code="not_found")
        return schemas.ApiResponse(data=job)
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))

