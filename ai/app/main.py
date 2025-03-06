import logging
from uuid import UUID

from fastapi import BackgroundTasks, FastAPI, Response

from . import database, schemas, indexer
from .schemas import ArticleContent, Article

# set DEBUG level of logs
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


app = FastAPI()


@app.get("/")
def read_root() -> schemas.ApiResponse[dict]:
    return schemas.ApiResponse(data={"hello": "world"})


@app.post("/articles")
def process_article(article: ArticleContent, background_tasks: BackgroundTasks) -> schemas.ApiResponse[Article]:
    try:
        article = database.create_article(article)
        background_tasks.add_task(indexer.index_article, article.id)
        return schemas.ApiResponse(data=article)
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))


@app.get("/articles")
def get_articles() -> schemas.ApiResponse[schemas.ArticleList]:
    try:
        articles = database.get_articles()
        return schemas.ApiResponse(data=schemas.ArticleList(articles=articles))
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))

@app.get("/articles/{id}")
def get_article(id: UUID, response: Response) -> schemas.ApiResponse[Article]:
    try:
        article = database.get_article(id)
        if article is None:
            response.status_code = 404
            return schemas.ApiResponse(error="Article not found.", error_code="not_found")
        return schemas.ApiResponse(data=article)
    except Exception as e:
        logger.exception(e)
        return schemas.ApiResponse(error=str(e))

