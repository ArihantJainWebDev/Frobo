import { readFileSync, writeFileSync } from 'fs';
import { compile } from '../dist/index.js';

// Read the Frobo code
const code = readFileSync('./examples/boolean-null-demo.frobo', 'utf-8');

// Compile it
const output = compile(code);

// Create a complete HTML file
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boolean and Null Demo - Frobo</title>
  <style>
    ${output.css}
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <h1>Boolean and Null Literals Demo</h1>
  <p><strong>Features demonstrated:</strong></p>
  <ul>
    <li>Boolean state variables (isLoggedIn, hasPermission)</li>
    <li>Null state variables (user, data)</li>
    <li>Boolean computed properties (canAccess)</li>
    <li>Null comparisons (user == null)</li>
    <li>Logical operators with booleans (&&, !)</li>
  </ul>
  
  ${output.html}
  
  <script>
    ${output.js}
  </script>
</body>
</html>`;

// Write the output
writeFileSync('./examples/boolean-null-demo.html', html);

console.log('✓ Compiled boolean-null-demo.frobo successfully!');
console.log('✓ Output written to examples/boolean-null-demo.html');
console.log('\nFeatures implemented:');
console.log('  • Boolean literals (true, false) in state declarations');
console.log('  • Null literal in state declarations');
console.log('  • Booleans in computed properties');
console.log('  • Booleans in conditional expressions');
console.log('  • Null comparisons in conditionals');
console.log('  • Logical operators with booleans (&&, ||, !)');
