# Function Parameters and Return Values

This document describes the implementation of function parameters and return values in the Frobo compiler.

## Overview

Functions in Frobo now support:
- **Parameters**: Functions can accept one or more parameters
- **Return statements**: Functions can return values using the `return` keyword
- **Function calls with arguments**: Functions can be called with arguments in onClick handlers and other contexts

## Syntax

### Function Definition with Parameters

```frobo
function functionName(param1, param2, param3) {
  // function body
}
```

### Function with Return Statement

```frobo
function double(x) {
  return x * 2
}
```

### Function Call with Arguments

```frobo
component App {
  button "Add 5" onClick=add(5)
  button "Multiply by 3" onClick=multiply(3)
}

function add(amount) {
  result = result + amount
}

function multiply(factor) {
  result = result * factor
}
```

## Examples

### Example 1: Simple Parameter

```frobo
component Counter {
  state count = 0
  
  text "Count: {count}"
  button "Add 5" onClick=incrementBy(5)
  button "Add 10" onClick=incrementBy(10)
}

function incrementBy(amount) {
  count = count + amount
}
```

**Generated JavaScript:**
```javascript
function incrementBy(amount) {
  state.count = state.count + amount;
}
```

### Example 2: Multiple Parameters

```frobo
component Calculator {
  state result = 0
  
  button "Add 5 and 3" onClick=addTwo(5, 3)
}

function addTwo(a, b) {
  result = a + b
}
```

**Generated JavaScript:**
```javascript
function addTwo(a, b) {
  state.result = a + b;
}
```

### Example 3: Return Values

```frobo
function calculateArea(width, height) {
  return width * height
}

function getGreeting(name) {
  return "Hello, " + name
}
```

**Generated JavaScript:**
```javascript
function calculateArea(width, height) {
  return width * height;
}

function getGreeting(name) {
  return "Hello, " + name;
}
```

### Example 4: Mixed State and Parameters

```frobo
component App {
  state total = 0
  
  button "Add 100" onClick=addToTotal(100)
}

function addToTotal(amount) {
  total = total + amount
}
```

**Key Point**: The parameter `amount` is NOT prefixed with `state.`, but the state variable `total` IS prefixed with `state.`.

**Generated JavaScript:**
```javascript
function addToTotal(amount) {
  state.total = state.total + amount;
}
```

## Implementation Details

### Parser Changes

1. **Parameter Parsing**: The `parseFunction` method now correctly parses comma-separated parameters
2. **Function Call Parsing**: The `parseElement` method now handles function calls with arguments in attributes like `onClick=functionName(arg1, arg2)`

### Code Generator Changes

1. **Function Signature**: Functions are generated with their parameter list: `function name(param1, param2)`
2. **State vs Parameters**: The code generator distinguishes between state variables (prefixed with `state.`) and function parameters (not prefixed)
3. **onClick Handling**: The HTML generator correctly handles both:
   - `onClick=functionName` → generates `onclick="functionName()"`
   - `onClick=functionName(1, 2)` → generates `onclick="functionName(1, 2)"`

## Testing

The implementation includes comprehensive tests:

### Unit Tests (`tests/codegen/function-parameters.test.ts`)
- Functions with no parameters
- Functions with single parameter
- Functions with multiple parameters
- Functions with return statements
- Functions calling other functions with arguments
- Distinguishing state variables from parameters
- Parameter with same name as state variable
- onClick with and without arguments

### Integration Tests (`tests/integration/function-parameters-e2e.test.ts`)
- Complete app with parameterized functions
- Functions with return values
- Functions with multiple parameters
- Mixed parameter types

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **Requirement 2.1**: Functions accept parameters correctly
- **Requirement 2.2**: Arguments are passed to functions correctly
- **Requirement 2.3**: Return statements work correctly
- **Requirement 2.4**: Functions support multiple parameters

## Limitations

Current limitations:
- Default parameter values are not supported
- Rest parameters (`...args`) are not supported
- Destructuring parameters are not supported
- Type annotations on parameters are not supported (will be added in future type checking feature)

## Future Enhancements

Potential future improvements:
- Default parameter values: `function greet(name = "World")`
- Rest parameters: `function sum(...numbers)`
- Arrow functions: `const double = (x) => x * 2`
- Type annotations: `function add(a: number, b: number): number`
