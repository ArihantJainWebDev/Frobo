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

try {
  const result = compile(code);
  console.log('=== Testing JS Syntax ===');
  
  // Try to parse the JS to check for syntax errors
  try {
    new Function(result.js);
    console.log('✅ JS is syntactically valid');
  } catch (e) {
    console.log('❌ JS has syntax error:', e.message);
    console.log('\n=== Generated JS ===');
    const lines = result.js.split('\n');
    lines.forEach((line, i) => {
      console.log(`${String(i + 1).padStart(3, ' ')}: ${line}`);
    });
  }
  
  console.log('\n=== Function definitions ===');
  const funcMatches = result.js.match(/^function \w+\(\)/gm);
  if (funcMatches) {
    funcMatches.forEach(func => console.log(func));
  } else {
    console.log('No functions found!');
  }
  
} catch (e) {
  console.error('Compilation error:', e.message);
}
