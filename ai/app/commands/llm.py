import logging
from typing import Optional

from app.indexer.openai_llm import prompt_openai_llm
from app.schemas import CommandIntent, CommandParseResult

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """
You are an AI assistant responsible for understanding user commands in a mobile app (available in Polish and English) and classifying them into predefined intents.
Your goal is to determine the user's intention based on their text input and return the corresponding intent enum value.

Possible intents and examples:
- all_news: User wants to see all available news.
  - Polish examples: "pokaż wszystkie wiadomości", "wszystkie newsy", "daj wiadomości"
  - English examples: "show all news", "all news articles", "get the news"
- my_news: User wants to see personalized or latest news relevant to them.
  - Polish examples: "pokaż moje wiadomości", "najnowsze newsy", "co nowego dla mnie?", "dopasowane wiadomości"
  - English examples: "show my news", "latest news", "news for me", "matched news"
- all_stocks: User wants to see all available stocks.
  - Polish examples: "pokaż wszystkie akcje", "wszystkie giełdy", "lista akcji", "poka akcje"
  - English examples: "show all stocks", "list stocks", "all shares"
- my_stocks: User wants to see stocks they follow or own.
  - Polish examples: "pokaż moje akcje", "moje papiery wartościowe", "jakie mam akcje"
  - English examples: "show my stocks", "my shares", "stocks I follow"
- wallet: User wants to see their wallet specifically (there's a wallet/portfel section in the app).
  - Polish examples: "pokaż mój portfel"
  - English examples: "show my wallet", 
- settings: User wants to open the application settings.
  - Polish examples: "otwórz ustawienia", "ustawienia aplikacji", "konfiguracja", "konfiguracja akcji", "skonfiguruj akcje"
  - English examples: "open settings", "app settings", "configuration", "i want to configure my stocks", "i want to set up notifications"
- homepage: User wants to navigate to the main screen or homepage.
  - Polish examples: "przejdź na stronę główną", "ekran główny", "start"
  - English examples: "go to homepage", "main screen", "home"
- unknown: The user's intent is unclear or doesn't match any of the above categories.
  - Polish examples: "jaka jest pogoda?", "pomocy", "co to za aplikacja?"
  - English examples: "what's the weather?", "help", "what is this app?"

Analyze the user's text input and classify it into exactly one of the defined intents. Respond ONLY with the JSON structure containing the determined intent. If the intent is ambiguous or not recognizable, use the 'unknown' intent.
"""


def parse_command_intent(text: str) -> CommandParseResult:
    """
    Uses GPT-4o-mini to parse user text input and classify it into a CommandIntent.

    Args:
        text: The user's text input.

    Returns:
        A CommandParseResult object containing the classified intent.
    """
    logger.info(f"Attempting to parse command intent for text: '{text}'")

    messages = [
        {"role": "system", "content": _SYSTEM_PROMPT},
        {"role": "user", "content": text},
    ]

    try:
        parsed_result = prompt_openai_llm(
            messages=messages,
            model="gpt-4o-mini",
            temperature=0,
            response_format=CommandParseResult,
        )

        if isinstance(parsed_result, CommandParseResult):
            logger.info(f"Successfully parsed intent: {parsed_result.intent.name}")
            return parsed_result
        else:
            # This case should ideally not happen with response_format and a Pydantic model
            raise ValueError(
                f"LLM response was not the expected CommandParseResult type. Type: {type(parsed_result)}. Response: {parsed_result}"
            )

    except Exception as e:
        raise ValueError(f"Error during LLM call for command parsing: {e}")
