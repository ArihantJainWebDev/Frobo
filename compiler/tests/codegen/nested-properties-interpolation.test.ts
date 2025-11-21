import { describe, test, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Nested Property Access - String Interpolation', () => {
  test('should support nested properties in string interpolation', () => {
    const code = `
component Test {
  state user = { profile: { name: "John" } }
  
  text "Hello, {user.profile.name}!"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should handle nested property in template
    expect(output.html).toContain('data-template');
    // The template should contain the nested property reference
    expect(output.html).toContain('user.profile.name');
  });

  test('should support single level property in string interpolation', () => {
    const code = `
component Test {
  state user = { name: "John" }
  
  text "Hello, {user.name}!"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should handle property in template
    expect(output.html).toContain('data-template');
    expect(output.html).toContain('user.name');
  });
});
