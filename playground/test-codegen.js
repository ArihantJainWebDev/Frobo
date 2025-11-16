const { compile } = require('./lib/compiler');

const code = `component Counter {
  state count = 0
  
  heading "Counter App"
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

try {
  const result = compile(code);
  console.log('=== GENERATED JS ===');
  const lines = result.js.split('\n');
  lines.forEach((line, i) => {
    console.log(`${String(i + 1).padStart(3, ' ')}: ${line}`);
  });
} catch (e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}
