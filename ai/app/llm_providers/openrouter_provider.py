import logging
import os
from typing import Type

from openai import OpenAI
from pydantic import BaseModel

from app.schemas import LLMUsage

from .base import LLMProvider

logger = logging.getLogger(__name__)

# Check for OPENROUTER_API_KEY
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logger.warning("OPENROUTER_API_KEY environment variable not set. " "OpenRouterProvider will not work.")


class OpenRouterProvider(LLMProvider):
    """LLM Provider implementation for OpenRouter API."""

    BASE_URL = "https://openrouter.ai/api/v1"

    def __init__(self, model_name: str):
        """
        Initializes the OpenRouterProvider.

        Args:
            model_name (str): The OpenRouter model name (e.g., "anthropic/claude-3.7-sonnet").
                              Ensure this model is supported by OpenRouter.
        """
        super().__init__(model_name)
        # Lazily initialize client only when needed
        self._client: OpenAI | None = None

    @property
    def client(self) -> OpenAI:
        """Get the OpenRouter (via OpenAI SDK) client, initializing it if necessary."""
        if self._client is None:
            if not OPENROUTER_API_KEY:
                logger.error("OPENROUTER_API_KEY is not set. Cannot initialize OpenRouter client.")
                raise ValueError(
                    "OPENROUTER_API_KEY environment variable not set. " "OpenRouter Provider cannot be initialized."
                )
            try:
                self._client = OpenAI(
                    base_url=self.BASE_URL,
                    api_key=OPENROUTER_API_KEY,
                )
                logger.info(f"OpenRouter client initialized for model {self.model_name} via {self.BASE_URL}.")
            except Exception as e:
                logger.error(f"Failed to initialize OpenRouter client: {e}")
                raise RuntimeError(
                    "Failed to initialize OpenRouter client. " "Check API key, base URL, and connectivity."
                ) from e
        return self._client

    def prompt_structured(
        self,
        messages: list[dict],
        response_format: Type[BaseModel],
        temperature: float = 0.5,
        max_tokens: int | None = None,
    ) -> BaseModel:
        self._log_prompt(messages)
        try:
            chat_completion = self.client.beta.chat.completions.parse(
                messages=messages,
                model=self.model_name,
                response_format=response_format,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0,
            )
            # The result should already be a parsed Pydantic objects
            parsed_response = chat_completion.choices[0].message.parsed
            logger.debug(f"[{self.__class__.__name__}/{self.model_name}] Received structured response from OpenRouter.")
            logger.debug(chat_completion.choices[0].message.content)
            input_tokens, output_tokens = None, None
            if chat_completion.usage:
                input_tokens = chat_completion.usage.prompt_tokens
                output_tokens = chat_completion.usage.completion_tokens
            return parsed_response, LLMUsage(input_tokens=input_tokens, output_tokens=output_tokens)

        except Exception as e:
            logger.error(f"Error during OpenRouter API call for model {self.model_name}: {e}")
            raise
