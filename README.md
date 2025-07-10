# Student Records Management with AI Analysis

A modern, full-stack student records management application with AI-powered analysis capabilities. Features a spreadsheet-like interface built with React and glide-data-grid, backed by a FastAPI service with LLM integration.

## Features

### Frontend Features
- 📊 **Spreadsheet-like Interface** - Intuitive data grid for managing student records
- ✏️ **Inline Editing** - Click any cell to edit student information
- 🧠 **AI Analysis** - Integrate with LLM services to analyze student data patterns
- 📁 **Data Export** - Export student records to CSV format
- 🔄 **Sorting** - Click column headers to sort data (ascending/descending)
- ➕ **Dynamic Management** - Add new rows and columns dynamically
- 🎨 **Modern UI** - Responsive design with theme support
- 🧪 **Comprehensive Testing** - Full test coverage with Jest and React Testing Library

### Backend Features
- 🚀 **FastAPI Service** - High-performance API with automatic documentation
- 🤖 **LLM Integration** - OpenAI API integration for data analysis
- 🔧 **Type Safety** - Python dataclasses for request/response models
- 📝 **API Documentation** - Auto-generated Swagger/OpenAPI docs
- 🌐 **CORS Support** - Configurable cross-origin resource sharing

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **glide-data-grid** for spreadsheet functionality
- **styled-components** for styling
- **Lucide React** and **React Icons** for iconography
- **Jest** and **React Testing Library** for testing

### Backend
- **FastAPI** for the API framework
- **Python** with dataclasses (no Pydantic)
- **OpenAI API** for LLM capabilities
- **Uvicorn** for ASGI server
- **python-dotenv** for environment management

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key (for LLM features)

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```

The backend will run at `http://localhost:8000` with API docs at `http://localhost:8000/docs`.

## Project Structure

```
/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── __tests__/          # Component tests
│   │   ├── common/             # Shared components
│   │   ├── dialogs/            # Modal dialogs
│   │   ├── icons/              # Icon components
│   │   └── *.tsx               # Main components
│   ├── config/                 # Configuration files
│   ├── context/                # React context providers
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── backend/                     # Backend source code
│   ├── main.py                 # FastAPI application
│   ├── llm_service.py          # LLM integration service
│   ├── settings.py             # Application settings
│   └── requirements.txt        # Python dependencies
└── public/                     # Static assets
```

## Usage

### Basic Operations
- **Edit Data**: Click any cell to edit student information
- **Add Records**: Use the "Add Row" button to create new student entries
- **Sort Data**: Click column headers to sort by that field
- **Export Data**: Click "Export CSV" to download your data

### AI Analysis
1. Click the "AI Analysis" button (brain icon)
2. Enter a prompt describing what you want to analyze
3. The system will process your data with AI and add results as a new column

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Backend
- `python main.py` - Start the FastAPI server
- Access API docs at `http://localhost:8000/docs`

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Component rendering and interactions
- AI analysis functionality
- Data export capabilities
- Sorting behavior
- User interface interactions

## Configuration

The application uses configuration files in `src/config/`:
- `ApiConfig.ts` - API endpoints and settings
- `StudentTableConfig.ts` - Table structure and validation
- `ThemeConfig.ts` - UI theme and styling
- `UIConfig.ts` - Interface behavior settings

## Environment Variables

### Backend
- `OPENAI_API_KEY` - Required for AI analysis features
- `API_V1_PREFIX` - API version prefix (default: "/api")
- `DEBUG` - Enable debug mode (default: True)
- `BACKEND_CORS_ORIGINS` - Allowed CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is for educational and demonstration purposes.
