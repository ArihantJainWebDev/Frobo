import { describe, it, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Function Parameters End-to-End', () => {
  it('should compile a complete app with parameterized functions', () => {
    const code = `component Calculator {
  state result = 0
  
  heading "Calculator"
  text "Result: {result}"
  
  button "Add 5" onClick=add(5)
  button "Add 10" onClick=add(10)
  button "Multiply by 2" onClick=multiply(2)
  button "Reset" onClick=reset()
}

function add(amount) {
  result = result + amount
}

function multiply(factor) {
  result = result * factor
}

function reset() {
  result = 0
}`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    expect(lexer.getErrors()).toHaveLength(0);

    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(parser.getErrors()).toHaveLength(0);

    const generator = new CodeGenerator(ast);
    const output = generator.generate();

    // Check HTML
    expect(output.html).toContain('<h1');
    expect(output.html).toContain('Calculator');
    expect(output.html).toContain('onclick="add(5)"');
    expect(output.html).toContain('onclick="add(10)"');
    expect(output.html).toContain('onclick="multiply(2)"');
    expect(output.html).toContain('onclick="reset()"');

    // Check JS
    expect(output.js).toContain('function add(amount)');
    expect(output.js).toContain('state.result = state.result + amount');
    expect(output.js).toContain('function multiply(factor)');
    expect(output.js).toContain('state.result = state.result * factor');
    expect(output.js).toContain('function reset()');
    expect(output.js).toContain('state.result = 0');
  });

  it('should handle functions with return values', () => {
    const code = `component App {
  state value = 0
}

function double(x) {
  return x * 2
}

function triple(x) {
  return x * 3
}`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new CodeGenerator(ast);
    const output = generator.generate();

    expect(output.js).toContain('function double(x)');
    expect(output.js).toContain('return x * 2');
    expect(output.js).toContain('function triple(x)');
    expect(output.js).toContain('return x * 3');
  });

  it('should handle functions with multiple parameters', () => {
    const code = `component App {
  state sum = 0
}

function addThree(a, b, c) {
  sum = a + b + c
}`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new CodeGenerator(ast);
    const output = generator.generate();

    expect(output.js).toContain('function addThree(a, b, c)');
    expect(output.js).toContain('state.sum = a + b + c');
  });

  it('should handle mixed parameter types', () => {
    const code = `component App {
  state message = ""
}

function greet(name, age) {
  message = name + " is " + age
}`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new CodeGenerator(ast);
    const output = generator.generate();

    expect(output.js).toContain('function greet(name, age)');
    expect(output.js).toContain('state.message = name + " is " + age');
  });
});
