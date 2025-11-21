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
    color: "#64748b",
    fontSize: "18",
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
    fontSize: "36",
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
    fontSize: "42",
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
  },
  {
    id: 'watchers',
    name: 'Watchers & Reactivity',
    description: 'React to state changes with watchers',
    code: `component WatcherDemo {
  state count = 0
  state message = "Click the button!"
  state history = []
  
  watch count {
    console.log("Count changed to:", count)
    message = "Count updated!"
  }
  
  h1 "Watcher Demo" style={ fontSize: "36", color: "#1e293b" }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "Counter" style={ fontSize: "24", color: "#475569" }
    text "Count: {count}" style={ fontSize: "32", fontWeight: "700", color: "#3b82f6" }
    text "Message: {message}" style={ fontSize: "18", color: "#64748b" }
    
    row {
      button "Increment" onClick=increment bg="#10b981" color="white" padding="12" rounded="8"
      button "Decrement" onClick=decrement bg="#ef4444" color="white" padding="12" rounded="8"
      button "Reset" onClick=reset bg="#64748b" color="white" padding="12" rounded="8"
    }
  }
  
  container bg="#dbeafe" padding="24" rounded="12" {
    h2 "How Watchers Work" style={ fontSize: "24", color: "#1e40af" }
    text "Watchers run automatically when state changes" style={ color: "#3b82f6" }
    text "Check the console to see watcher logs!" style={ color: "#3b82f6" }
    text "The message above updates based on count value" style={ color: "#3b82f6" }
  }
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
    id: 'complete-app',
    name: 'Complete App (All Features)',
    description: 'Showcase of every Frobo feature',
    code: `component CompleteApp {
  state isActive = false
  state count = 0
  state username = ""
  state users = []
  state loading = false
  
  computed doubleCount = count * 2
  computed greeting = "Hello, " + username + "!"
  
  watch count {
    console.log("Count is now:", count)
  }
  
  fetch url="https://jsonplaceholder.typicode.com/users" into=users loading=loading
  
  onMount {
    console.log("App mounted!")
  }
  
  h1 "🎉 Complete Frobo App" style={ fontSize: "42", color: "#1e293b", textAlign: "center" }
  
  row gap="20" {
    column style={ flex: "1" } {
      container bg="#f8fafc" padding="24" rounded="12" {
        h2 "State & Input" style={ fontSize: "24", color: "#475569" }
        input "Enter your name" value=username style={ padding: "12", borderRadius: "8" }
        text "{greeting}" style={ fontSize: "20", color: "#3b82f6" }
      }
      
      container bg="#f8fafc" padding="24" rounded="12" {
        h2 "Counter & Computed" style={ fontSize: "24", color: "#475569" }
        text "Count: {count}" style={ fontSize: "24" }
        text "Double: {doubleCount}" style={ fontSize: "20", color: "#8b5cf6" }
        
        row {
          button "+" onClick=increment bg="#10b981" color="white" padding="12" rounded="8"
          button "-" onClick=decrement bg="#ef4444" color="white" padding="12" rounded="8"
        }
      }
    }
    
    column style={ flex: "1" } {
      container bg="#f8fafc" padding="24" rounded="12" {
        h2 "Dynamic Classes" style={ fontSize: "24", color: "#475569" }
        button "Toggle Active" onClick=toggleActive bg="#3b82f6" color="white" padding="12" rounded="8"
        
        container class={ active: isActive } style={
          padding: "20",
          borderRadius: "8",
          marginTop: "12",
          background: "#e2e8f0"
        } {
          text "This box has dynamic classes!" style={ fontSize: "16" }
          text "Active state: {isActive}" style={ fontSize: "14", color: "#64748b" }
        }
      }
      
      container bg="#f8fafc" padding="24" rounded="12" {
        h2 "API Data" style={ fontSize: "24", color: "#475569" }
        
        if loading == true {
          text "Loading..." style={ color: "#3b82f6" }
        }
        
        if loading == false {
          text "✅ Data loaded!" style={ color: "#10b981", fontWeight: "600" }
        }
      }
    }
  }
  
  center height="100" bg="#1e293b" rounded="12" {
    text "Frobo: 100% Complete Framework! 🚀" color="white" style={ fontSize: "24", fontWeight: "700" }
  }
}

function increment() {
  count = count + 1
}

function decrement() {
  count = count - 1
}

function toggleActive() {
  isActive = !isActive
}`
  }
];

export const getExampleById = (id: string): Example | undefined => {
  return examples.find(example => example.id === id);
};

export const getDefaultExample = (): Example => {
  return examples[1]; // Counter example
};

// NEW: Logical Operators Examples
examples.push({
  id: 'logical-operators',
  name: '🆕 Logical Operators (&&, ||, !)',
  description: 'Use AND, OR, NOT operators in conditions',
  code: `component AccessControl {
  state isLoggedIn = true
  state hasPermission = true
  state isBlocked = false
  state age = 25
  state hasLicense = true
  
  h1 "🔐 Access Control System" style={ fontSize: "36", color: "#1e293b" }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "User Status" style={ fontSize: "24", color: "#475569" }
    
    if isLoggedIn && hasPermission && !isBlocked {
      container bg="#d1fae5" padding="20" rounded="8" {
        text "✅ Full Access Granted" style={ fontSize: "20", color: "#065f46", fontWeight: "600" }
        text "You have all required permissions" style={ color: "#047857" }
      }
    } else if isLoggedIn && !hasPermission {
      container bg="#fef3c7" padding="20" rounded="8" {
        text "⚠️ Limited Access" style={ fontSize: "20", color: "#92400e", fontWeight: "600" }
        text "Missing required permissions" style={ color: "#b45309" }
      }
    } else if !isLoggedIn {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "❌ Please Log In" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
        text "Authentication required" style={ color: "#dc2626" }
      }
    } else {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "🚫 Access Denied" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
        text "Account is blocked" style={ color: "#dc2626" }
      }
    }
    
    row gap="10" {
      button "Toggle Login" onClick=toggleLogin bg="#3b82f6" color="white" padding="12" rounded="8"
      button "Toggle Permission" onClick=togglePermission bg="#8b5cf6" color="white" padding="12" rounded="8"
      button "Toggle Block" onClick=toggleBlock bg="#ef4444" color="white" padding="12" rounded="8"
    }
  }
  
  container bg="#f8fafc" padding="24" rounded="12" {
    h2 "Driving Status" style={ fontSize: "24", color: "#475569" }
    
    if age >= 18 && hasLicense {
      container bg="#d1fae5" padding="20" rounded="8" {
        text "✅ Can Drive" style={ fontSize: "20", color: "#065f46", fontWeight: "600" }
      }
    } else if age >= 18 && !hasLicense {
      container bg="#fef3c7" padding="20" rounded="8" {
        text "⚠️ Need License" style={ fontSize: "20", color: "#92400e", fontWeight: "600" }
      }
    } else {
      container bg="#fee2e2" padding="20" rounded="8" {
        text "❌ Too Young" style={ fontSize: "20", color: "#991b1b", fontWeight: "600" }
      }
    }
    
    row gap="10" {
      button "Age +1" onClick=increaseAge bg="#10b981" color="white" padding="12" rounded="8"
      button "Age -1" onClick=decreaseAge bg="#ef4444" color="white" padding="12" rounded="8"
      button "Toggle License" onClick=toggleLicense bg="#3b82f6" color="white" padding="12" rounded="8"
    }
  }
  
  container bg="#dbeafe" padding="24" rounded="12" {
    h2 "Complex Logic" style={ fontSize: "24", color: "#1e40af" }
    
    if (isLoggedIn && hasPermission) || age >= 21 {
      text "✅ Can access premium content" style={ fontSize: "18", color: "#1e40af", fontWeight: "600" }
    } else {
      text "❌ Premium content restricted" style={ fontSize: "18", color: "#991b1b", fontWeight: "600" }
    }
  }
}

function toggleLogin() {
  isLoggedIn = !isLoggedIn
}

function togglePermission() {
  hasPermission = !hasPermission
}

function toggleBlock() {
  isBlocked = !isBlocked
}

function increaseAge() {
  age = age + 1
}

function decreaseAge() {
  age = age - 1
}

function toggleLicense() {
  hasLicense = !hasLicense
}`
});

// Landing Page Examples
examples.push({
  id: 'landing-page-saas',
  name: '🌐 SaaS Landing Page',
  description: 'Modern SaaS product landing page',
  code: `component SaaSLanding {
  state email = ""
  state showSuccess = false
  
  container style={ maxWidth: "1200", margin: "0 auto", padding: "20" } {
    row style={ justifyContent: "space-between", alignItems: "center", padding: "20" } {
      h1 "⚡ FastApp" style={ fontSize: "32", color: "#1e293b", fontWeight: "800" }
      
      row gap="16" {
        link "Features" href="#features" style={ color: "#64748b", fontSize: "16" }
        link "Pricing" href="#pricing" style={ color: "#64748b", fontSize: "16" }
        button "Sign Up" bg="#3b82f6" color="white" padding="12" rounded="8"
      }
    }
    
    center height="500" style={ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "24", marginTop: "40" } {
      column gap="24" {
        h1 "Build Faster, Ship Smarter" color="white" style={ fontSize: "56", fontWeight: "900", textAlign: "center", lineHeight: "1.2" }
        text "The all-in-one platform for modern teams" color="white" style={ fontSize: "24", textAlign: "center", opacity: "0.9" }
        
        row gap="16" {
          button "Get Started Free" bg="white" color="#667eea" padding="16" rounded="12" style={ fontSize: "18", fontWeight: "600" }
          button "Watch Demo" bg="transparent" color="white" padding="16" rounded="12" style={ fontSize: "18", border: "2px solid white" }
        }
      }
    }
    
    container style={ marginTop: "80" } {
      h2 "Trusted by 10,000+ teams worldwide" style={ fontSize: "18", color: "#64748b", textAlign: "center", textTransform: "uppercase", letterSpacing: "2" }
      
      grid cols="4" style={ marginTop: "40", gap: "40" } {
        center {
          text "🏢 Company A" style={ fontSize: "24", color: "#94a3b8" }
        }
        center {
          text "🚀 Startup B" style={ fontSize: "24", color: "#94a3b8" }
        }
        center {
          text "💼 Corp C" style={ fontSize: "24", color: "#94a3b8" }
        }
        center {
          text "🎯 Brand D" style={ fontSize: "24", color: "#94a3b8" }
        }
      }
    }
    
    container style={ marginTop: "120" } {
      h2 "Features that make you productive" style={ fontSize: "48", color: "#1e293b", textAlign: "center", fontWeight: "800" }
      text "Everything you need to build amazing products" style={ fontSize: "20", color: "#64748b", textAlign: "center", marginTop: "16" }
      
      grid cols="3" style={ marginTop: "60", gap: "32" } {
        container bg="#f8fafc" padding="32" rounded="16" {
          text "⚡" style={ fontSize: "48" }
          h3 "Lightning Fast" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Optimized for speed and performance" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          text "🔒" style={ fontSize: "48" }
          h3 "Secure by Default" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Enterprise-grade security built-in" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          text "🎨" style={ fontSize: "48" }
          h3 "Beautiful Design" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Pixel-perfect UI components" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          text "📊" style={ fontSize: "48" }
          h3 "Analytics" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Real-time insights and reporting" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          text "🔌" style={ fontSize: "48" }
          h3 "Integrations" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Connect with your favorite tools" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          text "🌍" style={ fontSize: "48" }
          h3 "Global CDN" style={ fontSize: "24", color: "#1e293b", fontWeight: "700", marginTop: "16" }
          text "Fast delivery worldwide" style={ fontSize: "16", color: "#64748b", marginTop: "12" }
        }
      }
    }
    
    center height="400" bg="#1e293b" rounded="24" style={ marginTop: "120" } {
      column gap="24" {
        h2 "Ready to get started?" color="white" style={ fontSize: "48", fontWeight: "800", textAlign: "center" }
        text "Join thousands of teams already using FastApp" color="white" style={ fontSize: "20", textAlign: "center", opacity: "0.8" }
        
        if !showSuccess {
          row gap="12" {
            input "Enter your email" value=email style={ padding: "16", fontSize: "16", borderRadius: "12", width: "300" }
            button "Start Free Trial" onClick=signup bg="#3b82f6" color="white" padding="16" rounded="12" style={ fontSize: "16", fontWeight: "600" }
          }
        }
        
        if showSuccess {
          container bg="#10b981" padding="20" rounded="12" {
            text "✅ Success! Check your email" color="white" style={ fontSize: "18", fontWeight: "600" }
          }
        }
      }
    }
    
    container style={ marginTop: "80", padding: "40", borderTop: "1px solid #e2e8f0" } {
      row style={ justifyContent: "space-between" } {
        text "© 2024 FastApp. All rights reserved." style={ color: "#64748b" }
        row gap="24" {
          link "Privacy" href="#" style={ color: "#64748b" }
          link "Terms" href="#" style={ color: "#64748b" }
          link "Contact" href="#" style={ color: "#64748b" }
        }
      }
    }
  }
}

function signup() {
  showSuccess = true
}`
});

examples.push({
  id: 'landing-page-portfolio',
  name: '🎨 Portfolio Landing Page',
  description: 'Personal portfolio/resume website',
  code: `component Portfolio {
  state activeSection = "about"
  state contactEmail = ""
  state contactMessage = ""
  
  container style={ maxWidth: "1000", margin: "0 auto", padding: "40" } {
    center height="600" style={ background: "linear-gradient(to bottom, #0f172a, #1e293b)", borderRadius: "24" } {
      column gap="24" {
        container bg="#3b82f6" padding="4" rounded="full" style={ width: "120", height: "120" } {
          center height="112" bg="#1e293b" rounded="full" {
            text "JD" color="white" style={ fontSize: "48", fontWeight: "800" }
          }
        }
        
        h1 "John Doe" color="white" style={ fontSize: "56", fontWeight: "900" }
        text "Full-Stack Developer & Designer" color="#94a3b8" style={ fontSize: "24" }
        
        row gap="16" {
          button "View Work" onClick=viewWork bg="#3b82f6" color="white" padding="16" rounded="12" style={ fontSize: "18", fontWeight: "600" }
          button "Contact Me" onClick=contact bg="transparent" color="white" padding="16" rounded="12" style={ fontSize: "18", border: "2px solid white" }
        }
      }
    }
    
    container style={ marginTop: "80" } {
      h2 "About Me" style={ fontSize: "42", color: "#1e293b", fontWeight: "800" }
      text "I'm a passionate developer with 5+ years of experience building web applications. I love creating beautiful, functional, and user-friendly experiences." style={ fontSize: "20", color: "#64748b", marginTop: "24", lineHeight: "1.8" }
    }
    
    container style={ marginTop: "80" } {
      h2 "Skills" style={ fontSize: "42", color: "#1e293b", fontWeight: "800" }
      
      grid cols="3" style={ marginTop: "40", gap: "24" } {
        container bg="#dbeafe" padding="24" rounded="16" {
          text "💻" style={ fontSize: "40" }
          h3 "Frontend" style={ fontSize: "24", color: "#1e40af", fontWeight: "700", marginTop: "12" }
          text "React, Vue, TypeScript" style={ fontSize: "16", color: "#3b82f6", marginTop: "8" }
        }
        
        container bg="#dcfce7" padding="24" rounded="16" {
          text "⚙️" style={ fontSize: "40" }
          h3 "Backend" style={ fontSize: "24", color: "#166534", fontWeight: "700", marginTop: "12" }
          text "Node.js, Python, Go" style={ fontSize: "16", color: "#10b981", marginTop: "8" }
        }
        
        container bg="#fef3c7" padding="24" rounded="16" {
          text "🎨" style={ fontSize: "40" }
          h3 "Design" style={ fontSize: "24", color: "#92400e", fontWeight: "700", marginTop: "12" }
          text "Figma, UI/UX, Branding" style={ fontSize: "16", color: "#f59e0b", marginTop: "8" }
        }
      }
    }
    
    container style={ marginTop: "80" } {
      h2 "Featured Projects" style={ fontSize: "42", color: "#1e293b", fontWeight: "800" }
      
      column gap="32" style={ marginTop: "40" } {
        container bg="#f8fafc" padding="32" rounded="16" {
          row gap="32" {
            container bg="#3b82f6" rounded="12" style={ width: "200", height: "150" } {
              center height="150" {
                text "📱" style={ fontSize: "64" }
              }
            }
            
            column gap="12" style={ flex: "1" } {
              h3 "Mobile App Dashboard" style={ fontSize: "28", color: "#1e293b", fontWeight: "700" }
              text "A beautiful analytics dashboard for mobile apps with real-time data visualization" style={ fontSize: "16", color: "#64748b", lineHeight: "1.6" }
              row gap="8" {
                container bg="#dbeafe" padding="8" rounded="8" {
                  text "React" style={ fontSize: "14", color: "#3b82f6" }
                }
                container bg="#dcfce7" padding="8" rounded="8" {
                  text "Node.js" style={ fontSize: "14", color: "#10b981" }
                }
                container bg="#fef3c7" padding="8" rounded="8" {
                  text "MongoDB" style={ fontSize: "14", color: "#f59e0b" }
                }
              }
            }
          }
        }
        
        container bg="#f8fafc" padding="32" rounded="16" {
          row gap="32" {
            container bg="#8b5cf6" rounded="12" style={ width: "200", height: "150" } {
              center height="150" {
                text "🛒" style={ fontSize: "64" }
              }
            }
            
            column gap="12" style={ flex: "1" } {
              h3 "E-Commerce Platform" style={ fontSize: "28", color: "#1e293b", fontWeight: "700" }
              text "Full-featured online store with payment processing, inventory management, and admin panel" style={ fontSize: "16", color: "#64748b", lineHeight: "1.6" }
              row gap="8" {
                container bg="#ede9fe" padding="8" rounded="8" {
                  text "Vue.js" style={ fontSize: "14", color: "#8b5cf6" }
                }
                container bg="#dbeafe" padding="8" rounded="8" {
                  text "Stripe" style={ fontSize: "14", color: "#3b82f6" }
                }
                container bg="#fee2e2" padding="8" rounded="8" {
                  text "PostgreSQL" style={ fontSize: "14", color: "#ef4444" }
                }
              }
            }
          }
        }
      }
    }
    
    center height="400" bg="#1e293b" rounded="24" style={ marginTop: "80" } {
      column gap="24" style={ maxWidth: "600" } {
        h2 "Let's Work Together" color="white" style={ fontSize: "42", fontWeight: "800", textAlign: "center" }
        text "Have a project in mind? I'd love to hear about it!" color="#94a3b8" style={ fontSize: "18", textAlign: "center" }
        
        column gap="16" style={ width: "100%" } {
          input "Your email" value=contactEmail style={ padding: "16", fontSize: "16", borderRadius: "12", width: "100%" }
          input "Your message" value=contactMessage style={ padding: "16", fontSize: "16", borderRadius: "12", width: "100%" }
          button "Send Message" bg="#3b82f6" color="white" padding="16" rounded="12" style={ fontSize: "16", fontWeight: "600", width: "100%" }
        }
      }
    }
    
    container style={ marginTop: "60", padding: "40", borderTop: "1px solid #e2e8f0" } {
      center {
        row gap="32" {
          link "GitHub" href="#" style={ color: "#64748b", fontSize: "16" }
          link "LinkedIn" href="#" style={ color: "#64748b", fontSize: "16" }
          link "Twitter" href="#" style={ color: "#64748b", fontSize: "16" }
          link "Email" href="#" style={ color: "#64748b", fontSize: "16" }
        }
      }
    }
  }
}

function viewWork() {
  activeSection = "work"
}

function contact() {
  activeSection = "contact"
}`
});

examples.push({
  id: 'landing-page-agency',
  name: '🏢 Agency Landing Page',
  description: 'Creative agency/studio website',
  code: `component AgencyLanding {
  state selectedService = "design"
  state formName = ""
  state formEmail = ""
  
  container style={ maxWidth: "1400", margin: "0 auto", padding: "20" } {
    row style={ justifyContent: "space-between", alignItems: "center", padding: "30", background: "white", borderRadius: "16", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } {
      h1 "CREATIVE STUDIO" style={ fontSize: "24", color: "#1e293b", fontWeight: "900", letterSpacing: "2" }
      
      row gap="32" {
        link "Services" href="#services" style={ color: "#64748b", fontSize: "16", fontWeight: "500" }
        link "Work" href="#work" style={ color: "#64748b", fontSize: "16", fontWeight: "500" }
        link "About" href="#about" style={ color: "#64748b", fontSize: "16", fontWeight: "500" }
        button "Let's Talk" bg="#1e293b" color="white" padding="14" rounded="8" style={ fontWeight: "600" }
      }
    }
    
    container style={ marginTop: "60" } {
      row gap="60" style={ alignItems: "center" } {
        column gap="32" style={ flex: "1" } {
          h1 "We Create Digital Experiences" style={ fontSize: "72", color: "#1e293b", fontWeight: "900", lineHeight: "1.1" }
          text "Award-winning design studio crafting beautiful brands, websites, and digital products for forward-thinking companies." style={ fontSize: "22", color: "#64748b", lineHeight: "1.7" }
          
          row gap="16" {
            button "Start a Project" bg="#1e293b" color="white" padding="20" rounded="12" style={ fontSize: "18", fontWeight: "600" }
            button "View Our Work" bg="#f8fafc" color="#1e293b" padding="20" rounded="12" style={ fontSize: "18", fontWeight: "600" }
          }
        }
        
        container bg="#f8fafc" rounded="24" style={ flex: "1", height: "600" } {
          center height="600" {
            text "🎨" style={ fontSize: "200" }
          }
        }
      }
    }
    
    container style={ marginTop: "120" } {
      center {
        h2 "Trusted by industry leaders" style={ fontSize: "16", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "3" }
      }
      
      grid cols="5" style={ marginTop: "60", gap: "40" } {
        center {
          text "BRAND" style={ fontSize: "24", color: "#cbd5e1", fontWeight: "800" }
        }
        center {
          text "COMPANY" style={ fontSize: "24", color: "#cbd5e1", fontWeight: "800" }
        }
        center {
          text "STARTUP" style={ fontSize: "24", color: "#cbd5e1", fontWeight: "800" }
        }
        center {
          text "CORP" style={ fontSize: "24", color: "#cbd5e1", fontWeight: "800" }
        }
        center {
          text "TECH" style={ fontSize: "24", color: "#cbd5e1", fontWeight: "800" }
        }
      }
    }
    
    container style={ marginTop: "160" } {
      h2 "What We Do" style={ fontSize: "64", color: "#1e293b", fontWeight: "900", textAlign: "center" }
      
      grid cols="3" style={ marginTop: "80", gap: "40" } {
        column gap="20" {
          container bg="#1e293b" rounded="16" style={ width: "80", height: "80" } {
            center height="80" {
              text "✨" style={ fontSize: "40" }
            }
          }
          h3 "Brand Design" style={ fontSize: "28", color: "#1e293b", fontWeight: "800" }
          text "We create memorable brand identities that resonate with your audience and stand out in the market." style={ fontSize: "18", color: "#64748b", lineHeight: "1.7" }
          link "Learn more →" href="#" style={ color: "#1e293b", fontSize: "16", fontWeight: "600" }
        }
        
        column gap="20" {
          container bg="#1e293b" rounded="16" style={ width: "80", height: "80" } {
            center height="80" {
              text "💻" style={ fontSize: "40" }
            }
          }
          h3 "Web Design" style={ fontSize: "28", color: "#1e293b", fontWeight: "800" }
          text "Beautiful, responsive websites that convert visitors into customers and deliver exceptional user experiences." style={ fontSize: "18", color: "#64748b", lineHeight: "1.7" }
          link "Learn more →" href="#" style={ color: "#1e293b", fontSize: "16", fontWeight: "600" }
        }
        
        column gap="20" {
          container bg="#1e293b" rounded="16" style={ width: "80", height: "80" } {
            center height="80" {
              text "📱" style={ fontSize: "40" }
            }
          }
          h3 "Digital Products" style={ fontSize: "28", color: "#1e293b", fontWeight: "800" }
          text "End-to-end product design and development that brings your vision to life with cutting-edge technology." style={ fontSize: "18", color: "#64748b", lineHeight: "1.7" }
          link "Learn more →" href="#" style={ color: "#1e293b", fontSize: "16", fontWeight: "600" }
        }
      }
    }
    
    container bg="#1e293b" rounded="32" style={ marginTop: "160", padding: "100" } {
      center {
        column gap="40" style={ maxWidth: "800" } {
          h2 "Featured Work" color="white" style={ fontSize: "64", fontWeight: "900", textAlign: "center" }
          
          grid cols="2" gap="32" {
            container bg="#334155" rounded="16" style={ height: "300" } {
              center height="300" {
                column gap="16" {
                  text "🎯" style={ fontSize: "64" }
                  text "Project Alpha" color="white" style={ fontSize: "24", fontWeight: "700" }
                  text "Brand Identity" color="#94a3b8" style={ fontSize: "16" }
                }
              }
            }
            
            container bg="#334155" rounded="16" style={ height: "300" } {
              center height="300" {
                column gap="16" {
                  text "🚀" style={ fontSize: "64" }
                  text "Project Beta" color="white" style={ fontSize: "24", fontWeight: "700" }
                  text "Web Design" color="#94a3b8" style={ fontSize: "16" }
                }
              }
            }
          }
          
          button "View All Projects" bg="white" color="#1e293b" padding="20" rounded="12" style={ fontSize: "18", fontWeight: "600", marginTop: "20" }
        }
      }
    }
    
    container style={ marginTop: "160" } {
      row gap="80" style={ alignItems: "center" } {
        column gap="32" style={ flex: "1" } {
          h2 "Let's Create Something Amazing Together" style={ fontSize: "56", color: "#1e293b", fontWeight: "900", lineHeight: "1.2" }
          text "Ready to start your project? Get in touch and let's discuss how we can help bring your vision to life." style={ fontSize: "20", color: "#64748b", lineHeight: "1.7" }
        }
        
        container bg="#f8fafc" padding="48" rounded="24" style={ flex: "1" } {
          column gap="24" {
            h3 "Get Started" style={ fontSize: "32", color: "#1e293b", fontWeight: "800" }
            
            column gap="16" {
              input "Your name" value=formName style={ padding: "16", fontSize: "16", borderRadius: "12", border: "2px solid #e2e8f0" }
              input "Your email" value=formEmail style={ padding: "16", fontSize: "16", borderRadius: "12", border: "2px solid #e2e8f0" }
              button "Send Inquiry" bg="#1e293b" color="white" padding="18" rounded="12" style={ fontSize: "16", fontWeight: "600" }
            }
          }
        }
      }
    }
    
    container style={ marginTop: "120", padding: "60", borderTop: "1px solid #e2e8f0" } {
      row style={ justifyContent: "space-between", alignItems: "center" } {
        column gap="16" {
          h3 "CREATIVE STUDIO" style={ fontSize: "20", color: "#1e293b", fontWeight: "900", letterSpacing: "2" }
          text "© 2024 All rights reserved" style={ color: "#94a3b8", fontSize: "14" }
        }
        
        column gap="12" {
          row gap="24" {
            link "Instagram" href="#" style={ color: "#64748b", fontSize: "16" }
            link "Dribbble" href="#" style={ color: "#64748b", fontSize: "16" }
            link "Behance" href="#" style={ color: "#64748b", fontSize: "16" }
          }
          row gap="24" {
            link "hello@studio.com" href="#" style={ color: "#64748b", fontSize: "16" }
            link "+1 (555) 123-4567" href="#" style={ color: "#64748b", fontSize: "16" }
          }
        }
      }
    }
  }
}`
});