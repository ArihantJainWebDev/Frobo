# @frobo/compiler

The Frobo DSL compiler - transforms Frobo code into HTML, CSS, and JavaScript.

## Installation

```bash
npm install @frobo/compiler
```

## Usage

```typescript
import { compile } from '@frobo/compiler';

const code = `
component Counter {
  state count = 0
  
  text "Count: {count}"
  button "Increment" onClick=increment
}

function increment() {
  count = count + 1
}
`;

const output = compile(code);
console.log(output.html);
console.log(output.css);
console.log(output.js);
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Lint and Format

```bash
npm run lint
npm run format
```

## Architecture

The compiler consists of three main components:

1. **Lexer** (`src/lexer.ts`) - Tokenizes Frobo source code
2. **Parser** (`src/parser.ts`) - Transforms tokens into an Abstract Syntax Tree (AST)
3. **Code Generator** (`src/codegen.ts`) - Generates HTML, CSS, and JavaScript from the AST

## Testing

The test suite includes:

- **Unit tests** - Test individual components (lexer, parser, codegen)
- **Integration tests** - Test the complete compilation pipeline
- **Property-based tests** - Test universal properties using fast-check

Test coverage goal: 80%+ overall

## License

MIT
