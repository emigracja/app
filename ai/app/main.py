from typing import Union
from fastapi import BackgroundTasks
from os import environ
from .schemas import Article, ArticleIndexingJob
from uuid_extensions import uuid7
from fastapi import FastAPI
from time import sleep 
from uuid import UUID
from . import database 

app = FastAPI()


@app.get("/")
def read_root():
    return {"OPENAI_API_KEY": environ.get("OPENAI_API_KEY")}
    return {"Hello": "World"}


def process_article_indexing_job(id: UUID) -> None:
    print("indexing article!")
    sleep(3)
    print("still indexing")
    sleep(3)
    print(f"fully indexed {id}") 


def index_article(article: Article, background_tasks: BackgroundTasks) -> ArticleIndexingJob:
    indexing_job = database.create_article_indexing_job(article)
    background_tasks.add_task(process_article_indexing_job, indexing_job.id)
    return indexing_job


@app.post("/articles")
def process_article(article: Article, background_tasks: BackgroundTasks) -> ArticleIndexingJob:
    job = index_article(article, background_tasks)
    return job 

@app.get("/articles/processing-jobs")
def get_article_processing_jobs() -> list[ArticleIndexingJob]:
    return database.get_article_indexing_jobs()

@app.get("/articles/processing-jobs/{id}")
def get_article_processing_job(id: UUID) -> Union[ArticleIndexingJob, dict[str, str]]:
    job = database.get_article_indexing_job(id)
    if job is None:
        return {"error": "Job not found"}
    return job
