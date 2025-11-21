import { describe, test, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Nested Property Access - Computed Properties', () => {
  test('should support nested properties in computed properties', () => {
    const code = `
component Test {
  state user = { profile: { firstName: "John", lastName: "Doe" } }
  computed fullName = user.profile.firstName + " " + user.profile.lastName
  
  text "{fullName}"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should reference nested properties in computed
    expect(output.js).toContain('state.user');
    expect(output.js).toContain('profile');
    expect(output.js).toContain('firstName');
    expect(output.js).toContain('lastName');
  });

  test('should handle single level nested property in computed', () => {
    const code = `
component Test {
  state user = { name: "John" }
  computed greeting = "Hello, " + user.name
  
  text "{greeting}"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(parser.getErrors()).toHaveLength(0);
    
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should reference nested property
    expect(output.js).toContain('state.user');
    expect(output.js).toContain('name');
  });
});
