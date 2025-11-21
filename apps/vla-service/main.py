"""
Service VLA (Vision-Language-Action)
Backend pour l'analyse multi-modale et la génération de spécifications d'UI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api import vla, health
from app.utils.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events"""
    # Startup
    print("🚀 VLA Service starting...")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🔑 OpenAI API Key: {'✓' if settings.OPENAI_API_KEY else '✗'}")
    print(f"🔑 Anthropic API Key: {'✓' if settings.ANTHROPIC_API_KEY else '✗'}")
    print(f"🔑 Google API Key: {'✓' if settings.GOOGLE_API_KEY else '✗'}")
    
    yield
    
    # Shutdown
    print("👋 VLA Service shutting down...")

app = FastAPI(
    title="AGI-UI VLA Service",
    description="Vision-Language-Action service for UI generation",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(vla.router, prefix="/api/v1/vla", tags=["VLA"])

@app.get("/")
async def root():
    return {
        "service": "AGI-UI VLA Service",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
    )
