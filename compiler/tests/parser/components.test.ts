import { describe, it, expect } from 'vitest';
import { Lexer } from '../../src/lexer';
import { Parser, NodeType } from '../../src/parser';

describe('Parser - Components', () => {
  it('should parse a simple component', () => {
    const code = `component Counter {
      text "Hello"
    }`;
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.type).toBe(NodeType.PROGRAM);
    expect(ast.children).toHaveLength(1);
    expect(ast.children![0].type).toBe(NodeType.COMPONENT);
    expect(ast.children![0].name).toBe('Counter');
  });

  it('should parse component with state', () => {
    const code = `component Counter {
      state count = 0
    }`;
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const component = ast.children![0];
    expect(component.children).toHaveLength(1);
    expect(component.children![0].type).toBe(NodeType.STATE_DECLARATION);
    expect(component.children![0].name).toBe('count');
    expect(component.children![0].value).toBe(0);
  });

  it('should parse component with computed property', () => {
    const code = `component Counter {
      state count = 0
      computed doubled = count * 2
    }`;
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const component = ast.children![0];
    const computed = component.children!.find((c) => c.type === NodeType.COMPUTED_DECLARATION);
    expect(computed).toBeDefined();
    expect(computed!.name).toBe('doubled');
    expect(computed!.value).toContain('count * 2');
  });

  it('should parse component with elements', () => {
    const code = `component App {
      text "Hello World"
      button "Click me"
    }`;
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const component = ast.children![0];
    expect(component.children).toHaveLength(2);
    expect(component.children![0].type).toBe(NodeType.ELEMENT);
    expect(component.children![0].name).toBe('text');
    expect(component.children![1].type).toBe(NodeType.ELEMENT);
    expect(component.children![1].name).toBe('button');
  });

  it('should parse nested elements', () => {
    const code = `component App {
      container {
        text "Nested"
      }
    }`;
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const component = ast.children![0];
    const container = component.children![0];
    expect(container.type).toBe(NodeType.ELEMENT);
    expect(container.name).toBe('container');
    expect(container.children).toHaveLength(1);
    expect(container.children![0].name).toBe('text');
  });
});
