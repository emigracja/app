import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, Generic, TypeVar

from pydantic import BaseModel
from pydantic.generics import GenericModel

M = TypeVar("M", bound=BaseModel)


class ApiResponse(GenericModel, Generic[M]):
    error: Optional[str] = None
    """Optional error message, for ex. "You provided a wrong password!" """

    error_code: Optional[str] = None
    """Optional error code, for ex. "invalid_password" """

    data: Optional[M] = None
    """Optional data object, for ex. {"jwt_token": "J0HNP4ULTH3SEC0ND"} """

class Stock(BaseModel):
    id: uuid.UUID
    symbol: str
    name: str
    description: str
    ekd: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None


class Article(BaseModel):
    title: str
    description: str
    published_at: Optional[datetime] = None


class ArticleStockImpactSeverity(int, Enum):
    none = 0
    low = 10
    medium = 20
    high = 30
    severe = 40


class ArticleStockImpact(BaseModel):
    stock_id: uuid.UUID
    stock_symbol: Optional[str] = None  # for easier API debugging
    impact: ArticleStockImpactSeverity
    reason: Optional[str] = None


class ArticleIndexingJobStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ArticleIndexingJob(BaseModel):
    id: uuid.UUID
    article: Article
    status: ArticleIndexingJobStatus
    impacted_stocks: list[ArticleStockImpact] = []

class ArticleIndexingJobs(BaseModel):
    jobs: list[ArticleIndexingJob]
