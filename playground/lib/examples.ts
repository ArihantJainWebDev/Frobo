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
  state items = ["Buy milk", "Learn Frobo", "Build apps"]
  
  heading "My Todo List"
  
  for item in items {
    text "{item}"
  }
}`
  },
  {
    id: 'styled-card',
    name: 'Styled Card',
    description: 'Custom styling with CSS',
    code: `component StyledCard {
  heading "Beautiful Card" style={ color: "#2563eb", fontSize: "32" }
  
  text "This card has custom styles!" style={
    color: "#64748b"
    fontSize: "18"
    padding: "10"
  }
  
  button "Primary Button" bg="#3b82f6" color="white" padding="12"
  button "Secondary" bg="#e2e8f0" color="#1e293b" rounded="8"
}`
  },
  {
    id: 'reusable-components',
    name: 'Reusable Components',
    description: 'Components with props',
    code: `component Card {
  props title, message
  
  heading "{title}"
  text "{message}"
}

component App {
  heading "Component Props Demo"
  
  Card title="Welcome" message="This is a reusable card component"
  Card title="Hello" message="Props make components flexible"
  Card title="Awesome" message="Build once, use everywhere!"
}`
  },
  {
    id: 'nested-elements',
    name: 'Nested Elements',
    description: 'Build complex layouts with nesting',
    code: `component NestedDemo {
  heading "Nested Elements Demo"
  
  container style={ background: "#f8fafc", padding: "20", borderRadius: "12" } {
    heading "Card Title" style={ fontSize: "24", color: "#1e293b" }
    text "This is inside a container!" style={ color: "#64748b" }
    
    container style={ background: "#e2e8f0", padding: "16", borderRadius: "8" } {
      text "Nested even deeper!" style={ color: "#475569" }
      button "Click Me" bg="#3b82f6" color="white"
    }
  }
  
  container style={ background: "#dbeafe", padding: "20", borderRadius: "12" } {
    heading "Another Section" style={ color: "#1e40af" }
    text "Containers can hold multiple elements"
    text "And they can be styled independently"
  }
}`
  },
  {
    id: 'input-forms',
    name: 'Input & Forms',
    description: 'Capture user input with two-way binding',
    code: `component FormDemo {
  state name = ""
  state email = ""
  state message = ""
  
  heading "Contact Form" style={
    fontSize: "36"
    color: "#1e293b"
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    text "Name: {name}" style={ fontSize: "18", color: "#64748b" }
    input "Enter your name" value=name style={
      padding: "12"
      fontSize: "16"
      borderRadius: "8"
      border: "2px solid #e2e8f0"
      width: "100%"
    }
    
    text "Email: {email}" style={ fontSize: "18", color: "#64748b" }
    input "Enter your email" value=email style={
      padding: "12"
      fontSize: "16"
      borderRadius: "8"
      border: "2px solid #e2e8f0"
      width: "100%"
    }
    
    text "Message: {message}" style={ fontSize: "18", color: "#64748b" }
    input "Enter your message" value=message style={
      padding: "12"
      fontSize: "16"
      borderRadius: "8"
      border: "2px solid #e2e8f0"
      width: "100%"
    }
    
    button "Submit" onClick=submitForm bg="#3b82f6" color="white" padding="16" rounded="8" style={
      fontSize: "18"
      fontWeight: "600"
    }
    
    button "Clear" onClick=clearForm bg="#ef4444" color="white" padding="16" rounded="8" style={
      fontSize: "18"
      fontWeight: "600"
    }
  }
}

function submitForm() {
  name = "Submitted!"
}

function clearForm() {
  name = ""
  email = ""
  message = ""
}`
  },
  {
    id: 'all-elements',
    name: 'All UI Elements',
    description: 'Showcase of all available elements',
    code: `component AllElements {
  state bio = "Tell us about yourself..."
  state website = "https://frobo.dev"
  
  heading "🎨 All Frobo Elements" style={
    fontSize: "42"
    color: "#1e293b"
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    heading "Text Elements" style={ fontSize: "24", color: "#475569" }
    text "Regular paragraph text"
    heading "This is a heading"
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    heading "Input Elements" style={ fontSize: "24", color: "#475569" }
    input "Type here..." value=website style={ padding: "12", borderRadius: "8" }
    text "You typed: {website}"
    
    textarea "Write something long..." value=bio style={
      padding: "12"
      borderRadius: "8"
      width: "100%"
      minHeight: "100"
    }
    text "Bio: {bio}"
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    heading "Buttons" style={ fontSize: "24", color: "#475569" }
    button "Primary" bg="#3b82f6" color="white" padding="12" rounded="8"
    button "Success" bg="#10b981" color="white" padding="12" rounded="8"
    button "Danger" bg="#ef4444" color="white" padding="12" rounded="8"
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    heading "Images" style={ fontSize: "24", color: "#475569" }
    image "https://via.placeholder.com/400x200/3b82f6/ffffff?text=Frobo" alt="Frobo Logo" style={
      borderRadius: "12"
      width: "100%"
    }
  }
  
  container style={ background: "#f8fafc", padding: "24", borderRadius: "12" } {
    heading "Links" style={ fontSize: "24", color: "#475569" }
    link "Visit Frobo Docs" href="https://github.com" target="_blank" style={
      color: "#3b82f6"
      fontSize: "18"
      textDecoration: "underline"
    }
  }
}`
  },
  {
    id: 'layouts',
    name: 'Flexbox & Grid Layouts',
    description: 'Build responsive layouts easily',
    code: `component LayoutDemo {
  heading "🎨 Layout Components" style={ fontSize: "42", color: "#1e293b" }
  
  h2 "Row Layout (Flexbox)" style={ fontSize: "28", color: "#475569" }
  row style={ background: "#f8fafc", padding: "20", borderRadius: "12" } {
    container bg="#3b82f6" padding="40" rounded="8" {
      text "Box 1" color="white" style={ fontSize: "20", fontWeight: "600" }
    }
    container bg="#8b5cf6" padding="40" rounded="8" {
      text "Box 2" color="white" style={ fontSize: "20", fontWeight: "600" }
    }
    container bg="#10b981" padding="40" rounded="8" {
      text "Box 3" color="white" style={ fontSize: "20", fontWeight: "600" }
    }
  }
  
  h2 "Column Layout" style={ fontSize: "28", color: "#475569" }
  column style={ background: "#f8fafc", padding: "20", borderRadius: "12" } {
    container bg="#ef4444" padding="20" rounded="8" {
      text "Item 1" color="white"
    }
    container bg="#f59e0b" padding="20" rounded="8" {
      text "Item 2" color="white"
    }
    container bg="#06b6d4" padding="20" rounded="8" {
      text "Item 3" color="white"
    }
  }
  
  h2 "Grid Layout" style={ fontSize: "28", color: "#475569" }
  grid cols="3" style={ background: "#f8fafc", padding: "20", borderRadius: "12" } {
    container bg="#3b82f6" padding="30" rounded="8" {
      text "Grid 1" color="white"
    }
    container bg="#8b5cf6" padding="30" rounded="8" {
      text "Grid 2" color="white"
    }
    container bg="#10b981" padding="30" rounded="8" {
      text "Grid 3" color="white"
    }
    container bg="#ef4444" padding="30" rounded="8" {
      text "Grid 4" color="white"
    }
    container bg="#f59e0b" padding="30" rounded="8" {
      text "Grid 5" color="white"
    }
    container bg="#06b6d4" padding="30" rounded="8" {
      text "Grid 6" color="white"
    }
  }
  
  h2 "Center Layout" style={ fontSize: "28", color: "#475569" }
  center height="200" style={ background: "#f8fafc", borderRadius: "12" } {
    container bg="#3b82f6" padding="40" rounded="12" {
      text "Perfectly Centered!" color="white" style={ fontSize: "24", fontWeight: "700" }
    }
  }
}`
  },
  {
    id: 'computed-lifecycle',
    name: 'Computed & Lifecycle',
    description: 'Computed properties and lifecycle hooks',
    code: `component UserProfile {
  state firstName = "John"
  state lastName = "Doe"
  state age = 25
  
  computed fullName = firstName + " " + lastName
  computed isAdult = age >= 18
  computed greeting = "Hello, " + fullName + "!"
  
  onMount {
    console.log("Component mounted!")
    age = age + 1
  }
  
  h1 "User Profile" style={ fontSize: "36", color: "#1e293b" }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "Personal Info" style={ fontSize: "24", color: "#475569" }
    
    text "First Name: {firstName}"
    input "First name" value=firstName style={ padding: "12", borderRadius: "8" }
    
    text "Last Name: {lastName}"
    input "Last name" value=lastName style={ padding: "12", borderRadius: "8" }
    
    text "Age: {age}"
    button "Birthday!" onClick=birthday bg="#3b82f6" color="white" padding="12" rounded="8"
  }
  
  container bg="#dbeafe" padding="24" rounded="12" {
    h2 "Computed Values" style={ fontSize: "24", color: "#1e40af" }
    
    text "Full Name: {fullName}" style={ fontSize: "20", fontWeight: "600" }
    text "Greeting: {greeting}" style={ fontSize: "18", color: "#3b82f6" }
    text "Adult Status: {isAdult}" style={ fontSize: "18" }
  }
}

function birthday() {
  age = age + 1
}`
  },
  {
    id: 'api-fetch',
    name: 'API & Data Fetching',
    description: 'Fetch data from APIs with loading states',
    code: `component UserList {
  state users = []
  state loading = true
  state error = null
  
  fetch url="https://jsonplaceholder.typicode.com/users" into=users loading=loading error=error
  
  h1 "User Directory" style={ fontSize: "36", color: "#1e293b" }
  
  if loading == true {
    container bg="#dbeafe" padding="24" rounded="12" {
      text "Loading users..." style={ fontSize: "20", color: "#3b82f6" }
    }
  }
  
  if error != null {
    container bg="#fee2e2" padding="24" rounded="12" {
      text "Error: {error}" style={ fontSize: "18", color: "#ef4444" }
    }
  }
  
  if loading == false {
    h2 "Users Loaded!" style={ fontSize: "24", color: "#10b981" }
    
    grid cols="2" style={ marginTop: "20" } {
      container bg="#f8fafc" padding="20" rounded="12" {
        h3 "User 1" style={ fontSize: "20", color: "#1e293b" }
        text "Data fetched from API"
      }
      container bg="#f8fafc" padding="20" rounded="12" {
        h3 "User 2" style={ fontSize: "20", color: "#1e293b" }
        text "Real-time data loading"
      }
      container bg="#f8fafc" padding="20" rounded="12" {
        h3 "User 3" style={ fontSize: "20", color: "#1e293b" }
        text "Automatic state management"
      }
      container bg="#f8fafc" padding="20" rounded="12" {
        h3 "User 4" style={ fontSize: "20", color: "#1e293b" }
        text "Error handling built-in"
      }
    }
  }
}`
  }
];

export const getExampleById = (id: string): Example | undefined => {
  return examples.find(example => example.id === id);
};

export const getDefaultExample = (): Example => {
  return examples[1]; // Counter example
};
