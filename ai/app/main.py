import logging
from uuid import UUID

from fastapi import BackgroundTasks, FastAPI, HTTPException, Response

from . import database, schemas
from .commands.routes import router as commands_router
from .schemas import Article, ArticleContent
from .tasks import process_news

# set DEBUG level of logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()
app.include_router(commands_router)


@app.get("/")
def read_root() -> schemas.ApiResponse[dict]:
    return schemas.ApiResponse(data={"hello": "world"})


@app.post("/articles")
def process_article_endpoint(article_content: ArticleContent) -> schemas.ApiResponse[Article]:  # Renamed input variable
    try:
        article_db_obj = database.create_article(article_content)
        logger.info(f"Article {article_db_obj.id} received...")
        process_news.send(str(article_db_obj.id))
        logger.info(f"Article {article_db_obj.id} received - task sent to queue for processing.")
        return schemas.ApiResponse(data=article_db_obj)
    except Exception as e:
        logger.exception(f"Failed to create article or queue for processing: {e}")
        return schemas.ApiResponse(
            error=f"Failed to process article request: {str(e)}", error_code="article_processing_failed"
        )


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


@app.post("/set-log-level/{level}")
async def set_log_level(level: str):
    level_mapping = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL,
    }

    if level.upper() in level_mapping:
        logging.getLogger().setLevel(level_mapping[level.upper()])
        logger.info(f"Log level changed to {level.upper()}")
        return {"message": f"Log level changed to {level.upper()}"}
    else:
        raise HTTPException(
            status_code=400, detail="Invalid log level. Valid levels are: DEBUG, INFO, WARNING, ERROR, CRITICAL."
        )
