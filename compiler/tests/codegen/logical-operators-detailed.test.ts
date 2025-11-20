import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('CodeGenerator - Logical Operators Detailed', () => {
  it('should generate correct condition string for AND operator', () => {
    const code = `component App {
      state a = true
      state b = true
      
      if a && b {
        text "Both true"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains the condition with AND operator
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('(state.a && state.b)');
  });

  it('should generate correct condition string for OR operator', () => {
    const code = `component App {
      state a = false
      state b = true
      
      if a || b {
        text "At least one true"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains the condition with OR operator
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('state.a || state.b');
  });

  it('should generate correct condition string for NOT operator', () => {
    const code = `component App {
      state isDisabled = false
      
      if !isDisabled {
        text "Enabled"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains the condition with NOT operator
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('!(state.isDisabled)');
  });

  it('should handle nested logical expressions', () => {
    const code = `component App {
      state a = true
      state b = true
      state c = false
      
      if (a && b) || c {
        text "Result"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains nested logical expressions
    expect(output.html).toContain('data-condition');
    // Should have both AND and OR operators
    expect(output.html).toMatch(/state\.a.*state\.b.*state\.c/);
  });

  it('should combine logical operators with comparison operators', () => {
    const code = `component App {
      state age = 25
      state hasLicense = true
      
      if age >= 18 && hasLicense {
        text "Can drive"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains both comparison and logical operators
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('state.age');
    expect(output.html).toContain('state.hasLicense');
    expect(output.html).toMatch(/>=.*&&/);
  });

  it('should handle multiple NOT operators', () => {
    const code = `component App {
      state a = true
      state b = false
      
      if !a && !b {
        text "Both false"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains multiple NOT operators
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('!(state.a)');
    expect(output.html).toContain('!(state.b)');
  });

  it('should handle complex nested expressions with proper precedence', () => {
    const code = `component App {
      state a = true
      state b = false
      state c = true
      state d = false
      
      if a && b || c && d {
        text "Complex"
      }
    }`;
    const output = compile(code);

    // Check that the HTML contains the complex expression
    expect(output.html).toContain('data-condition');
    // Should have proper grouping with parentheses
    expect(output.html).toMatch(/\(.*state\.a.*state\.b.*\).*\(.*state\.c.*state\.d.*\)/);
  });

  it('should work with else-if branches using logical operators', () => {
    const code = `component App {
      state score = 85
      state bonus = true
      
      if score > 90 && bonus {
        text "A+"
      } else if score > 80 || bonus {
        text "A"
      } else {
        text "B"
      }
    }`;
    const output = compile(code);

    // Check that both conditions are generated correctly
    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('state.score');
    expect(output.html).toContain('state.bonus');
  });
});
