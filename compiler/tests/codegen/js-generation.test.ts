import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('CodeGenerator - JavaScript Generation', () => {
  it('should generate JS with state initialization', () => {
    const code = `component Counter {
      state count = 0
    }`;
    const output = compile(code);

    expect(output.js).toContain('Frobo');
    expect(output.js).toContain('createState');
    expect(output.js).toContain('count: 0');
  });

  it('should generate JS with computed properties', () => {
    const code = `component Counter {
      state count = 0
      computed doubled = count * 2
    }`;
    const output = compile(code);

    expect(output.js).toContain('Object.defineProperty');
    expect(output.js).toContain('doubled');
    expect(output.js).toContain('state.count * 2');
  });

  it('should generate JS for functions', () => {
    const code = `function increment() {
      count = count + 1
    }
    
    component Counter {
      state count = 0
    }`;
    const output = compile(code);

    expect(output.js).toContain('function increment()');
    expect(output.js).toContain('state.count');
  });

  it('should generate JS with Frobo runtime', () => {
    const code = `component App {
      state value = "test"
    }`;
    const output = compile(code);

    expect(output.js).toContain('const Frobo = {');
    expect(output.js).toContain('createState');
    expect(output.js).toContain('updateDOM');
  });

  it('should generate JS with DOMContentLoaded listener', () => {
    const code = `component App {
      state count = 0
    }`;
    const output = compile(code);

    expect(output.js).toContain('DOMContentLoaded');
  });

  it('should generate JS for if-else-if-else conditionals', () => {
    const code = `component App {
      state score = 85
      
      if score > 90 {
        text "Grade: A"
      } else if score > 80 {
        text "Grade: B"
      } else if score > 70 {
        text "Grade: C"
      } else {
        text "Grade: F"
      }
    }`;
    const output = compile(code);

    // Should have setupConditionals function
    expect(output.js).toContain('setupConditionals');
    
    // Should handle multiple else-if blocks
    expect(output.js).toContain('elseIfBlocks');
    
    // Should evaluate conditions in order
    expect(output.js).toContain('for (let j = 0; j < elseIfBlocks.length; j++)');
    
    // Should show else block if no conditions match
    expect(output.js).toContain('If no conditions matched, show else block');
  });

  it('should generate JS for if-else-if without else', () => {
    const code = `component App {
      state value = 5
      
      if value > 10 {
        text "Large"
      } else if value > 5 {
        text "Medium"
      }
    }`;
    const output = compile(code);

    // Should have setupConditionals function
    expect(output.js).toContain('setupConditionals');
    
    // Should handle else-if blocks
    expect(output.js).toContain('elseIfBlocks');
  });
});
