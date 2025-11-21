import { describe, test, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Nested Property Access - Simple', () => {
  test('should tokenize dot notation', () => {
    const code = 'user.name';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    
    expect(tokens[0].value).toBe('user');
    expect(tokens[1].value).toBe('.');
    expect(tokens[2].value).toBe('name');
  });

  test('should parse member expression', () => {
    const code = `
component Test {
  state name = "John"
  
  if name == "John" {
    text "Hello"
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
