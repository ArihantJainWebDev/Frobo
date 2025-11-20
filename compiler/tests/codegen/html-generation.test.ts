import { describe, it, expect } from 'vitest';
import { compile } from '../../src/index';

describe('CodeGenerator - HTML Generation', () => {
  it('should generate HTML for simple component', () => {
    const code = `component App {
      text "Hello World"
    }`;
    const output = compile(code);

    expect(output.html).toContain('<p');
    expect(output.html).toContain('Hello World');
  });

  it('should generate HTML for button', () => {
    const code = `component App {
      button "Click me"
    }`;
    const output = compile(code);

    expect(output.html).toContain('<button');
    expect(output.html).toContain('Click me');
  });

  it('should generate HTML for input', () => {
    const code = `component App {
      input "Enter text"
    }`;
    const output = compile(code);

    expect(output.html).toContain('<input');
    expect(output.html).toContain('placeholder="Enter text"');
  });

  it('should generate HTML for nested elements', () => {
    const code = `component App {
      container {
        text "Nested"
      }
    }`;
    const output = compile(code);

    expect(output.html).toContain('<div');
    expect(output.html).toContain('<p');
    expect(output.html).toContain('Nested');
  });

  it('should generate HTML with inline styles', () => {
    const code = `component App {
      text "Styled" bg="blue" color="white"
    }`;
    const output = compile(code);

    expect(output.html).toContain('style=');
    expect(output.html).toContain('background');
    expect(output.html).toContain('color');
  });

  it('should escape HTML in text content', () => {
    const code = `component App {
      text "<script>alert('xss')</script>"
    }`;
    const output = compile(code);

    expect(output.html).toContain('&lt;script&gt;');
    expect(output.html).not.toContain('<script>');
  });
});
