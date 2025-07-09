# Student Records Management

A modern, spreadsheet-like interface for managing student records built with React and glide-data-grid.

## Features

- Spreadsheet-like interface for student data management
- Editable cells for all fields
- Add new rows functionality
- Modern, responsive design
- Type-safe implementation with TypeScript

## Tech Stack

- React 18.x
- TypeScript
- glide-data-grid
- styled-components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Project Structure

```
/src
  /components
    StudentTable.tsx    # Main table component
  /config
    StudentTableConfig.ts    # Table configuration
    InitialStudentData.ts    # Mock data
  App.tsx              # Main application component
  main.tsx            # Application entry point
```

## Usage

- Click cells to edit their contents
- Use the "Add Row" button to add new student records
- All changes are maintained in the component's state

## Development

This project uses:
- TypeScript for type safety
- ESLint for code quality
- styled-components for styling
- Vite for fast development and building
