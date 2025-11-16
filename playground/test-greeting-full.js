const { compile } = require('./lib/compiler');
const fs = require('fs');

const code = `component Greeting {
  state greeting = "Hello"
  state name = "World"
  
  heading "Greeting Switcher"
  text "{greeting}, {name}!"
  
  button "Say Hello" onClick=sayHello
  button "Say Hi" onClick=sayHi
  button "Say Hey" onClick=sayHey
  button "Change Name" onClick=changeName
}

function sayHello() {
  greeting = "Hello"
}

function sayHi() {
  greeting = "Hi"
}

function sayHey() {
  greeting = "Hey"
}

function changeName() {
  name = "Friend"
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

fs.writeFileSync('test-greeting-output.html', html);
console.log('✅ Written to test-greeting-output.html');
console.log('Open it in a browser to test the greeting example');
