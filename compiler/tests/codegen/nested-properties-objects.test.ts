import { describe, test, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Nested Property Access - Objects', () => {
  test('should parse simple nested object in state', () => {
    const code = `
component Test {
  state user = { name: "John", age: 25 }
  text "Hello"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    expect(ast.children).toBeDefined();
  });

  test('should parse deeply nested object in state', () => {
    const code = `
component Test {
  state user = { profile: { name: "John" } }
  text "Hello"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    expect(ast.children).toBeDefined();
  });

  test('should access nested property in condition', () => {
    const code = `
component Test {
  state user = { age: 25 }
  
  if user.age > 18 {
    text "Adult"
  }
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
  });
});
