from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    """
    Health check endpoint for SRE monitoring and CI/CD validation.
    """
    return {"status": "healthy"}