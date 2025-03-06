from typing import Iterator
import logging 
from pydantic import BaseModel, Field, create_model
from app.schemas import ArticleContent, ArticleStockImpact, ArticleStockImpactSeverity, Stock
from app.indexer.openai_llm import prompt_openai_llm


logger = logging.getLogger(__name__)

def does_article_impact_stocks(article: ArticleContent, stocks: list[Stock]) -> Iterator[ArticleStockImpact]:
    # First: ensure that stock symbols are unique 
    # This will make the LLM processing a little bit easier, we can change this if needed
    stock_symbols = set()
    for stock in stocks:
        if stock.symbol in stock_symbols:
            raise ValueError(f"Stock symbols must be unique. Duplicate symbol: {stock.symbol}")

        stock_symbols.add(stock.symbol)

    # Chunk stocks for processing - up to 10 at once to prevent hitting the context limit
    stock_groups = [stocks[i:i + 10] for i in range(0, len(stocks), 10)]
    for stock_group in stock_groups:
        response = prompt_openai_llm(
            messages=_generate_openai_messages(article, stock_group),
            model="gpt-4o",
            temperature=0.5,
            response_format=_generate_response_model(article, stock_group)
        )

        for stock in stocks:
            stock_response: StockImpactReasoning = getattr(response, stock.symbol)

            yield ArticleStockImpact(
                stock_id=stock.id,
                impact=stock_response.impact,
                reason=stock_response.would_the_article_impact_this_stock + "\n" + stock_response.how_severe_would_the_impact_be
            )


class StockImpactReasoning(BaseModel):
    would_the_article_impact_this_stock: str = Field(description="Reasoning if the article would impact this stock? Why?")
    how_severe_would_the_impact_be: str = Field(description="If applies, how severe be the impact?")
    impact: ArticleStockImpactSeverity

def _generate_response_model(article: ArticleContent, stocks: list[Stock]) -> BaseModel:
    StockResponseModel = create_model(
        'StockResponseModel',
        **{stock.symbol: (StockImpactReasoning, Field(description=f"Reasoning for {stock.name}")) for stock in stocks}
    )
    return StockResponseModel

def _generate_openai_messages(article: ArticleContent, stocks: list[Stock]) -> list[dict]:
    openai_messages = [
        {"role": "system", "content": _generate_system_prompt(article, stocks)},
        {"role": "user", "content": _generate_user_prompt(article, stocks)}
    ]
    logging.info(openai_messages)
    return openai_messages

def _generate_system_prompt(article: ArticleContent, stocks: list[Stock]) -> str:
    stocks_description = ""
    for stock in stocks:
        stocks_description += f"- Name: {stock.name} ({stock.symbol})\n"
        stocks_description += f"- Description: {stock.description}\n"
        if stock.city:
            stocks_description += f"- City: {stock.city}\n"
        if stock.country:
            stocks_description += f"- Country: {stock.country}\n"
        if stock.ekd:
            stocks_description += f"- EKD: {stock.ekd}\n"
        stocks_description = stocks_description[:-1]  # Remove the last newline

    system_prompt = f"""You are a financial markets expert. Your goal is to analyze if the provided article might impact the stocks provided in response.

<stocks>
{stocks_description}
</stocks>
"""

    return system_prompt

def _generate_user_prompt(article: ArticleContent, stocks: list[Stock]) -> str:
    # TODO: use date from article.published_at
    user_prompt = f"""<article_name>
{article.title}
</article_name>

<article_description>
{article.description}
</article_description>""" 
    
    return user_prompt
