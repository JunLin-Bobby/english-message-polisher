from fastapi import APIRouter, Request, Depends
from schemas.schemas import PolishRequest, PolishResponse
from core.dependencies import rate_limiter
from core.logger import logger

# Initialize the router for polish-related endpoints
router = APIRouter(
    prefix = "/api/v1", tags=["English Polishing"]
)

@router.post("/polish", response_model = PolishResponse, dependencies= [Depends(rate_limiter)])
async def polish_english_text(payload: PolishRequest, request: Request):
    """
    Receives English text, validates it, and prepares to send it to the AI service.
    Protected by the rate_limiter dependency.
    """

    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Received polish request from {client_ip} with tone: {payload.tone_preference}")

    #TODO: Call the service layer here
    #Mocking Response
    mock_polished_text = f"[Mock {payload.tone_preference } Version] : {payload.original_text}"
    
    return PolishResponse(
        polished_text = mock_polished_text,
        original_length=len(payload.original_text),
        polished_length=len(mock_polished_text)
    )