"""Configuration settings"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API Keys
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
    ]
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Component Library
    COMPONENT_METADATA_PATH: str = "../ui-components/src/index.ts"
    
    # Model Configuration
    DEFAULT_MODEL: str = "gpt-4o"
    FALLBACK_MODEL: str = "gpt-4o-mini"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
