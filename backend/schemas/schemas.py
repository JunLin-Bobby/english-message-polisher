from pydantic import BaseModel, Field

class PolishRequest(BaseModel):
    # Enforce constraints directly in the model to prevent massive payloads
    original_text: str = Field(
        ..., 
        min_length=1, 
        max_length=3000, 
        description="The raw English text to be polished."
    )
    # Default tone is professional, but can be overridden by the frontend
    tone_preference: str = Field(
        default="professional", 
        description="The desired tone for the polished text (e.g., professional, casual, academic)."
    )

class PolishResponse(BaseModel):
    polished_text: str
    original_length: int
    polished_length: int