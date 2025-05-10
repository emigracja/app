import logging
from typing import Iterator, Type

from pydantic import BaseModel, Field, create_model

# Import the factory function
from app.llm_providers import get_news_impact_llm_provider
from app.schemas import (
    ArticleContent,
    ArticleStockImpact,
    ArticleStockImpactSeverity,
    Stock,
)

logger = logging.getLogger(__name__)


class StockImpactReasoning(BaseModel):
    would_the_article_impact_this_stock: str = Field(
        description="Reasoning if the article would impact this stock? Why?"
    )
    how_severe_would_the_impact_be: str = Field(description="If applies, how severe be the impact?")
    impact: ArticleStockImpactSeverity


def _generate_response_model(stocks: list[Stock]) -> Type[BaseModel]:
    """Generates the Pydantic model expected as the LLM response."""
    # Ensure stock symbols are valid Python identifiers
    # For simplicity, assuming symbols are okay for now. Let's add sanitization if issues arise.
    fields = {
        stock.symbol: (StockImpactReasoning, Field(description=f"Reasoning for {stock.name} ({stock.symbol})"))
        for stock in stocks
    }
    # Create a unique model name based on stock symbols to help Pydantic/debugging
    model_name = 'StockResponseModel_' + '_'.join(sorted(fields.keys()))
    StockResponseModel = create_model(model_name, **fields)
    logger.debug(f"Generated dynamic response model: {model_name} with fields: {list(fields.keys())}")
    return StockResponseModel


def _generate_messages(article: ArticleContent, stocks: list[Stock]) -> list[dict]:
    """Generates the system and user messages for the LLM prompt."""
    stocks_description = ""
    for stock in stocks:
        stocks_description += f"- Symbol: {stock.symbol}\n"  # Use Symbol as the key identifier
        stocks_description += f"  Name: {stock.name}\n"
        stocks_description += f"  Description: {stock.description}\n"
        if stock.city:
            stocks_description += f"  City: {stock.city}\n"
        if stock.country:
            stocks_description += f"  Country: {stock.country}\n"
        if stock.ekd:
            stocks_description += f"  EKD: {stock.ekd}\n"
        # Remove trailing newline from the last item for this stock
        stocks_description = stocks_description.rstrip() + "\n"

    system_prompt = f"""You are a financial markets expert. Your goal is to analyze if the provided article might impact the stocks listed below. For each stock symbol provided in the output schema, you MUST provide an analysis covering the reasoning and the impact severity.

Respond ONLY with the JSON structure defined by the tool/schema provided. Do NOT add any introductory text, concluding remarks, or markdown formatting around the JSON.

<stocks>
{stocks_description.strip()}
</stocks>

Analyze the following article:
"""

    # Combine article details into the user prompt (or potentially system prompt depending on model)
    user_prompt = f"""<article_title>
{article.title}
</article_title>

<article_description>
{article.description}
</article_description>

Please provide your analysis for the impact of this article on the specified stocks using the required JSON format. For each stock symbol listed in the requested output format, provide the reasoning and impact severity ({', '.join(e.name for e in ArticleStockImpactSeverity)}).
"""
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    return messages


def does_article_impact_stocks(article: ArticleContent, stocks: list[Stock]) -> Iterator[ArticleStockImpact]:
    """
    Analyzes if an article impacts a list of stocks using the configured LLM provider.

    Args:
        article: The article content.
        stocks: A list of stocks to analyze.

    Yields:
        ArticleStockImpact objects for each stock analyzed.

    Raises:
        ValueError: If stock symbols are not unique.
    """
    # Ensure unique stock symbols
    stock_symbols = set()
    valid_stocks = []
    for stock in stocks:
        if stock.symbol in stock_symbols:
            # Raise or log warning and skip duplicates? Issue implies uniqueness is important.
            raise ValueError(f"Stock symbols must be unique. Duplicate symbol: {stock.symbol}")
        stock_symbols.add(stock.symbol)
        valid_stocks.append(stock)

    if not valid_stocks:
        logger.warning("No valid stocks provided for impact analysis.")
        return

    llm_provider = get_news_impact_llm_provider()
    # Chunk stocks for processing - adjust chunk size as needed
    # Chunk size might depend on provider context limits and complexity
    # Let's keep 10 for now, may need tuning per provider.
    chunk_size = 10
    stock_groups = [valid_stocks[i : i + chunk_size] for i in range(0, len(valid_stocks), chunk_size)]

    for i, stock_group in enumerate(stock_groups):
        logger.info(
            f"Processing stock group {i+1}/{len(stock_groups)} (up to {chunk_size} stocks) with {llm_provider.__class__.__name__}..."
        )

        # Generate the dynamic response model for this specific group of stocks
        ResponseModel = _generate_response_model(stock_group)

        # Generate the prompt messages
        messages = _generate_messages(article, stock_group)

        try:
            # Call the abstracted provider method
            structured_response = llm_provider.prompt_structured(
                messages=messages,
                response_format=ResponseModel,
                temperature=0.5,
            )

            # Process the structured response
            for stock in stock_group:
                try:
                    # Access the analysis for the specific stock symbol
                    stock_response: StockImpactReasoning = getattr(structured_response, stock.symbol)

                    yield ArticleStockImpact(
                        stock_id=stock.id,
                        impact=stock_response.impact,
                        reason=(
                            f"Impact Reasoning: {stock_response.would_the_article_impact_this_stock}\n"
                            f"Severity Reasoning: {stock_response.how_severe_would_the_impact_be}"
                        ),
                    )
                except AttributeError:
                    logger.warning(
                        f"Stock symbol '{stock.symbol}' not found in the LLM response for group {i+1}, "
                        f"despite being requested. LLM: {llm_provider.__class__.__name__}/{llm_provider.model_name}. Skipping."
                    )
                except Exception as parse_err:
                    logger.error(
                        f"Error processing stock '{stock.symbol}' from LLM response for group {i+1}: {parse_err}. LLM: {llm_provider.__class__.__name__}/{llm_provider.model_name}. Skipping.",
                        exc_info=True,
                    )

        except (ValueError, RuntimeError, Exception) as e:
            # Handle errors during the LLM call for this chunk
            logger.error(
                f"Failed to get structured response from LLM ({llm_provider.__class__.__name__}/{llm_provider.model_name}) for stock group {i+1}. Error: {e}",
                exc_info=True,  # Include traceback for debugging
            )
            logger.warning(f"Skipping stock impact analysis for group {i+1} due to LLM error.")
            continue  # Move to the next chunk
