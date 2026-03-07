from fastapi import  FastAPI
from api.polish import router as polish_router
app = FastAPI()

@app.get("/health")
def health_check():
    """
    Health check endpoint for SRE monitoring and CI/CD validation.
    """
    return {"status": "healthy"}

app.include_router (polish_router)