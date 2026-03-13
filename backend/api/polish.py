from fastapi import APIRouter, Request, Depends
from schemas.schemas import PolishRequest, PolishResponse
from core.dependencies import rate_limiter
from core.logger import logger
from services.gemini_service import GeminiService

# Initialize the router for polish-related endpoints
router = APIRouter(
    prefix = "/api/v1", tags=["English Polishing"]
)
gemini_service = GeminiService()

@router.post("/polish", response_model = PolishResponse, dependencies= [Depends(rate_limiter)])
async def polish_english_text(payload: PolishRequest, request: Request):
    """
    Receives English text, validates it, and prepares to send it to the AI service.
    Protected by the rate_limiter dependency.
    """

    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Received polish request from {client_ip} with tone: {payload.tone_preference}")

    #Call the service layer here
    llm_result = await gemini_service.polish_text(
        text = payload.original_text,
        mode = payload.mode,
        tone = payload.tone_preference,
        recipient = payload.recipient,
        subject = payload.subject
    )
    
    return PolishResponse(
        subject=llm_result.subject,
        polished_text=llm_result.polished_text,
        original_length=len(payload.original_text),
        polished_length=len(llm_result.polished_text)
    )