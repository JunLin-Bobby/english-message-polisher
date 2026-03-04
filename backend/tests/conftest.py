#Setting public testing resources
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    # Provide a TestClient instance for all tests to use
    with TestClient(app) as c:
        yield c