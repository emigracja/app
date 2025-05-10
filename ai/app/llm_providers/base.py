import logging
from abc import ABC, abstractmethod
from typing import Any, Type

from pydantic import BaseModel

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        logger.info(f"Initialized LLM provider: {self.__class__.__name__} with model: {self.model_name}")

    @abstractmethod
    def prompt_structured(
        self,
        messages: list[dict],
        response_format: Type[BaseModel],
        temperature: float = 0.5,
        max_tokens: int | None = None,
    ) -> BaseModel:
        """
        Sends a prompt to the LLM and expects a structured response conforming
        to the provided Pydantic model.

        Args:
            messages: A list of message dictionaries (e.g., [{"role": "system", "content": "..."}, {"role": "user", ...}]).
            response_format: The Pydantic model class to parse the response into.
            temperature: The generation temperature.
            max_tokens: The maximum number of tokens to generate.

        Returns:
            An instance of the response_format Pydantic model.

        Raises:
            ValueError: If the LLM response cannot be parsed into the model.
            Exception: For underlying API errors.
        """
        pass

    def _log_prompt(self, messages: list[dict]):
        """Helper to log prompts (consider privacy/verbosity)."""
        # Basic logging, can be expanded or made conditional
        try:
            log_str = f"[{self.__class__.__name__}/{self.model_name}] Prompting with messages:\n"
            for msg in messages:
                # Truncate long content for brevity
                content_preview = str(msg.get('content', ''))[:200] + (
                    '...' if len(str(msg.get('content', ''))) > 200 else ''
                )
                log_str += f"- Role: {msg.get('role', 'N/A')}, Content Preview: {content_preview}\n"
            logger.debug(log_str.strip())
        except Exception as e:
            logger.warning(f"Failed to log prompt details: {e}")

    def _parse_json_output(self, output: Any, response_format: Type[BaseModel]) -> BaseModel:
        """Attempts to parse the LLM output into the Pydantic model."""
        try:
            if isinstance(output, dict):
                # If it's already a dict (e.g., from Claude tool), parse directly
                parsed_obj = response_format.model_validate(output)
            elif isinstance(output, str):
                # If it's a JSON string, parse it first
                import json

                parsed_obj = response_format.model_validate_json(output)
            elif isinstance(output, BaseModel) and type(output) == response_format:
                # If it's already the correct Pydantic object (e.g., from OpenAI beta parse)
                parsed_obj = output
            else:
                raise TypeError(f"Unexpected output type from LLM: {type(output)}")

            logger.debug(
                f"[{self.__class__.__name__}/{self.model_name}] Successfully parsed response into {response_format.__name__}"
            )
            return parsed_obj
        except Exception as e:
            logger.error(
                f"[{self.__class__.__name__}/{self.model_name}] Failed to parse LLM output into {response_format.__name__}. Error: {e}. Raw Output: {output}"
            )
            raise ValueError(f"Failed to parse LLM output into {response_format.__name__}") from e
