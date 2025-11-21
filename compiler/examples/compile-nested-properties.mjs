import { readFileSync, writeFileSync } from 'fs';
import { Lexer } from '../dist/lexer.js';
import { Parser } from '../dist/parser.js';
import { CodeGenerator } from '../dist/codegen.js';

const code = readFileSync('./examples/nested-properties-demo.frobo', 'utf-8');

const lexer = new Lexer(code);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const codegen = new CodeGenerator(ast);
const output = codegen.generate();

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Nested Properties Demo</title>
  <style>
    ${output.css}
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  ${output.html}
  <script>
    ${output.js}
  </script>
</body>
</html>
`;

writeFileSync('./examples/nested-properties-demo.html', html);
console.log('Compiled nested-properties-demo.frobo to nested-properties-demo.html');
