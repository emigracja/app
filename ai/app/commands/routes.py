# app/commands/routes.py
import logging

from fastapi import APIRouter

from app import schemas  # Use relative imports within the app package

from . import llm

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/commands",
    tags=["Commands"],
)


@router.post("/parse", response_model=schemas.ApiResponse[schemas.CommandParseResult])
def parse_command(
    request: schemas.ParseCommandRequest,
) -> schemas.ApiResponse[schemas.CommandParseResult]:
    """
    Parses natural language text into a structured command intent for the mobile app.
    """
    try:
        # Call the command parsing logic
        command_result = llm.parse_command_intent(request.text)
        return schemas.ApiResponse(data=command_result)
    except Exception as e:
        logger.warning(f"Failed to parse command: {request.text}")
        logger.exception(e)
        # Return unknown intent within the success structure for graceful client handling
        return schemas.ApiResponse(
            data=schemas.CommandParseResult(intent=schemas.CommandIntent.unknown),
            error=f"Failed to parse command: {str(e)}",
            error_code="parsing_failed",
        )
