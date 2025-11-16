const { compile } = require('./lib/compiler');
const fs = require('fs');

const code = `component Counter {
  state count = 0
  heading "Counter"
  text "Count: {count}"
  button "Increment" onClick=increment
  button "Decrement" onClick=decrement
  button "Reset" onClick=reset
}

function increment() {
  count = count + 1
}

function decrement() {
  count = count - 1
}

function reset() {
  count = 0
}`;

const result = compile(code);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}
${result.css}
</style>
</head>
<body>
${result.html}
<script>
${result.js}
</script>
</body>
</html>`;

fs.writeFileSync('test-output.html', html);
console.log('✅ Written to test-output.html');
console.log('Open it in a browser to test');
