import logging
import os
from enum import Enum

from pydantic import BaseModel

logger = logging.getLogger(__name__)


class ImpactAnalysisVariantSymbol(str, Enum):
    DEFAULT_COT = "DEFAULT_COT"
    DEFAULT_NO_COT = "DEFAULT_NO_COT"
    ALTERNATIVE_COT = "ALTERNATIVE_COT"
    ALTERNATIVE_NO_COT = "ALTERNATIVE_NO_COT"


class ImpactAnalysisVariantConfig(BaseModel):
    symbol: ImpactAnalysisVariantSymbol
    system_prompt_template: str
    use_cot: bool


ORIGINAL_DEFAULT_SYSTEM_PROMPT_TEMPLATE = """You are a financial markets expert. Your goal is to analyze if the provided article might impact the stocks listed below. For each stock symbol provided in the output schema, you MUST provide an analysis covering the reasoning and the impact severity.

Respond ONLY with the JSON structure defined by the tool/schema provided. Do NOT add any introductory text, concluding remarks, or markdown formatting around the JSON.

<stocks>
{stocks_description}
</stocks>

Analyze the following article:
"""

# TODO: Modify this template in future
ALTERNATIVE_SYSTEM_PROMPT_TEMPLATE = """As a specialist in financial markets, your task is to assess if the provided news article could affect the listed stocks. For every stock symbol in the designated output schema, deliver an analysis that includes your reasoning and the level of impact.

Your response must strictly adhere to the JSON format defined by the provided tool/schema. Exclude any introductory or concluding text and avoid markdown formatting.

<stocks>
{stocks_description}
</stocks>

Review the following article for analysis:
"""

VARIANTS_CONFIG: dict[ImpactAnalysisVariantSymbol, ImpactAnalysisVariantConfig] = {
    ImpactAnalysisVariantSymbol.DEFAULT_COT: ImpactAnalysisVariantConfig(
        symbol=ImpactAnalysisVariantSymbol.DEFAULT_COT,
        system_prompt_template=ORIGINAL_DEFAULT_SYSTEM_PROMPT_TEMPLATE,
        use_cot=True,
    ),
    ImpactAnalysisVariantSymbol.DEFAULT_NO_COT: ImpactAnalysisVariantConfig(
        symbol=ImpactAnalysisVariantSymbol.DEFAULT_NO_COT,
        system_prompt_template=ORIGINAL_DEFAULT_SYSTEM_PROMPT_TEMPLATE,
        use_cot=False,  # Schema will differ
    ),
    ImpactAnalysisVariantSymbol.ALTERNATIVE_COT: ImpactAnalysisVariantConfig(
        symbol=ImpactAnalysisVariantSymbol.ALTERNATIVE_COT,
        system_prompt_template=ALTERNATIVE_SYSTEM_PROMPT_TEMPLATE,
        use_cot=True,
    ),
    ImpactAnalysisVariantSymbol.ALTERNATIVE_NO_COT: ImpactAnalysisVariantConfig(
        symbol=ImpactAnalysisVariantSymbol.ALTERNATIVE_NO_COT,
        system_prompt_template=ALTERNATIVE_SYSTEM_PROMPT_TEMPLATE,
        use_cot=False,
    ),
}

_DEFAULT_VARIANT_SYMBOL = ImpactAnalysisVariantSymbol.DEFAULT_COT
NEWS_IMPACT_VARIANT_ENV_VAR = "NEWS_IMPACT_VARIANT"


def get_selected_variant_symbol() -> ImpactAnalysisVariantSymbol:
    """
    Determines the selected impact analysis variant symbol based on the
    NEWS_IMPACT_VARIANT environment variable at runtime.
    Defaults to _DEFAULT_VARIANT_SYMBOL if the env var is invalid or not set.
    """
    selected_variant_symbol_str = os.getenv(NEWS_IMPACT_VARIANT_ENV_VAR, _DEFAULT_VARIANT_SYMBOL.value)

    try:
        current_enum_value = ImpactAnalysisVariantSymbol(selected_variant_symbol_str)
        if current_enum_value not in VARIANTS_CONFIG:
            logger.warning(
                f"NEWS_IMPACT_VARIANT '{selected_variant_symbol_str}' is a valid symbol but not configured in VARIANTS_CONFIG. "
                f"Defaulting to '{_DEFAULT_VARIANT_SYMBOL.value}'."
            )
            current_enum_value = _DEFAULT_VARIANT_SYMBOL
    except ValueError:
        logger.warning(
            f"Invalid NEWS_IMPACT_VARIANT value: '{selected_variant_symbol_str}'. "
            f"Defaulting to '{_DEFAULT_VARIANT_SYMBOL.value}'. "
            f"Valid options are: {[s.value for s in ImpactAnalysisVariantSymbol if s in VARIANTS_CONFIG]}"
        )
        current_enum_value = _DEFAULT_VARIANT_SYMBOL
    return current_enum_value


def get_selected_variant_config() -> ImpactAnalysisVariantConfig:
    """
    Gets the configuration for the currently selected impact analysis variant.
    The selection is determined at runtime based on get_selected_variant_symbol().
    """
    current_symbol_enum = get_selected_variant_symbol()
    return VARIANTS_CONFIG[current_symbol_enum]
