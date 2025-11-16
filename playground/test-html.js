const { compile } = require('./lib/compiler');

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
console.log('=== HTML ===');
console.log(result.html);
console.log('\n=== Buttons in HTML ===');
const buttonMatches = result.html.match(/<button[^>]*>.*?<\/button>/g);
if (buttonMatches) {
  buttonMatches.forEach(btn => console.log(btn));
}
