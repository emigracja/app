from uuid import UUID

from uuid_extensions import uuid7

from .schemas import Article, ArticleContent

# Using an in-memory store, as there's no need for persistance atm
articles = {
    # ID -> article
}
# TODO: clean this up periodically


def create_article(content: ArticleContent) -> Article:
    article = Article(id=uuid7(), content=content, status="queued", impacted_stocks=[], external_id=content.external_id)
    articles[article.id] = article
    return article


def delete_article(id: UUID) -> bool:
    if id not in articles:
        return False

    del articles[id]
    return True


def update_article(article: Article) -> bool:
    if article.id not in articles:
        return False  # Not persisted in database

    articles[article.id] = article
    return True


def get_articles() -> list[Article]:
    return articles.values()


def get_article(id: UUID) -> Article | None:
    return articles.get(id, None)
