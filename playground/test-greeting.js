const { compile } = require('./lib/compiler');

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
console.log('=== HTML ===');
console.log(result.html);
console.log('\n=== Text element ===');
const textMatch = result.html.match(/<p[^>]*>.*?<\/p>/);
if (textMatch) {
  console.log(textMatch[0]);
}
