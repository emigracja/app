import json
import logging
import os
from typing import Type

# New SDK imports
from google import genai
from google.genai import types
from pydantic import BaseModel

from .base import LLMProvider

logger = logging.getLogger(__name__)

# Global client initialization using the new SDK
GEMINI_API_KEY_ENV = os.getenv("GEMINI_API_KEY")
client: genai.Client | None = None
API_KEY_CONFIGURED_SUCCESSFULLY = False

if not GEMINI_API_KEY_ENV:
    logger.warning("GEMINI_API_KEY environment variable not set. Google Provider will not work.")
else:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY_ENV)
        API_KEY_CONFIGURED_SUCCESSFULLY = True
        logger.info("Google GenAI client configured successfully with google-genai SDK.")
    except Exception as e:
        logger.error(f"Failed to create Google GenAI client with google-genai SDK, check API Key: {e}")


class GoogleProvider(LLMProvider):
    """LLM Provider implementation for Google Gemini API using the google-genai SDK."""

    def __init__(self, model_name: str):
        super().__init__(model_name)
        if not API_KEY_CONFIGURED_SUCCESSFULLY or client is None:
            raise RuntimeError("Google Gemini API Key not configured or client initialization failed.")
        self.client: genai.Client = client

    def _convert_messages_to_contents_and_system_instruction(
        self, messages: list[dict]
    ) -> tuple[list[types.Content], str | None]:
        """
        Converts OpenAI-style messages list to google.genai.types.Content list
        and extracts a system instruction.
        Gemini uses 'model' for assistant role and 'user' for user role.
        """
        converted_contents: list[types.Content] = []
        system_instruction_parts: list[str] = []

        for message in messages:
            role = message.get("role")
            content_text = message.get("content", "")
            if not content_text:  # Skip messages with no actual content
                logger.debug("Skipping message with empty content.")
                continue

            if role == "system":
                system_instruction_parts.append(content_text)
            elif role == "user":
                converted_contents.append(types.Content(role="user", parts=[types.Part.from_text(text=content_text)]))
            elif role == "assistant":
                converted_contents.append(types.Content(role="model", parts=[types.Part.from_text(text=content_text)]))
            elif role == "model":
                converted_contents.append(types.Content(role="model", parts=[types.Part.from_text(text=content_text)]))
            else:
                logger.warning(f"Unsupported message role '{role}' with content will be ignored.")

        final_system_instruction = "\n".join(system_instruction_parts).strip() if system_instruction_parts else None

        return converted_contents, final_system_instruction

    def prompt_structured(
        self,
        messages: list[dict],
        response_format: Type[BaseModel],
        temperature: float = 0.5,
        max_tokens: int | None = None,
    ) -> BaseModel:
        self._log_prompt(messages)

        contents, system_instruction = self._convert_messages_to_contents_and_system_instruction(messages)

        if not contents:
            logger.error(
                "No user/assistant messages provided to prompt_structured after conversion. Cannot generate content."
            )
            raise ValueError(
                "Cannot call Gemini with no user/assistant messages. At least one 'user' message is typically required in the `contents` list."
            )

        # Prepare GenerationConfig arguments
        gen_config_dict = {
            "response_mime_type": "application/json",
            "response_schema": response_format,  # Pass the Pydantic model type directly
            "temperature": temperature,
        }
        if max_tokens is not None:
            gen_config_dict["max_output_tokens"] = max_tokens

        if system_instruction:
            # system_instruction in GenerateContentConfig should be a string
            gen_config_dict["system_instruction"] = system_instruction

        # Safety settings: Use the enum members from google.genai.types
        safety_settings_list = [
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=types.HarmBlockThreshold.BLOCK_NONE
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=types.HarmBlockThreshold.BLOCK_NONE
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.BLOCK_NONE,
            ),
        ]
        gen_config_dict["safety_settings"] = safety_settings_list

        generation_config = types.GenerateContentConfig(**gen_config_dict)

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=generation_config,
            )

            # Check for issues at the response level (e.g., prompt blocked)
            if not response.candidates:
                block_reason_msg = "Unknown reason"
                if response.prompt_feedback:
                    block_reason = (
                        response.prompt_feedback.block_reason.name
                        if response.prompt_feedback.block_reason
                        else "Not specified"
                    )
                    safety_ratings_details = [str(sr) for sr in response.prompt_feedback.safety_ratings]
                    block_reason_msg = (
                        f"Prompt feedback: Block Reason: {block_reason}, Safety Ratings: {safety_ratings_details}"
                    )
                    logger.error(f"Gemini response has no candidates. {block_reason_msg}")
                else:
                    logger.error("Gemini response has no candidates and no prompt_feedback provided.")
                raise ValueError(f"Gemini response is empty or has no candidates. {block_reason_msg}")

            raw_json_output = response.text
            logger.debug(
                f"[{self.__class__.__name__}/{self.model_name}] Received raw JSON response from Google Gemini: {raw_json_output}"
            )

            return response.parsed

        except Exception as e:
            logger.error(
                f"Unexpected error during Google Gemini API call or processing for model {self.model_name}: {e}"
            )
            # Log details from response object if it exists (e.g., if error happened during parsing post-API call)
            if 'response' in locals() and response:
                if hasattr(response, 'text') and response.text:
                    logger.error(f"Gemini Raw Response Text (at time of error): {response.text[:500]}...")
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    logger.error(f"Gemini Prompt Feedback (at time of error): {response.prompt_feedback}")
                if hasattr(response, 'candidates') and response.candidates:
                    candidate_info = response.candidates[0]
                    logger.error(
                        f"Gemini Candidate Info (at time of error): Finish Reason: {candidate_info.finish_reason.name}, Safety: {[str(sr) for sr in candidate_info.safety_ratings]}"
                    )
            raise
