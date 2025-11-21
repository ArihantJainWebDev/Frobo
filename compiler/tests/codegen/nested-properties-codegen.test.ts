import { describe, test, expect } from 'vitest';
import { Lexer } from '../../src/lexer.js';
import { Parser } from '../../src/parser.js';
import { CodeGenerator } from '../../src/codegen.js';

describe('Nested Property Access - Code Generation', () => {
  test('should generate safe property access in conditions', () => {
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
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should use optional chaining in generated condition (in HTML data attribute)
    expect(output.html).toContain('state.user?.age');
  });

  test('should support deeply nested properties', () => {
    const code = `
component Test {
  state data = { level1: { level2: { value: 42 } } }
  
  if data.level1.level2.value == 42 {
    text "Found"
  }
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should use optional chaining for all levels (in HTML data attribute)
    expect(output.html).toContain('state.data?.level1?.level2?.value');
  });

  test('should initialize nested objects in state', () => {
    const code = `
component Test {
  state user = { profile: { name: "John", email: "test@example.com" } }
  text "Hello"
}
    `.trim();

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const codegen = new CodeGenerator(ast);
    const output = codegen.generate();

    // Should initialize nested object structure
    expect(output.js).toContain('user:');
    expect(output.js).toContain('profile');
    expect(output.js).toContain('name');
    expect(output.js).toContain('John');
  });
});
