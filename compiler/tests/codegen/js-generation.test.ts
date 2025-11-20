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
});
