import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../../src/lexer';

describe('Lexer - Basic Tokenization', () => {
  it('should tokenize keywords', () => {
    const code = 'component state function';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.KEYWORD);
    expect(tokens[0].value).toBe('component');
    expect(tokens[1].type).toBe(TokenType.KEYWORD);
    expect(tokens[1].value).toBe('state');
    expect(tokens[2].type).toBe(TokenType.KEYWORD);
    expect(tokens[2].value).toBe('function');
  });

  it('should tokenize identifiers', () => {
    const code = 'myVar count userName';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('myVar');
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[1].value).toBe('count');
    expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].value).toBe('userName');
  });

  it('should tokenize strings', () => {
    const code = '"hello" "world"';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('hello');
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].value).toBe('world');
  });

  it('should tokenize numbers', () => {
    const code = '42 3.14 0';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].value).toBe('42');
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].value).toBe('3.14');
    expect(tokens[2].type).toBe(TokenType.NUMBER);
    expect(tokens[2].value).toBe('0');
  });

  it('should tokenize operators', () => {
    const code = '+ - * / = == != < > <= >=';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.PLUS);
    expect(tokens[1].type).toBe(TokenType.MINUS);
    expect(tokens[2].type).toBe(TokenType.MULTIPLY);
    expect(tokens[3].type).toBe(TokenType.DIVIDE);
    expect(tokens[4].type).toBe(TokenType.EQUALS);
    expect(tokens[5].type).toBe(TokenType.EQUAL_EQUAL);
    expect(tokens[6].type).toBe(TokenType.NOT_EQUAL);
    expect(tokens[7].type).toBe(TokenType.LESS_THAN);
    expect(tokens[8].type).toBe(TokenType.GREATER_THAN);
    expect(tokens[9].type).toBe(TokenType.LESS_EQUAL);
    expect(tokens[10].type).toBe(TokenType.GREATER_EQUAL);
  });

  it('should tokenize delimiters', () => {
    const code = '{ } [ ] ( ) , : .';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.BRACE_OPEN);
    expect(tokens[1].type).toBe(TokenType.BRACE_CLOSE);
    expect(tokens[2].type).toBe(TokenType.BRACKET_OPEN);
    expect(tokens[3].type).toBe(TokenType.BRACKET_CLOSE);
    expect(tokens[4].type).toBe(TokenType.PAREN_OPEN);
    expect(tokens[5].type).toBe(TokenType.PAREN_CLOSE);
    expect(tokens[6].type).toBe(TokenType.COMMA);
    expect(tokens[7].type).toBe(TokenType.COLON);
    expect(tokens[8].type).toBe(TokenType.DOT);
  });

  it('should track line and column numbers', () => {
    const code = 'component\nstate count = 0';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].line).toBe(1);
    expect(tokens[0].column).toBe(1);
    expect(tokens[1].line).toBe(1);
    expect(tokens[2].line).toBe(2);
    expect(tokens[2].column).toBe(1);
  });

  it('should handle empty input', () => {
    const code = '';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.EOF);
  });

  it('should collect error on unterminated string', () => {
    const code = '"hello';
    const lexer = new Lexer(code);
    lexer.tokenize();
    const errors = lexer.getErrors();

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Unterminated string');
  });

  it('should collect error on unexpected character', () => {
    const code = 'test @ value';
    const lexer = new Lexer(code);
    lexer.tokenize();
    const errors = lexer.getErrors();

    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain('Unexpected character');
  });

  it('should tokenize boolean literals', () => {
    const code = 'true false';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.BOOLEAN);
    expect(tokens[0].value).toBe('true');
    expect(tokens[1].type).toBe(TokenType.BOOLEAN);
    expect(tokens[1].value).toBe('false');
  });

  it('should tokenize null literal', () => {
    const code = 'null';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.NULL);
    expect(tokens[0].value).toBe('null');
  });

  it('should tokenize logical operators', () => {
    const code = '&& || !';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.AND);
    expect(tokens[0].value).toBe('&&');
    expect(tokens[1].type).toBe(TokenType.OR);
    expect(tokens[1].value).toBe('||');
    expect(tokens[2].type).toBe(TokenType.NOT);
    expect(tokens[2].value).toBe('!');
  });

  it('should tokenize else if as single token', () => {
    const code = 'else if';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.ELSE_IF);
    expect(tokens[0].value).toBe('else if');
  });

  it('should tokenize return keyword', () => {
    const code = 'return 42';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.RETURN);
    expect(tokens[0].value).toBe('return');
  });

  it('should tokenize async and await keywords', () => {
    const code = 'async await';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.ASYNC);
    expect(tokens[0].value).toBe('async');
    expect(tokens[1].type).toBe(TokenType.AWAIT);
    expect(tokens[1].value).toBe('await');
  });

  it('should tokenize import, export, from keywords', () => {
    const code = 'import export from';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.IMPORT);
    expect(tokens[0].value).toBe('import');
    expect(tokens[1].type).toBe(TokenType.EXPORT);
    expect(tokens[1].value).toBe('export');
    expect(tokens[2].type).toBe(TokenType.FROM);
    expect(tokens[2].value).toBe('from');
  });

  it('should include token length in all tokens', () => {
    const code = 'component "hello" 42';
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    expect(tokens[0].length).toBe(9); // 'component'
    expect(tokens[1].length).toBe(7); // '"hello"'
    expect(tokens[2].length).toBe(2); // '42'
  });

  it('should collect multiple errors', () => {
    const code = 'test @ value # another';
    const lexer = new Lexer(code);
    lexer.tokenize();
    const errors = lexer.getErrors();

    expect(errors.length).toBe(2);
    expect(errors[0].message).toContain('Unexpected character');
    expect(errors[1].message).toContain('Unexpected character');
  });
});
