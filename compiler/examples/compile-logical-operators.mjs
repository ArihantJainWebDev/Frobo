import { readFileSync, writeFileSync } from 'fs';
import { compile } from '../dist/index.js';

// Read the Frobo source code
const code = readFileSync('./examples/logical-operators-demo.frobo', 'utf-8');

// Compile it
const output = compile(code);

// Create a complete HTML file
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logical Operators Demo - Frobo</title>
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

// Write the output
writeFileSync('./examples/logical-operators-demo.html', html);

console.log('✓ Compiled logical-operators-demo.frobo successfully!');
console.log('✓ Output written to logical-operators-demo.html');
console.log('\nGenerated condition strings:');

// Extract and display the conditions from the HTML
const conditionMatches = output.html.matchAll(/data-condition="([^"]+)"/g);
for (const match of conditionMatches) {
  console.log('  -', match[1]);
}
