import logging
import os
from functools import lru_cache

from dotenv import load_dotenv

from .base import LLMProvider

# Load .env file for API keys and LLM selection
load_dotenv()

logger = logging.getLogger(__name__)

# --- Environment Variable Configuration ---
# Using NEWS_IMPACT_LLM for the indexer task as requested
NEWS_IMPACT_LLM_CONFIG = os.getenv("NEWS_IMPACT_LLM", "")
COMMAND_PARSE_LLM_CONFIG = os.getenv("COMMAND_PARSE_LLM", "")


# Simple cache to avoid re-parsing the config and re-initializing providers unnecessarily
@lru_cache(maxsize=4)  # Cache instances for news impact and potentially command parsing later
def get_llm_provider(config_string: str) -> LLMProvider:
    """
    Factory function to get an instance of the configured LLM provider.

    Args:
        config_string: The configuration string (e.g., "openai/gpt-4o", "google/gemini-1.5-flash").

    Returns:
        An instance of the appropriate LLMProvider subclass.

    Raises:
        ValueError: If the configuration string is invalid or the provider/model is unsupported.
        RuntimeError: If the required API key for the selected provider is not set.
    """
    logger.info(f"Attempting to create LLM provider for config: '{config_string}'")
    try:
        provider_prefix, model_name = config_string.strip().lower().split('/', 1)
    except ValueError:
        raise ValueError(
            f"Invalid LLM configuration format: '{config_string}'. "
            "Expected format: 'provider/model_name' (e.g., 'openai/gpt-4o', 'google/gemini-2.0-flash')."
        )

    if provider_prefix == "openai":
        from .openai_provider import OpenAIProvider

        return OpenAIProvider(model_name=model_name)
    elif provider_prefix == "google":
        from .google_provider import GoogleProvider

        return GoogleProvider(model_name=model_name)
    elif provider_prefix == "anthropic":
        from .anthropic_provider import AnthropicProvider

        return AnthropicProvider(model_name=model_name)
    elif provider_prefix == "openrouter":
        from .openrouter_provider import OpenRouterProvider

        return OpenRouterProvider(model_name=model_name)
    else:
        raise ValueError(
            f"Unsupported LLM provider prefix: '{provider_prefix}'. Supported prefixes: 'openai', 'google', 'anthropic', 'openrouter'."
        )


# Specific instance for the News Impact task
def get_news_impact_llm_provider() -> LLMProvider:
    """Gets the LLM provider configured for the News Impact task."""
    return get_llm_provider(NEWS_IMPACT_LLM_CONFIG)


# Specific instance for the Command Parsing task
def get_command_parse_llm_provider() -> LLMProvider:
    """Gets the LLM provider configured for the Command Parsing task."""
    return get_llm_provider(COMMAND_PARSE_LLM_CONFIG)
