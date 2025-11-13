# Frobo Backend API

Express API server for compiling Frobo language code.

## Features

- **POST /api/compile** - Compile Frobo code to HTML, CSS, and JavaScript
- Request validation (max 100KB)
- CORS enabled for frontend integration
- Error handling with detailed messages

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:3001

## Production

```bash
npm run build
npm start
```

## API Usage

### Compile Endpoint

**POST** `/api/compile`

**Request Body:**
```json
{
  "code": "component Counter {\n  state count = 0\n  text \"Count: {count}\"\n  button \"Increment\" onClick=increment\n}\n\nfunction increment() {\n  count = count + 1\n}"
}
```

**Response:**
```json
{
  "success": true,
  "output": {
    "html": "<div id=\"Counter\" class=\"frobo-component\">...</div>",
    "css": ".frobo-component { ... }",
    "js": "const Frobo = { ... }"
  }
}
```

**Error Response:**
```json
{
  "error": "Compilation failed",
  "message": "Unexpected character..."
}
```

## Tech Stack

- Express.js
- TypeScript
- CORS
- Frobo Compiler (Lexer, Parser, CodeGenerator)