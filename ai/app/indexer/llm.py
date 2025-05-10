import logging
from typing import Any, Dict, Iterator, Type

from pydantic import BaseModel, Field, create_model

# Import the factory function
from app.llm_providers import get_news_impact_llm_provider
from app.schemas import (
    ArticleContent,
    ArticleStockImpact,
    ArticleStockImpactSeverity,
    LLMUsage,
    Stock,
)

from .llm_variants import ImpactAnalysisVariantConfig, get_selected_variant_config

logger = logging.getLogger(__name__)


def _generate_response_model(stocks: list[Stock], variant_config: ImpactAnalysisVariantConfig) -> Type[BaseModel]:
    """Generates the Pydantic model expected as the LLM response,
    dynamically including reasoning fields based on the variant_config.use_cot flag."""

    stock_analysis_fields: Dict[str, Any] = {}

    if variant_config.use_cot:
        stock_analysis_fields['0_would_the_article_impact_this_stock'] = (
            str,
            Field(description="Reasoning if the article would impact this stock? Why?"),
        )
        stock_analysis_fields['0_how_severe_would_the_impact_be'] = (
            str,
            Field(description="If applies, how severe be the impact?"),
        )

    # Impact last - ensure the order is correct in CoT
    stock_analysis_fields['1_impact'] = (
        ArticleStockImpactSeverity,
        Field(description="The predicted impact severity."),
    )

    StockImpactReasoningDynamic = create_model(
        f'StockImpactReasoningDynamic_{variant_config.symbol.value}_{"_".join(sorted(stock_analysis_fields.keys()))}',
        **stock_analysis_fields,
    )

    fields = {
        stock.symbol: (StockImpactReasoningDynamic, Field(description=f"Analysis for {stock.name} ({stock.symbol})"))
        for stock in stocks
    }
    model_name = f'StockResponseModel_{variant_config.symbol.value}_' + '_'.join(sorted(fields.keys()))
    StockResponseModel = create_model(model_name, **fields)
    logger.debug(
        f"Generated dynamic response model: {model_name} for variant '{variant_config.symbol.value}' (use_cot={variant_config.use_cot}) with schema fields: {list(stock_analysis_fields.keys())}"
    )
    return StockResponseModel


def _generate_messages(
    article: ArticleContent, stocks: list[Stock], variant_config: ImpactAnalysisVariantConfig
) -> list[dict]:
    """Generates the system and user messages for the LLM prompt."""
    stocks_description = ""
    for stock in stocks:
        stocks_description += f"- Symbol: {stock.symbol}\n"
        stocks_description += f"  Name: {stock.name}\n"
        stocks_description += f"  Description: {stock.description}\n"
        if stock.city:
            stocks_description += f"  City: {stock.city}\n"
        if stock.country:
            stocks_description += f"  Country: {stock.country}\n"
        if stock.ekd:
            stocks_description += f"  EKD: {stock.ekd}\n"
        stocks_description = stocks_description.rstrip() + "\n"

    system_prompt = variant_config.system_prompt_template.format(stocks_description=stocks_description.strip())

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


def does_article_impact_stocks(article: ArticleContent, stocks: list[Stock]) -> Iterator[ArticleStockImpact | LLMUsage]:
    """
    Analyzes if an article impacts a list of stocks using the configured LLM provider.
    """
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
    # Get the currently selected variant configuration
    current_variant_config = get_selected_variant_config()
    logger.info(
        f"Using LLM impact analysis variant: {current_variant_config.symbol.value} (use_cot for schema={current_variant_config.use_cot})"
    )

    # Chunk stocks for processing - adjust chunk size as needed
    # Chunk size might depend on provider context limits and complexity
    # Let's keep 10 for now, may need tuning per provider.
    chunk_size = 10
    stock_groups = [valid_stocks[i : i + chunk_size] for i in range(0, len(valid_stocks), chunk_size)]

    for i, stock_group in enumerate(stock_groups):
        logger.info(
            f"Processing stock group {i+1}/{len(stock_groups)} (up to {chunk_size} stocks) with {llm_provider.__class__.__name__} using variant '{current_variant_config.symbol.value}'..."
        )

        # Generate the dynamic response model for this specific group of stocks and variant
        ResponseModel = _generate_response_model(stock_group, current_variant_config)

        # Generate the prompt messages
        messages = _generate_messages(article, stock_group, current_variant_config)

        try:
            # Call the abstracted provider method
            structured_response, usage = llm_provider.prompt_structured(
                messages=messages,
                response_format=ResponseModel,  # This model now has a variant-specific structure
                temperature=0.5,
            )
            yield usage

            # Process the structured response
            for stock in stock_group:
                try:
                    # stock_response_data is an instance of the dynamically created StockImpactReasoningDynamic model
                    stock_response_data = getattr(structured_response, stock.symbol)

                    reason_parts = []
                    # Only attempt to access reasoning attributes if the variant's use_cot is True
                    if current_variant_config.use_cot:
                        reason_impact = getattr(stock_response_data, '0_would_the_article_impact_this_stock', None)
                        reason_severity = getattr(stock_response_data, '0_how_severe_would_the_impact_be', None)
                        if reason_impact:
                            reason_parts.append(f"Impact Reasoning: {reason_impact}")
                        if reason_severity:
                            reason_parts.append(f"Severity Reasoning: {reason_severity}")

                    final_reason = "\n".join(reason_parts) if reason_parts else None

                    yield ArticleStockImpact(
                        stock_id=stock.id,
                        impact=getattr(stock_response_data, "1_impact"),
                        reason=final_reason,
                    )
                except AttributeError as ae:
                    logger.warning(
                        f"Attribute error processing stock '{stock.symbol}' in LLM response for group {i+1}. Error: {ae}. "
                        f"LLM: {llm_provider.__class__.__name__}/{llm_provider.model_name}, Variant: {current_variant_config.symbol.value}. Skipping."
                    )
                except Exception as parse_err:
                    logger.error(
                        f"Error processing stock '{stock.symbol}' from LLM response for group {i+1}: {parse_err}. LLM: {llm_provider.__class__.__name__}/{llm_provider.model_name}, Variant: {current_variant_config.symbol.value}. Skipping.",
                        exc_info=True,
                    )

        except (ValueError, RuntimeError, Exception) as e:
            # Handle errors during the LLM call for this chunk
            logger.error(
                f"Failed to get structured response from LLM ({llm_provider.__class__.__name__}/{llm_provider.model_name}) for stock group {i+1} using variant '{current_variant_config.symbol.value}'. Error: {e}",
                exc_info=True,  # Include traceback for debugging
            )
            logger.warning(f"Skipping stock impact analysis for group {i+1} due to LLM error.")
            continue  # Move to the next chunk
