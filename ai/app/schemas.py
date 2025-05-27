import uuid
from datetime import datetime
from enum import Enum, StrEnum
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field
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


class ArticleContent(BaseModel):
    external_id: Optional[uuid.UUID] = None
    title: str
    description: str
    published_at: Optional[datetime] = None


class ArticleStockImpactSeverity(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"
    severe = "severe"


class ArticleStockImpact(BaseModel):
    stock_id: uuid.UUID
    impact: ArticleStockImpactSeverity
    reason: Optional[str] = None


class ArticleStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Article(BaseModel):
    id: uuid.UUID
    content: ArticleContent
    status: ArticleStatus
    impacted_stocks: list[ArticleStockImpact] = []
    error_message: Optional[str] = None
    external_id: Optional[uuid.UUID] = None


class ArticleList(BaseModel):
    articles: list[Article]


class CommandIntent(StrEnum):
    """Enumeration of possible command intents recognized from user text input."""

    all_news = "all_news"
    """User wants to see all available news. Examples: "pokaż wszystkie wiadomości", "show all news" """

    my_news = "my_news"
    """User wants personalized or latest news. Examples: "pokaż moje wiadomości", "show my news", "pokaż najnowsze newsy" """

    all_stocks = "all_stocks"
    """User wants to see all available stocks. Examples: "pokaż wszystkie akcje", "show all stocks" """

    my_stocks = "my_stocks"
    """User wants to see stocks they follow or own. Examples: "pokaż moje akcje", "show my stocks" """

    wallet = "wallet"
    """User wants to see their financial portfolio or wallet. Examples: "pokaż mój portfel", "show my wallet" """

    settings = "settings"
    """User wants to open the application settings. Examples: "otwórz ustawienia", "open settings" """

    homepage = "homepage"
    """User wants to navigate to the main screen or homepage. Examples: "przejdź na stronę główną", "go to homepage" """

    unknown = "unknown"
    """The user's command is unrecognized or does not match any other intent."""


class ParseCommandRequest(BaseModel):
    text: str = Field(..., example="i want to configure my stocks")


class CommandParseResult(BaseModel):
    intent: CommandIntent = Field(..., description="The recognized intent based on the user's text input.")


class LLMUsage(BaseModel):
    input_tokens: Optional[int] = Field(None, description="Number of input tokens used.")
    output_tokens: Optional[int] = Field(None, description="Number of output tokens used.")
    cached_tokens: Optional[int] = Field(None, description="Number of input prompt tokens that were cache hits.")
    thinking_tokens: Optional[int] = Field(None, description="Number of thinking output tokens used.")
