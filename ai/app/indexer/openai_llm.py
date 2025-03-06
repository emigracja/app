from typing import Optional

from openai import OpenAI
from pydantic import BaseModel

# Init it on demand, because if
# - the user doesn't provide an OPENAI_API key
# - and the app doesn't use OpenAI API
# The app still should work
_openai_client = None


def openai_client() -> OpenAI:
    global _openai_client

    if not _openai_client:
        _openai_client = OpenAI()

    return _openai_client


def prompt_openai_llm(
    messages: list[dict],
    model: str,
    temperature: float = 1.0,
    max_tokens: int | None = None,
    response_format: Optional[BaseModel] = None,
) -> str | BaseModel:
    # TODO: fix type - generics
    client = openai_client()

    # Currently client.beta doesn't support response_format = None
    if response_format is None:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )
        return chat_completion.choices[0].message.content
    else:
        chat_completion = client.beta.chat.completions.parse(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            response_format=response_format,
        )
        return chat_completion.choices[0].message.parsed
