from typing import Iterator

from .schemas import Article, ArticleStockImpact, ArticleStockImpactSeverity, Stock


def does_article_impact_stocks(article: Article, stocks: list[Stock]) -> Iterator[ArticleStockImpact]:
    # This is a dummy implementation that just returns an impact on all stocks
    for stock in stocks:
        yield ArticleStockImpact(
            stock_id=stock.id,
            stock_symbol=stock.symbol,
            impact=ArticleStockImpactSeverity.severe,
            reason="Dummy reason",
        )
