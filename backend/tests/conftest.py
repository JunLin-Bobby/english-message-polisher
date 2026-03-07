#Setting public testing resources
import pytest
from fastapi.testclient import TestClient
from core.dependencies import request_history
from main import app

@pytest.fixture
def client():
    # Provide a TestClient instance for all tests to use
    with TestClient(app) as c:
        yield c

@pytest.fixture(autouse =True)
def reset_rate_limiter():
    request_history.clear()
    yield