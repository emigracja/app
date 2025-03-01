from .schemas import Article, ArticleIndexingJob
from uuid_extensions import uuid7
from uuid import UUID

# Using an in-memory store, as there's no need for persistance atm
article_indexing_jobs = {
    # ID -> job   
}
# TODO: clean this up periodically

def create_article_indexing_job(article: Article) -> ArticleIndexingJob:
    job = ArticleIndexingJob(id=uuid7(), article=article, status="queued", impacted_stocks=[])
    article_indexing_jobs[job.id] = job
    return job

def delete_article_indexing_job(id: UUID) -> bool:
    if id not in article_indexing_jobs:
        return False
    
    del article_indexing_jobs[id]
    return True

def update_article_indexing_job(article_indexing_job: ArticleIndexingJob) -> bool:
    if article_indexing_job.id not in article_indexing_jobs:
        return False  # Not persisted in database 
    
    article_indexing_jobs[article_indexing_job.id] = article_indexing_job
    return True 

def get_article_indexing_jobs() -> list[ArticleIndexingJob]:
    return article_indexing_jobs.values()

def get_article_indexing_job(id: UUID) -> ArticleIndexingJob|None:
    return article_indexing_jobs.get(id, None)
