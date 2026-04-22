from fastapi import  FastAPI
from api.polish import router as polish_router, gemini_service
from mangum import Mangum 
from fastapi.middleware.cors import CORSMiddleware
from core.logger import logger
from contextlib import asynccontextmanager
# ==========================================
# Lifespan Management (Graceful Shutdown)
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
   
    logger.info("Application starting up...")
    yield 
    logger.info("Application shutting down, cleaning up resources...")
    await gemini_service.close() 
# ==========================================
# Application Initialization
# ==========================================
app = FastAPI(
    title="AI English Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router (polish_router, tags=["English Polishing"])

@app.get("/health", tags=["System"])
def health_check():
    """
    Health check endpoint for load balancers and container orchestration (e.g., Docker/AWS).
    """
    return {"status": "healthy"}

handler = Mangum(app) 