import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('CodeGenerator - Boolean and Null Literals', () => {
  it('should support boolean literals in state declarations', () => {
    const code = `component App {
      state isActive = true
      state isDisabled = false
      text "Status"
    }`;
    const output = compile(code);

    expect(output.js).toContain('isActive: true');
    expect(output.js).toContain('isDisabled: false');
  });

  it('should support null literal in state declarations', () => {
    const code = `component App {
      state user = null
      text "User"
    }`;
    const output = compile(code);

    expect(output.js).toContain('user: null');
  });

  it('should support booleans in computed properties', () => {
    const code = `component App {
      state count = 5
      computed isPositive = count > 0
      text "Count"
    }`;
    const output = compile(code);

    expect(output.js).toContain('isPositive');
    expect(output.js).toContain('state.count');
  });

  it('should support boolean literals in conditional expressions', () => {
    const code = `component App {
      state flag = true
      
      if flag {
        text "Flag is true"
      } else {
        text "Flag is false"
      }
    }`;
    const output = compile(code);

    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('state.flag');
  });

  it('should support null comparisons in conditionals', () => {
    const code = `component App {
      state user = null
      
      if user == null {
        text "No user"
      } else {
        text "User exists"
      }
    }`;
    const output = compile(code);

    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('state.user');
    expect(output.html).toContain('null');
  });

  it('should support boolean literals with logical operators', () => {
    const code = `component App {
      state isLoggedIn = true
      state hasPermission = false
      
      if isLoggedIn && hasPermission {
        text "Access granted"
      } else {
        text "Access denied"
      }
    }`;
    const output = compile(code);

    expect(output.html).toContain('state.isLoggedIn');
    expect(output.html).toContain('state.hasPermission');
    expect(output.html).toContain('&&');
  });

  it('should support NOT operator with boolean', () => {
    const code = `component App {
      state isHidden = false
      
      if !isHidden {
        text "Visible"
      }
    }`;
    const output = compile(code);

    expect(output.html).toContain('!');
    expect(output.html).toContain('state.isHidden');
  });

  it('should support multiple boolean and null states', () => {
    const code = `component App {
      state isLoading = false
      state error = null
      state success = true
      state data = null
      
      text "Status"
    }`;
    const output = compile(code);

    expect(output.js).toContain('isLoading: false');
    expect(output.js).toContain('error: null');
    expect(output.js).toContain('success: true');
    expect(output.js).toContain('data: null');
  });
});
