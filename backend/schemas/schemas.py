from pydantic import BaseModel, Field
from typing import Optional

class PolishRequest(BaseModel):
    # Enforce constraints directly in the model to prevent massive payloads
    original_text: str = Field(..., min_length=1, max_length=3000, description="The raw English text.")
    # Default tone is professional, but can be overridden by the frontend
    tone_preference: str = Field(default="professional", description="The desired tone for the polished text (e.g., professional, casual, academic).")
    mode: str = Field(default="general" ,description="Context: 'general' or 'email'.")
    recipient: Optional[str] = Field(default=None, description="Recipient for email mode")
    subject: Optional[str] = Field(default=None, description = "subject for email mode")

#Structured outputs for LLM 
class LLMRefinedOutput(BaseModel):
    subject: Optional[str] = Field(default=None, description="The refined email subject. null if not email.")
    polished_text: str = Field(..., description="The final polished text body.")

#Actual response model for our api
class PolishResponse(BaseModel):
    subject: Optional[str]
    polished_text: str
    original_length: int
    polished_length: int