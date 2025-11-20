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

  it('should generate HTML for if-else-if-else statement', () => {
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

    // Should have if block
    expect(output.html).toContain('-if');
    expect(output.html).toContain('data-condition');

    // Should have else-if blocks
    expect(output.html).toContain('-elseif-0');
    expect(output.html).toContain('-elseif-1');

    // Should have else block
    expect(output.html).toContain('-else');

    // Should contain all grade texts
    expect(output.html).toContain('Grade: A');
    expect(output.html).toContain('Grade: B');
    expect(output.html).toContain('Grade: C');
    expect(output.html).toContain('Grade: F');
  });

  it('should generate HTML for if-else-if without else', () => {
    const code = `component App {
      state value = 5
      
      if value > 10 {
        text "Large"
      } else if value > 5 {
        text "Medium"
      }
    }`;
    const output = compile(code);

    // Should have if block
    expect(output.html).toContain('-if');

    // Should have else-if block
    expect(output.html).toContain('-elseif-0');

    // Should NOT have else block (no -else div after the elseif)
    const elseIfIndex = output.html.indexOf('-elseif-0');
    const afterElseIf = output.html.substring(elseIfIndex);
    const nextDivClose = afterElseIf.indexOf('</div>');
    const textBetween = afterElseIf.substring(0, nextDivClose + 6);

    // The text between should not contain another div with -else
    expect(textBetween).not.toMatch(/-else"[^>]*>/);
  });
});
