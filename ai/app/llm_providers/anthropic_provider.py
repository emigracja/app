import json
import logging
import os
from typing import Type

from anthropic import Anthropic
from pydantic import BaseModel

from app.schemas import LLMUsage

from .base import LLMProvider

logger = logging.getLogger(__name__)

API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    logger.warning("ANTHROPIC_API_KEY environment variable not set. Anthropic Provider will not work.")


class AnthropicProvider(LLMProvider):
    """LLM Provider implementation for Anthropic Claude API."""

    def __init__(self, model_name: str):
        super().__init__(model_name)
        if not API_KEY:
            raise RuntimeError("Anthropic API Key not configured.")
        self._client: Anthropic | None = None

    @property
    def client(self) -> Anthropic:
        """Get the Anthropic client, initializing it if necessary."""
        if self._client is None:
            try:
                self._client = Anthropic(api_key=API_KEY)
                logger.info("Anthropic client initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Anthropic client: {e}")
                raise RuntimeError("Failed to initialize Anthropic client. Check API key and connectivity.") from e
        return self._client

    def _convert_pydantic_to_claude_tool(self, pydantic_model: Type[BaseModel]) -> dict:
        """Converts a Pydantic model into Claude's tool schema format."""
        if not hasattr(pydantic_model, "model_json_schema"):
            raise TypeError("Provided model does not support Pydantic v2 'model_json_schema()'")

        schema = pydantic_model.model_json_schema()

        # Claude tool format
        tool_name = schema.get("title", pydantic_model.__name__)  # Use schema title or class name
        tool_description = schema.get(
            "description", f"Extract information using the {tool_name} structure."
        )  # Use schema description or generate one

        return {
            "name": tool_name,
            "description": tool_description,
            "input_schema": schema,
        }

    def _convert_messages_for_claude(self, messages: list[dict]) -> tuple[str | None, list[dict]]:
        """Separates system prompt and formats user/assistant messages for Claude."""
        claude_messages = []
        system_prompt = None
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content")
            if role == "system":
                if system_prompt:  # Append if multiple system messages exist
                    system_prompt += "\n" + str(content)
                else:
                    system_prompt = str(content)
            elif role in ["user", "assistant"]:
                claude_messages.append({"role": role, "content": content})
            else:
                logger.warning(f"Unsupported role '{role}' for Claude, skipping message.")
        return system_prompt, claude_messages

    def prompt_structured(
        self,
        messages: list[dict],
        response_format: Type[BaseModel],
        temperature: float = 0.5,
        max_tokens: int | None = 4096,  # Claude requires max_tokens
    ) -> BaseModel:
        if not API_KEY:
            raise RuntimeError("Anthropic API Key not configured.")

        self._log_prompt(messages)

        # Convert Pydantic model to Claude tool schema
        tool_definition = self._convert_pydantic_to_claude_tool(response_format)
        tool_name = tool_definition["name"]

        # Separate system prompt from messages
        system_prompt, claude_messages = self._convert_messages_for_claude(messages)

        if not claude_messages:
            raise ValueError("No user or assistant messages provided for Claude.")

        try:
            message = self.client.messages.create(
                model=self.model_name,
                system=system_prompt,
                messages=claude_messages,
                max_tokens=max_tokens or 4096,  # Ensure a value is set
                temperature=temperature,
                tools=[tool_definition],
                tool_choice={"type": "tool", "name": tool_name},  # Force usage of our tool
            )

            # Find the tool_use content block
            tool_use_block = None
            for block in message.content:
                if block.type == "tool_use" and block.name == tool_name:
                    tool_use_block = block
                    break

            if not tool_use_block:
                raise ValueError(f"Tool '{tool_name}' not found in Claude's response.")

            # The structured data is inside the 'input' field of the tool_use block
            structured_data = tool_use_block.input
            logger.debug(
                f"[{self.__class__.__name__}/{self.model_name}] Received structured response from Anthropic Claude."
            )

            input_tokens, output_tokens, cached_read_input_tokens = None, None, None
            if message.usage:
                input_tokens = message.usage.input_tokens
                output_tokens = message.usage.output_tokens
                cached_read_input_tokens = message.usage.cache_read_input_tokens

            return self._parse_json_output(structured_data, response_format), LLMUsage(
                input_tokens=input_tokens, output_tokens=output_tokens, cached_tokens=cached_read_input_tokens
            )

        except Exception as e:
            logger.error(f"Error during Anthropic Claude API call for model {self.model_name}: {e}")
            try:
                logger.error(f"Claude Raw Response Content: {message.content}")
            except:
                pass
            raise
