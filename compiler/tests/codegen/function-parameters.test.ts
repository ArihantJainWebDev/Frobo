import { describe, it, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Function Parameters and Return Values', () => {
  describe('Function with no parameters', () => {
    it('should generate function with no parameters', () => {
      const code = `
function greet() {
  message = "Hello"
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function greet()');
    });
  });

  describe('Function with single parameter', () => {
    it('should generate function with single parameter', () => {
      const code = `
function greet(name) {
  message = name
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function greet(name)');
      // Parameter should not be prefixed with state.
      expect(output.js).toContain('message = name');
    });
  });

  describe('Function with multiple parameters', () => {
    it('should generate function with multiple parameters', () => {
      const code = `
function add(a, b) {
  result = a + b
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function add(a, b)');
      expect(output.js).toContain('result = a + b');
    });
  });

  describe('Function with return statement', () => {
    it('should preserve return statement in function body', () => {
      const code = `
function double(x) {
  return x * 2
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function double(x)');
      expect(output.js).toContain('return x * 2');
    });
  });

  describe('Function calling another function with arguments', () => {
    it('should handle function calls with arguments', () => {
      const code = `
component Calculator {
  state result = 0
  
  button "Add 5 and 3" onClick=addNumbers(5, 3)
}

function addNumbers(a, b) {
  result = a + b
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      // Should generate button with onclick that calls function with arguments
      expect(output.html).toContain('onclick="addNumbers(5, 3)"');
      expect(output.js).toContain('function addNumbers(a, b)');
    });
  });

  describe('Function with state and parameters', () => {
    it('should distinguish between state variables and parameters', () => {
      const code = `
component App {
  state count = 0
  
  button "Increment by 5" onClick=incrementBy(5)
}

function incrementBy(amount) {
  count = count + amount
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function incrementBy(amount)');
      // count should be prefixed with state., but amount should not
      expect(output.js).toContain('state.count = state.count + amount');
    });
  });

  describe('Function with multiple parameters and return', () => {
    it('should handle complex function with parameters and return', () => {
      const code = `
function calculate(x, y, operation) {
  return x + y
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function calculate(x, y, operation)');
      expect(output.js).toContain('return x + y');
    });
  });

  describe('Function parameter with same name as state variable', () => {
    it('should use parameter value, not state value', () => {
      const code = `
component App {
  state value = 10
}

function setValue(value) {
  result = value
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function setValue(value)');
      // The parameter 'value' should not be replaced with state.value
      expect(output.js).toContain('result = value');
    });
  });

  describe('Function with no parameters but with return', () => {
    it('should generate function with return statement', () => {
      const code = `
function getGreeting() {
  return "Hello, World!"
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      expect(output.js).toContain('function getGreeting()');
      expect(output.js).toContain('return "Hello, World!"');
    });
  });

  describe('Button onClick with function call and arguments', () => {
    it('should not add extra parentheses when function call already has them', () => {
      const code = `
component App {
  button "Click" onClick=handleClick(1, 2)
}

function handleClick(a, b) {
  result = a + b
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      // Should have exactly one set of parentheses with arguments
      expect(output.html).toContain('onclick="handleClick(1, 2)"');
      expect(output.html).not.toContain('handleClick(1, 2)()');
    });
  });

  describe('Button onClick without arguments', () => {
    it('should add parentheses for no-arg function calls', () => {
      const code = `
component App {
  button "Click" onClick=handleClick
}

function handleClick() {
  count = count + 1
}`;

      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const generator = new CodeGenerator(ast);
      const output = generator.generate();

      // Should add parentheses for no-arg function
      expect(output.html).toContain('onclick="handleClick()"');
    });
  });
});
