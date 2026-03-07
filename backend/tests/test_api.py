

def test_rate_limiter_blocks_excessive_requests(client):
    """
    Test that the rate limiter correctly returns a 429 status code
    after 10 requests within the same minute.
    """
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

def test_pydantic_validation_rejects_empty_text(client):
    """
    Test that the Pydantic schema rejects empty text inputs.
    """
    response = client.post("/api/v1/polish", json={"original_text": ""})
    assert response.status_code == 422 # Unprocessable Entity