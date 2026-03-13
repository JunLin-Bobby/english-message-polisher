from services.gemini_service import GeminiService


def test_build_prompt_general_mode():
    """Test the normal mode prompt building"""
    service = GeminiService()
    prompt = service._build_prompt(
        text="Hello world", 
        mode="general", 
        tone="casual"
    )
    
    assert "casual" in prompt
    assert "Hello world" in prompt
    assert "intended for an email" not in prompt

def test_build_prompt_email_mode():
    """Test the email mode prompt building"""
    service = GeminiService()
    prompt = service._build_prompt(
        text="Fix this bug ASAP", 
        mode="email", 
        tone="professional", 
        recipient="Boss", 
        subject="Urgent Report"
    )
    
    assert "professional" in prompt
    assert "Fix this bug ASAP" in prompt
    assert "intended for an email" in prompt
    assert "The recipient is: Boss" in prompt
    assert "The subject line is: Urgent Report" in prompt