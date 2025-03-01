from typing import Union
from os import environ
from .schemas import Article, ArticleIndexingJob
from uuid_extensions import uuid7
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"OPENAI_API_KEY": environ.get("OPENAI_API_KEY")}
    return {"Hello": "World"}

@app.post("/articles")
def process_article(article: Article) -> ArticleIndexingJob:
    return ArticleIndexingJob(id=uuid7(), article=article, status="queued", impacted_stocks=[])

