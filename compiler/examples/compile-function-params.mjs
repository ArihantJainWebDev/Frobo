import { readFileSync, writeFileSync } from 'fs';
import { Lexer } from '../dist/lexer.js';
import { Parser } from '../dist/parser.js';
import { CodeGenerator } from '../dist/codegen.js';

// Read the Frobo source code
const code = readFileSync('./examples/function-parameters-demo.frobo', 'utf-8');

console.log('Compiling function-parameters-demo.frobo...\n');

// Lexer
const lexer = new Lexer(code);
const tokens = lexer.tokenize();
console.log(`✓ Lexer: Generated ${tokens.length} tokens`);

if (lexer.getErrors().length > 0) {
  console.error('Lexer errors:');
  lexer.getErrors().forEach(err => console.error(`  - ${err.message} at line ${err.line}`));
  process.exit(1);
}

// Parser
const parser = new Parser(tokens);
const ast = parser.parse();
console.log(`✓ Parser: Generated AST with ${ast.children?.length || 0} top-level nodes`);

if (parser.getErrors().length > 0) {
  console.error('Parser errors:');
  parser.getErrors().forEach(err => console.error(`  - ${err.message}`));
  process.exit(1);
}

// Code Generator
const generator = new CodeGenerator(ast);
const output = generator.generate();
console.log('✓ Code Generator: Generated HTML, CSS, and JS\n');

// Create standalone HTML file
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Function Parameters Demo - Frobo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    ${output.css}
  </style>
</head>
<body>
  ${output.html}
  <script>
    ${output.js}
  </script>
</body>
</html>`;

writeFileSync('./examples/function-parameters-demo.html', html);
console.log('✓ Saved to examples/function-parameters-demo.html');
console.log('\nOpen the HTML file in a browser to see the result!');
