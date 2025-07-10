"""
Configuration settings for the FastAPI backend.
"""
from typing import List
import os
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

@dataclass
class OpenAISettings:
    """
    OpenAI API configuration settings.
    """
    api_key: str
    model: str
    base_url: str
    max_retries: int
    timeout_seconds: int

class Settings:
    """
    Application settings loaded from environment variables.
    """
    def __init__(self):
        # API settings
        self.API_V1_PREFIX = os.getenv("API_V1_PREFIX", "/api")
        self.PROJECT_NAME = os.getenv("PROJECT_NAME", "Student Records LLM API")
        self.VERSION = os.getenv("VERSION", "0.1.0")
        self.DEBUG = os.getenv("DEBUG", "true").lower() == "true"

        # CORS settings
        default_cors = [
            "http://localhost:5173",  # Default Vite dev server
            "http://localhost:3000",  # Alternative frontend port
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
        cors_origins = os.getenv("BACKEND_CORS_ORIGINS")
        self.BACKEND_CORS_ORIGINS = cors_origins.split(",") if cors_origins else default_cors

        # LLM endpoint settings
        self.LLM_COMPLETE_ENDPOINT = os.getenv("LLM_COMPLETE_ENDPOINT", "/llm-complete")

        # OpenAI settings
        self.openai = OpenAISettings(
            api_key=os.getenv("OPENAI_API_KEY", ""),
            model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),  # Default to 3.5-turbo
            base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
            max_retries=int(os.getenv("OPENAI_MAX_RETRIES", "3")),
            timeout_seconds=int(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))
        )

        # Validate required settings
        if not self.openai.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

# Create settings instance
settings = Settings() 