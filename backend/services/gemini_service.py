import os
from fastapi import HTTPException
from google import genai
from google.genai import types
from google.genai.errors import APIError

from core.logger import logger
from schemas.schemas import LLMRefinedOutput
from core.prompts import (
    POLISH_BASE_PROMPT, 
    EMAIL_CONTEXT_TEMPLATE, 
    EMAIL_RECIPIENT_TEMPLATE, 
    EMAIL_SUBJECT_TEMPLATE
)


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.critical("GEMINI_API_KEY is missing from environment variables.")
            raise RuntimeError("AI Service configuration missing.")

        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.5-flash-lite"
    
    def _build_prompt(self,text:str,tone:str,mode:str,recipient:str = None,subject:str = None) -> str:
        context_section = ""
        #Build context_seciton based on the mode
        if mode == "email":
            context_section += EMAIL_CONTEXT_TEMPLATE
            if recipient:
                context_section += EMAIL_RECIPIENT_TEMPLATE.format(recipient=recipient)
            if subject:
                context_section += EMAIL_SUBJECT_TEMPLATE.format(subject=subject)
        
        return POLISH_BASE_PROMPT.format(
                context_section = context_section,
                tone = tone,
                text = text,
        )
            
    
    async def polish_text(self, text: str, mode: str, tone: str, recipient: str = None, subject: str = None) -> LLMRefinedOutput:
        prompt = self._build_prompt(text, mode, tone, recipient, subject)
        
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5, 
                    thinking_config=types.ThinkingConfig(include_thoughts=False), 
                    response_mime_type="application/json",
                    response_schema=LLMRefinedOutput,
                )
            )
            
            if not response.text:
                raise HTTPException(status_code=500, detail="AI processing returned empty results.")
                
            return LLMRefinedOutput.model_validate_json(response.text)

        except APIError as e:
            logger.error(f"Gemini API Error [{e.code}]: {e.message}")
            if e.code == 429:
                raise HTTPException(status_code=429, detail="AI Service is currently overloaded.")
            elif e.code in [503, 504]:
                raise HTTPException(status_code=504, detail="AI Service timed out or is unavailable.")
            else:
                raise HTTPException(status_code=500, detail="AI Service encountered an unexpected error.")
        
    async def close(self):
        """
        Gracefully close the underlying HTTP connections.
        """
        if hasattr(self, 'client') and self.client:
            await self.client.aio.aclose()
            self.client.close()
            logger.info("Gemini AI client connections closed successfully.")
        