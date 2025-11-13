export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    description: 'A simple greeting component',
    code: `component HelloWorld {
  heading "Welcome to Frobo!"
  text "Your first Frobo component"
  text "Build reactive UIs with ease"
}`
  },
  {
    id: 'counter',
    name: 'Counter',
    description: 'Interactive counter with state',
    code: `component Counter {
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
}`
  },
  {
    id: 'greeting',
    name: 'Greeting Switcher',
    description: 'Multiple state variables',
    code: `component Greeting {
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
}`
  },
  {
    id: 'calculator',
    name: 'Simple Calculator',
    description: 'Basic arithmetic operations',
    code: `component Calculator {
  state number = 0
  
  heading "Simple Calculator"
  text "Number: {number}"
  
  button "Add 5" onClick=add5
  button "Add 10" onClick=add10
  button "Subtract 3" onClick=subtract3
  button "Multiply by 2" onClick=multiply2
  button "Reset" onClick=reset
}

function add5() {
  number = number + 5
}

function add10() {
  number = number + 10
}

function subtract3() {
  number = number - 3
}

function multiply2() {
  number = number * 2
}

function reset() {
  number = 0
}`
  },
  {
    id: 'clicker-game',
    name: 'Clicker Game',
    description: 'Simple incremental game',
    code: `component ClickerGame {
  state score = 0
  state level = 1
  
  heading "Clicker Game"
  text "Score: {score}"
  text "Level: {level}"
  
  button "Click (+1)" onClick=click
  button "Big Click (+5)" onClick=bigClick
  button "Level Up!" onClick=levelUp
  button "Reset" onClick=reset
}

function click() {
  score = score + 1
}

function bigClick() {
  score = score + 5
}

function levelUp() {
  level = level + 1
  score = score + 10
}

function reset() {
  score = 0
  level = 1
}`
  },
  {
    id: 'conditional',
    name: 'Conditional Rendering',
    description: 'Show/hide elements based on state',
    code: `component ConditionalDemo {
  state count = 0
  
  heading "Conditional Rendering"
  text "Count: {count}"
  
  if count > 5 {
    text "Count is greater than 5!"
  }
  
  if count < 5 {
    text "Count is less than 5"
  } else {
    text "Count is 5 or more"
  }
  
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
}`
  },
  {
    id: 'todo-list',
    name: 'Todo List (Loops)',
    description: 'Render lists with for...in',
    code: `component TodoList {
  state count = 3
  
  heading "My Todo List"
  text "Total items: {count}"
  text "Loop rendering coming soon!"
  
  button "Add Item" onClick=addItem
}

function addItem() {
  count = count + 1
}`
  }
];

export const getExampleById = (id: string): Example | undefined => {
  return examples.find(example => example.id === id);
};

export const getDefaultExample = (): Example => {
  return examples[1]; // Counter example
};
