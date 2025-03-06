from typing import Iterator
import logging 
from app.schemas import ArticleContent, ArticleStockImpact, ArticleStockImpactSeverity, Stock
from app.indexer.openai_llm import prompt_openai_llm


logger = logging.getLogger(__name__)


def does_article_impact_stocks(article: ArticleContent, stocks: list[Stock]) -> Iterator[ArticleStockImpact]:
    # This is a dummy implementation that just returns an impact on all stocks
    for stock in stocks:
        yield ArticleStockImpact(
            stock_id=stock.id,
            stock_symbol=stock.symbol,
            impact=ArticleStockImpactSeverity.severe,
            reason="Dummy reason",
        )
