"""
OpenAI integration service for LLM completions.
"""
from typing import List, Dict, Any
from dataclasses import dataclass
import json
import logging
import os
from openai import OpenAI, RateLimitError, AuthenticationError, APITimeoutError
from tenacity import retry, stop_after_attempt, wait_exponential

from settings import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMError(Exception):
    """
    Error response for LLM operations.
    """
    def __init__(self, message: str, code: str):
        self.message = message
        self.code = code
        super().__init__(self.message)

class OpenAIService:
    """
    Service for interacting with OpenAI's API.
    """
    def __init__(self):
        """Initialize OpenAI client with settings."""
        # Set environment variables for OpenAI client
        os.environ["OPENAI_API_KEY"] = settings.openai.api_key
        if settings.openai.base_url:
            os.environ["OPENAI_BASE_URL"] = settings.openai.base_url
            
        self.client = OpenAI()  # Will use environment variables automatically
        self.model = settings.openai.model
        self.max_retries = settings.openai.max_retries
        self.timeout = settings.openai.timeout_seconds

    def _format_prompt(self, rows: List[Dict[str, Any]], columns: List[Dict[str, Any]], user_prompt: str) -> str:
        """
        Format the system prompt with table data and user instructions.

        Args:
            rows: List of row data dictionaries
            columns: List of column definitions
            user_prompt: User-provided instruction

        Returns:
            Formatted prompt string
        """
        col_titles = [col.get('title', '') for col in columns]
        formatted_rows = []
        for row in rows:
            row_data = {str(k): str(v) for k, v in row.items()}
            formatted_rows.append(row_data)

        system_prompt = (
            f"You are a helpful assistant. For each row in the following table, "
            f"complete this instruction: {user_prompt}\n\n"
            f"Table columns: {', '.join(col_titles)}.\n\n"
            f"Data: {json.dumps(formatted_rows, indent=2)}\n\n"
            "For each row, return exactly one result. Return your results as a JSON array of strings, "
            "where each response must be a quoted string (e.g. [\"yes\", \"no\"]). "
            "Do not include any additional formatting or explanation."
        )
        return system_prompt

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True
    )
    def complete(self, rows: List[Dict[str, Any]], columns: List[Dict[str, Any]], prompt: str) -> List[str]:
        """
        Generate completions using OpenAI's API with retry logic.

        Args:
            rows: List of row data dictionaries
            columns: List of column definitions
            prompt: User-provided instruction

        Returns:
            List of completion results

        Raises:
            LLMError: If the API call fails or returns invalid results
        """
        try:
            logger.info(f"Processing LLM completion request for {len(rows)} rows")
            
            system_prompt = self._format_prompt(rows, columns, prompt)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt}
                ],
                temperature=0.7
            )

            # Extract and validate results
            try:
                result_text = response.choices[0].message.content
                results = json.loads(result_text)
                
                if not isinstance(results, list) or len(results) != len(rows):
                    raise ValueError("Invalid response format from LLM")
                
                return results

            except (json.JSONDecodeError, ValueError, AttributeError) as e:
                logger.error(f"Failed to parse LLM response: {str(e)}")
                raise LLMError(
                    message="Failed to parse LLM response",
                    code="PARSE_ERROR"
                )

        except RateLimitError as e:
            logger.error(f"OpenAI rate limit exceeded: {str(e)}")
            raise LLMError(
                message="Rate limit exceeded. Please try again later.",
                code="RATE_LIMIT"
            )

        except AuthenticationError as e:
            logger.error(f"OpenAI authentication failed: {str(e)}")
            raise LLMError(
                message="Invalid API key or authentication failed",
                code="AUTH_ERROR"
            )

        except APITimeoutError as e:
            logger.error(f"OpenAI API timeout: {str(e)}")
            raise LLMError(
                message="Request timed out. Please try again.",
                code="TIMEOUT"
            )

        except Exception as e:
            logger.error(f"Unexpected error in OpenAI service: {str(e)}")
            raise LLMError(
                message="An unexpected error occurred",
                code="INTERNAL_ERROR"
            ) 