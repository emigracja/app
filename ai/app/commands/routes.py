# app/commands/routes.py
import io
import logging
from enum import StrEnum

import openai
from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

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
        command_result, llm_usage = llm.parse_command_intent(request.text)
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


class WhisperModel(StrEnum):
    """
    Enumeration of available Whisper models for audio transcription.
    """

    gpt_4o_transcribe = "gpt-4o-transcribe"
    gpt_4o_mini_transcribe = "gpt-4o-mini-transcribe"


@router.post("/transcribe")
async def create_transcription(
    filename: str, file: UploadFile = File(...), model: WhisperModel = WhisperModel.gpt_4o_transcribe
):
    """
    Transcribes an audio file.

    This endpoint receives an audio file and uses OpenAI's Whisper model
    to convert the speech to text.

    - **file**: The audio file (e.g., mp3, wav, m4a) to be transcribed.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file was uploaded.")
    if not filename:
        raise HTTPException(status_code=400, detail="Filename is required.")

    try:
        client = openai.OpenAI()
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=500, detail="Failed to initialize OpenAI client.")

    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")
    audio_data = await file.read()
    buffer = io.BytesIO(audio_data)
    buffer.name = filename
    try:
        transcription = client.audio.transcriptions.create(model=model.value, file=buffer, response_format="json")
    except openai.APIError as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to transcribe audio: {e}")
    except Exception as e:
        # Handle other unexpected errors
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

    return JSONResponse(content={"transcription": transcription.text})
