"""
Main FastAPI application module.
"""
from typing import List, Dict, Any, Optional, cast
from dataclasses import dataclass
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import json

from settings import settings
from llm_service import OpenAIService, LLMError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request/Response Models
@dataclass
class LLMCompletionRequest:
    """
    Request model for LLM completion endpoint.
    """
    rows: List[Dict[str, Any]]
    columns: List[Dict[str, Any]]
    prompt: str

    @classmethod
    def from_request(cls, request_data: Dict[str, Any]) -> 'LLMCompletionRequest':
        """
        Create request model from raw request data.
        
        Args:
            request_data: Dictionary containing request data
            
        Returns:
            Validated LLMCompletionRequest instance
            
        Raises:
            ValueError: If required fields are missing or invalid
        """
        # Extract fields with type checking
        rows = request_data.get('rows')
        columns = request_data.get('columns')
        prompt = request_data.get('prompt')

        # Validate presence
        if not all([rows, columns, prompt]):
            raise ValueError("Missing required fields: rows, columns, and prompt are required")

        # Validate types
        if not isinstance(rows, list):
            raise ValueError("Invalid data format: rows must be an array")
        if not isinstance(columns, list):
            raise ValueError("Invalid data format: columns must be an array")
        if not isinstance(prompt, str):
            raise ValueError("Invalid data format: prompt must be a string")

        # Convert row data to ensure all values are strings
        processed_rows = []
        for row in rows:
            if not isinstance(row, dict):
                raise ValueError("Each row must be a dictionary")
            processed_row = {}
            for key, value in row.items():
                processed_row[str(key)] = str(value) if value is not None else ""
            processed_rows.append(processed_row)

        # Convert column data
        processed_columns = []
        for col in columns:
            if not isinstance(col, dict):
                raise ValueError("Each column must be a dictionary")
            processed_col = {str(k): str(v) if v is not None else "" for k, v in col.items()}
            processed_columns.append(processed_col)

        return cls(
            rows=processed_rows,
            columns=processed_columns,
            prompt=str(prompt)
        )

@dataclass
class LLMCompletionResponse:
    """
    Response model for LLM completion endpoint.
    """
    llm_results: List[str]
    error: Optional[Dict[str, str]] = None

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI service
openai_service = OpenAIService()

@app.post(f"{settings.API_V1_PREFIX}{settings.LLM_COMPLETE_ENDPOINT}")
async def llm_complete(request: Request) -> LLMCompletionResponse:
    """
    Process student records with LLM completion.

    Args:
        request: FastAPI Request object containing rows, columns, and prompt.

    Returns:
        LLMCompletionResponse containing generated results for each row.

    Raises:
        HTTPException: If the request is invalid or processing fails.
    """
    try:
        # Parse and validate request
        request_data = await request.json()
        try:
            llm_request = LLMCompletionRequest.from_request(request_data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Log request details
        logger.info(f"Processing LLM completion request: {len(llm_request.rows)} rows, prompt: {llm_request.prompt[:100]}...")

        # Process with OpenAI
        results = openai_service.complete(llm_request.rows, llm_request.columns, llm_request.prompt)
        
        return LLMCompletionResponse(llm_results=results)

    except LLMError as e:
        # Handle known LLM errors with appropriate status codes
        status_code = {
            "AUTH_ERROR": 401,
            "RATE_LIMIT": 429,
            "TIMEOUT": 504,
            "PARSE_ERROR": 502,
            "INTERNAL_ERROR": 500
        }.get(e.code, 500)

        raise HTTPException(
            status_code=status_code,
            detail={"message": e.message, "code": e.code}
        )

    except ValueError as e:
        # Handle validation errors
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        # Log unexpected errors
        logger.error(f"Unexpected error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 