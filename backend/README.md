# Student Records LLM API

A FastAPI backend service that provides AI-powered analysis capabilities for the Student Records Management application. The service integrates with OpenAI's API to analyze student data and generate insights.

## Features

- 🚀 **FastAPI Framework** - Modern, fast web framework for building APIs
- 🤖 **OpenAI Integration** - AI-powered analysis using GPT models
- 📝 **Automatic Documentation** - Interactive API docs with Swagger UI
- 🔧 **Type Safety** - Python dataclasses for request/response models (no Pydantic)
- 🌐 **CORS Support** - Configurable cross-origin resource sharing
- ⚡ **Async Support** - Non-blocking request handling
- 🔒 **Environment Configuration** - Secure API key management

## Setup

### Prerequisites
- Python 3.8 or higher
- OpenAI API key

### Installation

1. **Create a Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   DEBUG=True
   API_V1_PREFIX=/api
   BACKEND_CORS_ORIGINS=["http://localhost:5173"]
   ```

## Running the Server

Start the FastAPI server:
```bash
python main.py
```

The server will run at `http://localhost:8000`.

### Development Mode
The server automatically runs with hot reload enabled in development mode.

## API Documentation

Once the server is running, you can access:
- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **Alternative Docs (ReDoc)**: `http://localhost:8000/redoc`
- **OpenAPI JSON Schema**: `http://localhost:8000/openapi.json`

## API Endpoints

### POST /api/llm-complete

Analyze student records using AI and return insights.

**Request Body:**
```json
{
  "rows": [
    {
      "id": "string",
      "firstName": "string", 
      "lastName": "string",
      "major": "string"
    }
  ],
  "columns": [
    {
      "id": "string",
      "title": "string", 
      "width": "number"
    }
  ],
  "prompt": "string"
}
```

**Response Body:**
```json
{
  "llm_results": [
    "string"
  ]
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/llm-complete" \
  -H "Content-Type: application/json" \
  -d '{
    "rows": [
      {"id": "1", "firstName": "John", "lastName": "Doe", "major": "Computer Science"},
      {"id": "2", "firstName": "Jane", "lastName": "Smith", "major": "Biology"}
    ],
    "columns": [
      {"id": "firstName", "title": "First Name", "width": 150},
      {"id": "lastName", "title": "Last Name", "width": 150},
      {"id": "major", "title": "Major", "width": 200}
    ],
    "prompt": "Analyze the academic distribution and suggest study groups"
  }'
```

## Dependencies

- **fastapi** (0.104.1) - Modern web framework for APIs
- **uvicorn** (0.24.0) - ASGI server implementation
- **openai** (1.3.5) - OpenAI API client
- **tenacity** (8.2.3) - Retry library for robust API calls
- **python-dotenv** (1.0.0) - Environment variable management
- **httpx** (0.27.2) - HTTP client for async requests

## Architecture

The backend follows a clean architecture pattern:

```
backend/
├── main.py           # FastAPI application entry point
├── llm_service.py    # OpenAI integration and LLM logic
├── settings.py       # Configuration and environment settings
└── requirements.txt  # Python dependencies
```

### Key Components

- **main.py** - FastAPI app configuration, CORS setup, and route definitions
- **llm_service.py** - Handles OpenAI API integration and response processing
- **settings.py** - Centralized configuration management

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key for LLM integration | - | ✅ |
| `API_V1_PREFIX` | API version prefix | `/api` | ❌ |
| `DEBUG` | Enable debug mode | `True` | ❌ |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins | `["*"]` | ❌ |

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid API key
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server-side errors
- **503 Service Unavailable** - OpenAI API unavailable

## Development Guidelines

### Code Style
- Uses Python dataclasses instead of Pydantic models
- Type hints for all function parameters and return values
- Async/await for all I/O operations
- Environment-based configuration

### Testing
Run tests (when available):
```bash
pytest
```

### Adding New Endpoints
1. Define route in `main.py`
2. Create data models using dataclasses
3. Implement business logic in appropriate service module
4. Add comprehensive error handling
5. Update API documentation

## Production Deployment

For production deployment:

1. **Security**: 
   - Set `DEBUG=False`
   - Use secure CORS origins
   - Implement proper authentication
   - Use HTTPS

2. **Performance**:
   - Configure appropriate worker processes
   - Implement request rate limiting
   - Add caching where appropriate
   - Monitor API performance

3. **Monitoring**:
   - Add structured logging
   - Implement health check endpoints
   - Set up error tracking
   - Monitor OpenAI API usage

### Example Production Start
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure `.env` file contains valid `OPENAI_API_KEY`
   - Check API key permissions and quota

2. **CORS Issues**
   - Verify `BACKEND_CORS_ORIGINS` includes frontend URL
   - Check browser developer tools for CORS errors

3. **Import Errors**
   - Ensure virtual environment is activated
   - Verify all dependencies are installed: `pip install -r requirements.txt`

### Logs
Check server logs for detailed error information. In development mode, errors are displayed in the console.

## Contributing

1. Follow the existing code style and patterns
2. Add appropriate error handling for new features
3. Update documentation for API changes
4. Test integrations with the frontend application

## License

This project is for educational and demonstration purposes. 