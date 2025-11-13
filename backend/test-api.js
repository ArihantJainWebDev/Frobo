// Simple test script for the Frobo API
// Run with: node test-api.js

const testCode = `component Counter {
  state count = 0
  
  text "Count: {count}"
  button "Increment" onClick=increment
  button "Decrement" onClick=decrement
}

function increment() {
  count = count + 1
}

function decrement() {
  count = count - 1
}`;

fetch('http://localhost:3001/api/compile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ code: testCode })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('✅ Compilation successful!\n');
      console.log('HTML:', data.output.html.substring(0, 100) + '...');
      console.log('\nCSS:', data.output.css.substring(0, 100) + '...');
      console.log('\nJS:', data.output.js.substring(0, 100) + '...');
    } else {
      console.error('❌ Compilation failed:', data.message);
    }
  })
  .catch(err => {
    console.error('❌ Request failed:', err.message);
  });
