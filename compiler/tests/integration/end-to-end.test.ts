import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('Integration - End-to-End Compilation', () => {
  it('should compile a complete counter app', () => {
    const code = `function increment() {
      count = count + 1
    }
    
    function decrement() {
      count = count - 1
    }
    
    component Counter {
      state count = 0
      
      text "Count: {count}"
      button "+" onClick=increment
      button "-" onClick=decrement
    }`;

    const output = compile(code);

    expect(output.html).toBeTruthy();
    expect(output.css).toBeTruthy();
    expect(output.js).toBeTruthy();

    expect(output.html).toContain('Count: {count}');
    expect(output.html).toContain('<button');
    expect(output.js).toContain('function increment()');
    expect(output.js).toContain('function decrement()');
    expect(output.js).toContain('count: 0');
  });

  it('should compile a todo list app', () => {
    const code = `component TodoList {
      state todos = ["Buy milk", "Walk dog"]
      
      for todo in todos {
        text "{todo}"
      }
    }`;

    const output = compile(code);

    expect(output.html).toContain('data-loop="todos"');
    expect(output.html).toContain('template');
    expect(output.js).toContain('todos: ["Buy milk","Walk dog"]');
  });

  it('should compile conditional rendering', () => {
    const code = `component App {
      state isVisible = 0
      
      if isVisible > 0 {
        text "Visible"
      } else {
        text "Hidden"
      }
    }`;

    const output = compile(code);

    expect(output.html).toContain('data-condition');
    expect(output.html).toContain('Visible');
    expect(output.html).toContain('Hidden');
    expect(output.js).toContain('isVisible: 0');
  });

  it('should compile with styles', () => {
    const code = `component App {
      text "Styled Text" bg="blue" color="white" padding="20"
    }`;

    const output = compile(code);

    expect(output.html).toContain('style=');
    expect(output.html).toContain('background');
    expect(output.html).toContain('color');
    expect(output.html).toContain('padding');
  });

  it('should handle empty component', () => {
    const code = `component Empty {
    }`;

    const output = compile(code);

    expect(output.html).toBeTruthy();
    expect(output.css).toBeTruthy();
    expect(output.js).toBeTruthy();
  });
});
