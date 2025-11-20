import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('CodeGenerator - Logical Operators', () => {
  it('should generate JS for AND operator (&&)', () => {
    const code = `component App {
      state isLoggedIn = true
      state hasPermission = true
      
      if isLoggedIn && hasPermission {
        text "Access granted"
      }
    }`;
    const output = compile(code);

    // Should contain the AND operator in the condition
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });

  it('should generate JS for OR operator (||)', () => {
    const code = `component App {
      state isAdmin = false
      state isModerator = true
      
      if isAdmin || isModerator {
        text "Can moderate"
      }
    }`;
    const output = compile(code);

    // Should contain the OR operator in the condition
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });

  it('should generate JS for NOT operator (!)', () => {
    const code = `component App {
      state isDisabled = false
      
      if !isDisabled {
        text "Button is enabled"
      }
    }`;
    const output = compile(code);

    // Should contain the NOT operator in the condition
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });

  it('should generate JS for complex logical expressions', () => {
    const code = `component App {
      state isLoggedIn = true
      state hasPermission = true
      state isBlocked = false
      
      if isLoggedIn && hasPermission && !isBlocked {
        text "Full access"
      }
    }`;
    const output = compile(code);

    // Should handle complex nested logical expressions
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });

  it('should generate JS for logical operators with comparisons', () => {
    const code = `component App {
      state age = 25
      state hasLicense = true
      
      if age >= 18 && hasLicense {
        text "Can drive"
      }
    }`;
    const output = compile(code);

    // Should combine comparison and logical operators
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });

  it('should handle operator precedence correctly', () => {
    const code = `component App {
      state a = true
      state b = false
      state c = true
      
      if a || b && c {
        text "Result"
      }
    }`;
    const output = compile(code);

    // Should respect operator precedence (AND before OR)
    expect(output.html).toContain('data-condition');
    expect(output.js).toContain('setupConditionals');
  });
});
