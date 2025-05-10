import logging
import os
from typing import Type

from openai import OpenAI
from pydantic import BaseModel

from .base import LLMProvider

logger = logging.getLogger(__name__)

if not os.getenv("OPENAI_API_KEY"):
    logger.warning("OPENAI_API_KEY environment variable not set. OpenAI Provider will not work.")


class OpenAIProvider(LLMProvider):
    """LLM Provider implementation for OpenAI API."""

    def __init__(self, model_name: str):
        super().__init__(model_name)
        # Lazily initialize client only when needed
        self._client: OpenAI | None = None

    @property
    def client(self) -> OpenAI:
        """Get the OpenAI client, initializing it if necessary."""
        if self._client is None:
            try:
                self._client = OpenAI()
                logger.info("OpenAI client initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
                raise RuntimeError("Failed to initialize OpenAI client. Check API key and connectivity.") from e
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
            # Use the beta client's parse method for direct Pydantic model parsing
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
            # The result should already be a parsed Pydantic object
            parsed_response = chat_completion.choices[0].message.parsed
            logger.debug(f"[{self.__class__.__name__}/{self.model_name}] Received structured response from OpenAI.")
            return parsed_response

        except Exception as e:
            logger.error(f"Error during OpenAI API call for model {self.model_name}: {e}")
            raise
