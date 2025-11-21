export enum TokenType {
  KEYWORD,
  IDENTIFIER,
  STRING,
  NUMBER,
  BOOLEAN,
  NULL,
  EQUALS,
  PLUS,
  MINUS,
  MULTIPLY,
  DIVIDE,
  GREATER_THAN,
  LESS_THAN,
  GREATER_EQUAL,
  LESS_EQUAL,
  EQUAL_EQUAL,
  NOT_EQUAL,
  NOT,
  AND,
  OR,
  BRACE_OPEN,
  BRACE_CLOSE,
  BRACKET_OPEN,
  BRACKET_CLOSE,
  PAREN_OPEN,
  PAREN_CLOSE,
  COMMA,
  COLON,
  DOT,
  NEWLINE,
  EOF,
  ELSE_IF,
  RETURN,
  ASYNC,
  AWAIT,
  IMPORT,
  EXPORT,
  FROM,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  length: number;
}

export interface LexerError {
  message: string;
  line: number;
  column: number;
  length: number;
}

export class Lexer {
  private code: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private errors: LexerError[] = [];

  constructor(code: string) {
    this.code = code;
  }

  getErrors(): LexerError[] {
    return this.errors;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    this.errors = [];

    while (this.position < this.code.length) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
      length: 0,
    });

    return tokens;
  }

  private nextToken(): Token | null {
    while (this.current() === ' ' || this.current() == '\t') {
      this.advance();
    }

    const char = this.current();

    if (char === undefined) {
      return null;
    }

    if (char === '\n') {
      return this.makeToken(TokenType.NEWLINE, '\n');
    }

    if (char === '"') {
      return this.readString();
    }

    if (this.isDigit(char)) {
      return this.readNumber();
    }

    if (this.isAlpha(char)) {
      return this.readIdentifierOrKeyword();
    }

    switch (char) {
      case '{':
        return this.makeToken(TokenType.BRACE_OPEN, '{');
      case '}':
        return this.makeToken(TokenType.BRACE_CLOSE, '}');
      case '[':
        return this.makeToken(TokenType.BRACKET_OPEN, '[');
      case ']':
        return this.makeToken(TokenType.BRACKET_CLOSE, ']');
      case '(':
        return this.makeToken(TokenType.PAREN_OPEN, '(');
      case ')':
        return this.makeToken(TokenType.PAREN_CLOSE, ')');
      case ',':
        return this.makeToken(TokenType.COMMA, ',');
      case ':':
        return this.makeToken(TokenType.COLON, ':');
      case '+':
        return this.makeToken(TokenType.PLUS, '+');
      case '-':
        return this.makeToken(TokenType.MINUS, '-');
      case '*':
        return this.makeToken(TokenType.MULTIPLY, '*');
      case '/':
        return this.makeToken(TokenType.DIVIDE, '/');
      case '.':
        return this.makeToken(TokenType.DOT, '.');
      case '=':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.EQUAL_EQUAL, '==');
        }
        return this.makeToken(TokenType.EQUALS, '=');
      case '>':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.GREATER_EQUAL, '>=');
        }
        return this.makeToken(TokenType.GREATER_THAN, '>');
      case '<':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.LESS_EQUAL, '<=');
        }
        return this.makeToken(TokenType.LESS_THAN, '<');
      case '!':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.NOT_EQUAL, '!=');
        }
        return this.makeToken(TokenType.NOT, '!');
      case '&':
        if (this.peek() === '&') {
          this.advance();
          return this.makeToken(TokenType.AND, '&&');
        }
        break;
      case '|':
        if (this.peek() === '|') {
          this.advance();
          return this.makeToken(TokenType.OR, '||');
        }
        break;
    }

    // Collect error instead of throwing
    this.errors.push({
      message: `Unexpected character '${char}'`,
      line: this.line,
      column: this.column,
      length: 1,
    });
    this.advance();
    return null;
  }

  private current(): string {
    return this.code[this.position];
  }

  private advance(): void {
    if (this.current() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }

    this.position++;
  }

  private peek(): string {
    return this.code[this.position + 1];
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private makeToken(type: TokenType, value: string): Token {
    const token = {
      type,
      value,
      line: this.line,
      column: this.column,
      length: value.length,
    };
    this.advance();
    return token;
  }

  private readString(): Token {
    const startLine = this.line;
    const startColumn = this.column;

    this.advance();

    let value = '';

    while (this.current() !== '"' && this.current() !== undefined) {
      value += this.current();
      this.advance();
    }

    if (this.current() === undefined) {
      this.errors.push({
        message: 'Unterminated string',
        line: startLine,
        column: startColumn,
        length: value.length + 1,
      });
    } else {
      this.advance();
    }

    return {
      type: TokenType.STRING,
      value,
      line: startLine,
      column: startColumn,
      length: value.length + 2,
    };
  }

  private readNumber(): Token {
    const startLine = this.line;
    const startColumn = this.column;

    let value = '';

    while (this.isDigit(this.current())) {
      value += this.current();
      this.advance();
    }

    if (this.current() === '.' && this.isDigit(this.peek())) {
      value += '.';
      this.advance();

      while (this.isDigit(this.current())) {
        value += this.current();
        this.advance();
      }
    }

    return {
      type: TokenType.NUMBER,
      value,
      line: startLine,
      column: startColumn,
      length: value.length,
    };
  }

  private readIdentifierOrKeyword(): Token {
    const startLine = this.line;
    const startColumn = this.column;

    let value = '';

    while (this.current() && (this.isAlpha(this.current()) || this.isDigit(this.current()))) {
      value += this.current();
      this.advance();
    }

    // Check for boolean literals
    if (value === 'true' || value === 'false') {
      return {
        type: TokenType.BOOLEAN,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    // Check for null literal
    if (value === 'null') {
      return {
        type: TokenType.NULL,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    // Check for specific keyword tokens
    if (value === 'return') {
      return {
        type: TokenType.RETURN,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    if (value === 'async') {
      return {
        type: TokenType.ASYNC,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    if (value === 'await') {
      return {
        type: TokenType.AWAIT,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    if (value === 'import') {
      return {
        type: TokenType.IMPORT,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    if (value === 'export') {
      return {
        type: TokenType.EXPORT,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    if (value === 'from') {
      return {
        type: TokenType.FROM,
        value,
        line: startLine,
        column: startColumn,
        length: value.length,
      };
    }

    // Check for else if (handle as special case)
    if (value === 'else') {
      // Look ahead to see if next token is 'if'
      const savedPos = this.position;
      const savedLine = this.line;
      const savedCol = this.column;

      // Skip whitespace
      while (this.current() === ' ' || this.current() === '\t') {
        this.advance();
      }

      // Check if next word is 'if'
      const nextChar = this.code[this.position + 2];
      if (
        this.current() === 'i' &&
        this.peek() === 'f' &&
        (nextChar === undefined || (!this.isAlpha(nextChar) && !this.isDigit(nextChar)))
      ) {
        this.advance(); // skip 'i'
        this.advance(); // skip 'f'
        return {
          type: TokenType.ELSE_IF,
          value: 'else if',
          line: startLine,
          column: startColumn,
          length: this.column - startColumn,
        };
      } else {
        // Restore position if not 'else if'
        this.position = savedPos;
        this.line = savedLine;
        this.column = savedCol;
      }
    }

    const keywords = [
      'component',
      'state',
      'computed',
      'function',
      'if',
      'else',
      'for',
      'in',
      'props',
      'onMount',
      'onUpdate',
      'fetch',
      'watch',
    ];
    const type = keywords.includes(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;

    return {
      type,
      value,
      line: startLine,
      column: startColumn,
      length: value.length,
    };
  }
}
