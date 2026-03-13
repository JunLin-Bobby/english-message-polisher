from unittest.mock import AsyncMock, patch
from schemas.schemas import LLMRefinedOutput

#Test the rate_limiter
@patch('api.polish.gemini_service.polish_text', new_callable=AsyncMock) 
def test_rate_limiter_blocks_excessive_requests(mock_polish_text, client):
    """
    Test that the rate limiter correctly returns a 429 status code
    after 10 requests within the same minute.
    """
    #Mocked the response from gemini_service.polish_text
    mock_polish_text.return_value = LLMRefinedOutput(
        subject=None,
        polished_text="This is a mock response to save our API quota!"
    )

    endpoint = "/api/v1/polish"
    payload = {
        "original_text": "This is a test sentence.",
        "tone_preference": "casual"
    }

    # Fire 10 allowed requests
    for _ in range(10):
        response = client.post(endpoint, json=payload)
        assert response.status_code == 200

    # The 11th request should be blocked by the rate limiter
    response_11 = client.post(endpoint, json=payload)
    
    assert response_11.status_code == 429
    assert "Too Many Requests" in response_11.json()["detail"]
    
    #Test if api is called 10 times
    assert mock_polish_text.call_count == 10

def test_pydantic_validation_rejects_empty_text(client):
    """
    Test that the Pydantic schema rejects empty text inputs.
    """
    response = client.post("/api/v1/polish", json={"original_text": ""})
    assert response.status_code == 422 # Unprocessable Entity

#Mock the gemini_service.polish.text
@patch('api.polish.gemini_service.polish_text',new_callable=AsyncMock) 
def test_polosh_english_text(mock_polish_text, client):
    """               
    await gemini_service.polish_text(
        text = payload.original_text,
        mode = payload.mode,
        tone = payload.tone_preference,
        recipient = payload.recipient,
        subject = payload.subject
    )
    """
    #Mocked the response from gemini_service.polish_text
    mock_polish_text.return_value = LLMRefinedOutput(
        subject = "Mocked Refined Subject",
        polished_text = "This is a perfectly mocked professional text."
    )
    #Prepare the request data
    endpoint = "/api/v1/polish"
    requestBody = {
        "original_text": "make this sound good",
        "tone_preference": "professional",
        "mode": "email",
        "recipient": "John Doe",
        "subject": "Hello"
    }

    #Send the request, this is where the api test starting
    response = client.post(endpoint,json = requestBody)

    mock_polish_text.assert_called_once_with(
        text="make this sound good",
        mode="email",
        tone="professional",
        recipient="John Doe",
        subject="Hello"
    )
    assert response.status_code ==200
    responseBody =  response.json()
    assert responseBody["subject"] == "Mocked Refined Subject"
    assert responseBody["polished_text"] == "This is a perfectly mocked professional text."

    