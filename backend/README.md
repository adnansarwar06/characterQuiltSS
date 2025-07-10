# Student Records LLM API

A FastAPI backend service that provides LLM completion functionality for the Student Records application.

## Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the FastAPI server:
```bash
python main.py
```

The server will run at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access:
- API documentation: `http://localhost:8000/docs`
- Alternative documentation: `http://localhost:8000/redoc`

### Endpoints

#### POST /api/llm-complete

Process student records with LLM completion.

Request body:
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
      "width": 0
    }
  ],
  "prompt": "string"
}
```

Response body:
```json
{
  "llm_results": [
    "string"
  ]
}
```

## Development

This is a prototype implementation that returns mock results. In a production environment, you would need to:

1. Integrate with an actual LLM service
2. Add proper error handling
3. Implement rate limiting
4. Add authentication
5. Add request validation
6. Add logging
7. Add monitoring

## Environment Variables

The following environment variables can be configured:

- `API_V1_PREFIX`: API version prefix (default: "/api")
- `DEBUG`: Enable debug mode (default: True)
- `BACKEND_CORS_ORIGINS`: List of allowed CORS origins 