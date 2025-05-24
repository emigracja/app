import logging
import os
import sqlite3
from pathlib import Path
from uuid import UUID

from pydantic import ValidationError
from uuid_extensions import uuid7

from .schemas import Article, ArticleContent, ArticleStatus

logger = logging.getLogger(__name__)

# Database configuration
APP_DATA_DIR_ENV = "/app/data"
DATA_DIR = Path(APP_DATA_DIR_ENV)
DB_FILE_NAME = "articles.db"
DB_FILE_PATH = DATA_DIR / DB_FILE_NAME
TABLE_NAME = "articles"

_db_initialized = False


def _get_db_connection() -> sqlite3.Connection:
    """
    Establishes a connection to the SQLite database.
    Ensures the data directory exists.
    """
    global _db_initialized
    if not _db_initialized:
        try:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
        except OSError as e:
            logger.error(f"Could not create data directory {DATA_DIR}: {e}. Check permissions.")
            raise SystemExit(f"Fatal: Could not create data directory {DATA_DIR}: {e}")

    try:
        conn = sqlite3.connect(str(DB_FILE_PATH), timeout=10, check_same_thread=False)
        return conn
    except sqlite3.Error as e:
        logger.critical(f"CRITICAL: Could not connect to SQLite database at {DB_FILE_PATH}: {e}")
        raise SystemExit(f"Fatal: Could not connect to SQLite database at {DB_FILE_PATH}: {e}")


def _initialize_schema():
    """
    Creates the articles table if it doesn't exist.
    Called once at application startup.
    """
    conn = None
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
                id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                article TEXT NOT NULL
            )
        """
        )
        conn.commit()
        logger.info(f"Database schema verified. Table '{TABLE_NAME}' is ready at {DB_FILE_PATH}.")
    except sqlite3.Error as e:
        logger.critical(f"CRITICAL: Error setting up database schema for '{TABLE_NAME}' at {DB_FILE_PATH}: {e}.")
        if conn:
            conn.rollback()
        raise SystemExit(f"Fatal: Could not initialize database schema: {e}")
    finally:
        if conn:
            conn.close()


def create_article(content: ArticleContent) -> Article:
    article_id = uuid7()
    article = Article(
        id=article_id, content=content, status=ArticleStatus.queued, impacted_stocks=[], external_id=content.external_id
    )
    article_json = article.model_dump_json()

    conn = None
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"INSERT INTO {TABLE_NAME} (id, article) VALUES (?, ?)", (str(article.id), article_json))
        conn.commit()
        logger.info(f"Article {article.id} created and stored in database.")
        return article
    except sqlite3.IntegrityError as e:
        logger.error(f"SQLite integrity error (e.g. duplicate ID) creating article {article.id}: {e}")
        if conn:
            conn.rollback()
        raise
    except sqlite3.Error as e:
        logger.error(f"SQLite error creating article {article.id}: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def delete_article(id: UUID) -> bool:
    conn = None
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM {TABLE_NAME} WHERE id = ?", (str(id),))
        conn.commit()
        if cursor.rowcount == 0:
            logger.warning(f"Attempted to delete article {id}, but it was not found.")
            return False
        logger.info(f"Article {id} deleted from database.")
        return True
    except sqlite3.Error as e:
        logger.error(f"SQLite error deleting article {id}: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def update_article(article: Article) -> bool:
    article_json = article.model_dump_json()
    conn = None
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"UPDATE {TABLE_NAME} SET article = ? WHERE id = ?", (article_json, str(article.id)))
        conn.commit()
        if cursor.rowcount == 0:
            logger.warning(f"Attempted to update article {article.id}, but it was not found (or data was identical).")
            return False

        logger.info(f"Article {article.id} updated in database.")
        return True
    except sqlite3.Error as e:
        logger.error(f"SQLite error updating article {article.id}: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def get_articles() -> list[Article]:
    conn = None
    articles_list = []
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        # Order by created_at descending to get newest articles first
        cursor.execute(f"SELECT article FROM {TABLE_NAME} ORDER BY created_at DESC")
        rows = cursor.fetchall()
        for row in rows:
            try:
                articles_list.append(Article.model_validate_json(row[0]))
            except ValidationError as ve:
                logger.error(f"Pydantic validation error for article data from DB: {ve}. Row data: {row[0][:200]}...")
                # Skip this article - it won't be returned
        return articles_list
    except sqlite3.Error as e:
        logger.error(f"SQLite error fetching articles: {e}")
        raise
    finally:
        if conn:
            conn.close()


def get_article(id: UUID) -> Article | None:
    conn = None
    try:
        conn = _get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT article FROM {TABLE_NAME} WHERE id = ?", (str(id),))
        row = cursor.fetchone()
        if row:
            try:
                return Article.model_validate_json(row[0])
            except ValidationError as ve:
                logger.error(
                    f"Pydantic validation error for article {id} data from DB: {ve}. Row data: {row[0][:200]}..."
                )
                return None
        logger.info(f"Article {id} not found in database.")
        return None
    except sqlite3.Error as e:
        logger.error(f"SQLite error fetching article {id}: {e}")
        raise
    finally:
        if conn:
            conn.close()


if not _db_initialized:
    _initialize_schema()
    _db_initialized = True
