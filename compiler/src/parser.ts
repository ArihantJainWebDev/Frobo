import { Token, TokenType } from './lexer.js';

export enum NodeType {
  PROGRAM,
  COMPONENT,
  COMPONENT_INSTANCE,
  ELEMENT,
  FUNCTION,
  STATE_DECLARATION,
  COMPUTED_DECLARATION,
  LIFECYCLE_HOOK,
  FETCH_DECLARATION,
  WATCHER,
  PROPS_DECLARATION,
  IF_STATEMENT,
  ELSE_IF_STATEMENT,
  FOR_LOOP,
  CONDITION,
  IDENTIFIER,
  STRING_LITERAL,
  NUMBER_LITERAL,
  BOOLEAN_LITERAL,
  NULL_LITERAL,
  LOGICAL_EXPRESSION,
  MEMBER_EXPRESSION,
  FUNCTION_PARAMETER,
  RETURN_STATEMENT,
  ASYNC_FUNCTION,
  AWAIT_EXPRESSION,
  IMPORT_DECLARATION,
  EXPORT_DECLARATION,
}

export interface SourceLocation {
  start: { line: number; column: number };
  end: { line: number; column: number };
  filename?: string;
}

export interface ASTNode {
  type: NodeType;
  value?: unknown;
  name?: string;
  children?: ASTNode[];
  attributes?: Record<string, unknown>;
  styles?: Record<string, string>;
  condition?: ASTNode;
  consequent?: ASTNode[];
  alternate?: ASTNode[];
  elseIfBranches?: Array<{ condition: ASTNode; consequent: ASTNode[] }>;
  itemName?: string;
  arrayName?: string;
  body?: ASTNode[];
  location?: SourceLocation;
  operator?: string;
  left?: ASTNode;
  right?: ASTNode;
  object?: ASTNode;
  property?: string;
  parameters?: ASTNode[];
  returnType?: string;
  isAsync?: boolean;
  argument?: ASTNode;
  source?: string;
  specifiers?: Array<{ imported: string; local: string }>;
  declaration?: ASTNode;
}

export interface ParserError {
  message: string;
  location: SourceLocation;
  suggestion?: string;
}

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private errors: ParserError[] = [];
  private filename?: string;

  constructor(tokens: Token[], filename?: string) {
    this.tokens = tokens;
    this.filename = filename;
  }

  parse(): ASTNode {
    return this.parseProgram();
  }

  getErrors(): ParserError[] {
    return this.errors;
  }

  private getLocation(startToken: Token, endToken?: Token): SourceLocation {
    const end = endToken || startToken;
    return {
      start: { line: startToken.line, column: startToken.column },
      end: { line: end.line, column: end.column + end.length },
      filename: this.filename,
    };
  }

  private addError(message: string, token: Token, suggestion?: string): void {
    this.errors.push({
      message,
      location: this.getLocation(token),
      suggestion,
    });
  }

  private parseProgram(): ASTNode {
    const startToken = this.current();
    const children: ASTNode[] = [];

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    while (this.current().type !== TokenType.EOF) {
      try {
        if (this.current().type === TokenType.IMPORT) {
          children.push(this.parseImportDeclaration());
        } else if (this.current().type === TokenType.EXPORT) {
          children.push(this.parseExportDeclaration());
        } else if (this.current().type === TokenType.KEYWORD) {
          if (this.current().value === 'component') {
            children.push(this.parseComponent());
          } else if (this.current().value === 'function') {
            children.push(this.parseFunction());
          }
        } else if (this.current().type === TokenType.ASYNC) {
          children.push(this.parseAsyncFunction());
        }
      } catch (error) {
        // Collect error and try to recover
        if (error instanceof Error) {
          this.addError(error.message, this.current());
        }
        // Skip to next statement
        while (this.current().type !== TokenType.NEWLINE && this.current().type !== TokenType.EOF) {
          this.advance();
        }
      }

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    return {
      type: NodeType.PROGRAM,
      children,
      location: this.getLocation(startToken, this.tokens[this.position - 1]),
    };
  }

  private parseFunction(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.KEYWORD);

    const nameToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.PAREN_OPEN);

    // Parse parameters
    const parameters: ASTNode[] = [];
    while (this.current().type !== TokenType.PAREN_CLOSE) {
      if (this.current().type === TokenType.IDENTIFIER) {
        const paramToken = this.current();
        parameters.push({
          type: NodeType.FUNCTION_PARAMETER,
          name: paramToken.value,
          location: this.getLocation(paramToken),
        });
        this.advance();

        if (this.current().type === TokenType.COMMA) {
          this.advance();
        }
      } else {
        break;
      }
    }

    this.expect(TokenType.PAREN_CLOSE);

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    const body: string[] = [];
    let braceDepth = 0;

    while (this.current().type !== TokenType.BRACE_CLOSE || braceDepth > 0) {
      if (this.current().type === TokenType.BRACE_OPEN) {
        braceDepth++;
        body.push(this.current().value);
        this.advance();
      } else if (this.current().type === TokenType.BRACE_CLOSE) {
        if (braceDepth > 0) {
          braceDepth--;
          body.push(this.current().value);
          this.advance();
        } else {
          break;
        }
      } else if (this.current().type === TokenType.NEWLINE) {
        body.push(';\n');
        this.advance();
      } else {
        // Preserve quotes for string literals
        if (this.current().type === TokenType.STRING) {
          body.push(`"${this.current().value}"`);
        } else {
          body.push(this.current().value);
        }
        this.advance();

        // Add space after tokens for readability
        if (
          this.current().type !== TokenType.BRACE_CLOSE &&
          this.current().type !== TokenType.NEWLINE &&
          this.current().type !== TokenType.BRACE_OPEN
        ) {
          body.push(' ');
        }
      }
    }

    const endToken = this.current();
    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.FUNCTION,
      name: nameToken.value,
      value: body.join(''),
      parameters,
      location: this.getLocation(startToken, endToken),
    };
  }

  private parseComponent(): ASTNode {
    this.expect(TokenType.KEYWORD);

    const nameToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    const children: ASTNode[] = [];
    while (this.current().type !== TokenType.BRACE_CLOSE) {
      if (this.current().type === TokenType.KEYWORD && this.current().value === 'props') {
        children.push(this.parseProps());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'state') {
        children.push(this.parseState());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'computed') {
        children.push(this.parseComputed());
      } else if (
        this.current().type === TokenType.KEYWORD &&
        (this.current().value === 'onMount' || this.current().value === 'onUpdate')
      ) {
        children.push(this.parseLifecycleHook());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'fetch') {
        children.push(this.parseFetch());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'watch') {
        children.push(this.parseWatch());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'if') {
        children.push(this.parseIfStatement());
      } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'for') {
        children.push(this.parseForLoop());
      } else {
        children.push(this.parseElement());
      }

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.COMPONENT,
      name: nameToken.value,
      children,
    };
  }

  private parseProps(): ASTNode {
    this.expect(TokenType.KEYWORD); // 'props'

    const propNames: string[] = [];

    // Parse first prop name
    propNames.push(this.expect(TokenType.IDENTIFIER).value);

    // Parse additional prop names separated by commas
    while (this.current().type === TokenType.COMMA) {
      this.advance(); // consume comma
      propNames.push(this.expect(TokenType.IDENTIFIER).value);
    }

    return {
      type: NodeType.PROPS_DECLARATION,
      value: propNames,
    };
  }

  private parseComputed(): ASTNode {
    this.expect(TokenType.KEYWORD); // 'computed'

    const nameToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.EQUALS);

    // Parse the expression (everything until newline)
    let expression = '';
    while (this.current().type !== TokenType.NEWLINE && this.current().type !== TokenType.EOF) {
      // Preserve quotes for string literals
      if (this.current().type === TokenType.STRING) {
        expression += `"${this.current().value}" `;
      } else {
        expression += this.current().value + ' ';
      }
      this.advance();
    }

    return {
      type: NodeType.COMPUTED_DECLARATION,
      name: nameToken.value,
      value: expression.trim(),
    };
  }

  private parseLifecycleHook(): ASTNode {
    const hookName = this.current().value; // 'onMount' or 'onUpdate'
    this.advance();

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    const body: string[] = [];

    while (this.current().type !== TokenType.BRACE_CLOSE) {
      if (this.current().type === TokenType.NEWLINE) {
        body.push(';\n');
        this.advance();
      } else {
        if (this.current().type === TokenType.STRING) {
          body.push(`"${this.current().value}"`);
        } else {
          body.push(this.current().value);
        }
        this.advance();
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.LIFECYCLE_HOOK,
      name: hookName,
      value: body.join(' '),
    };
  }

  private parseFetch(): ASTNode {
    this.expect(TokenType.KEYWORD); // 'fetch'

    const attributes: Record<string, unknown> = {};

    // Parse attributes: url, into, loading, error
    while (this.current().type === TokenType.IDENTIFIER && this.peek().type === TokenType.EQUALS) {
      const attrName = this.current().value;
      this.advance(); // consume attribute name
      this.advance(); // consume '='

      if (this.current().type === TokenType.STRING) {
        attributes[attrName] = this.current().value;
        this.advance();
      } else if (this.current().type === TokenType.IDENTIFIER) {
        attributes[attrName] = this.current().value;
        this.advance();
      }
    }

    return {
      type: NodeType.FETCH_DECLARATION,
      attributes,
    };
  }

  private parseWatch(): ASTNode {
    this.expect(TokenType.KEYWORD); // 'watch'

    const watchVar = this.expect(TokenType.IDENTIFIER).value;

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    const body: string[] = [];

    while (this.current().type !== TokenType.BRACE_CLOSE) {
      if (this.current().type === TokenType.NEWLINE) {
        body.push(';\n');
        this.advance();
      } else {
        if (this.current().type === TokenType.STRING) {
          body.push(`"${this.current().value}"`);
        } else {
          body.push(this.current().value);
        }
        this.advance();
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.WATCHER,
      name: watchVar,
      value: body.join(' '),
    };
  }

  private parseClassBinding(): Record<string, string> {
    this.expect(TokenType.BRACE_OPEN);

    const classes: Record<string, string> = {};

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    while (this.current().type !== TokenType.BRACE_CLOSE) {
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.BRACE_CLOSE) {
        break;
      }

      const className = this.expect(TokenType.IDENTIFIER).value;
      this.expect(TokenType.COLON);
      const condition = this.expect(TokenType.IDENTIFIER).value;

      classes[className] = condition;

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.COMMA) {
        this.advance();
        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return classes;
  }

  private parseState(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.KEYWORD);

    const nameToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.EQUALS);

    // Skip any whitespace/newlines after equals
    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    let value: unknown;
    if (this.current().type === TokenType.NUMBER) {
      value = parseFloat(this.current().value);
      this.advance();
    } else if (this.current().type === TokenType.STRING) {
      value = this.current().value;
      this.advance();
    } else if (this.current().type === TokenType.BOOLEAN) {
      // Parse boolean using new BOOLEAN token type
      value = this.current().value === 'true';
      this.advance();
    } else if (this.current().type === TokenType.NULL) {
      // Parse null using new NULL token type
      value = null;
      this.advance();
    } else if (
      this.current().type === TokenType.IDENTIFIER &&
      (this.current().value === 'true' || this.current().value === 'false')
    ) {
      // Fallback for boolean as identifier (backward compatibility)
      value = this.current().value === 'true';
      this.advance();
    } else if (this.current().type === TokenType.IDENTIFIER && this.current().value === 'null') {
      // Fallback for null as identifier (backward compatibility)
      value = null;
      this.advance();
    } else if (this.current().type === TokenType.BRACKET_OPEN) {
      // Parse array literal
      value = this.parseArrayLiteral();
    } else if (this.current().type === TokenType.BRACE_OPEN) {
      // Parse object literal
      value = this.parseObjectLiteral();
    } else {
      throw new Error(
        `Expected number, string, boolean, null, array, or object for state value at line ${this.current().line}. Got: ${TokenType[this.current().type]} with value: "${this.current().value}"`
      );
    }

    return {
      type: NodeType.STATE_DECLARATION,
      name: nameToken.value,
      value: value,
      location: this.getLocation(startToken, this.tokens[this.position - 1]),
    };
  }

  private parseElement(): ASTNode {
    const nameToken = this.expect(TokenType.IDENTIFIER);
    const elementName = nameToken.value;

    // Check if it's a component instance (starts with uppercase)
    const isComponentInstance = /^[A-Z]/.test(elementName);

    let value = '';
    const attributes: Record<string, unknown> = {};
    let styles: Record<string, string> = {};

    if (this.current().type === TokenType.STRING) {
      const valueToken = this.expect(TokenType.STRING);
      value = valueToken.value;
    }

    while (this.current().type === TokenType.IDENTIFIER) {
      const attrName = this.current().value;

      // Check if it's a style attribute
      if (attrName === 'style' && this.peek().type === TokenType.EQUALS) {
        this.advance(); // consume 'style'
        this.advance(); // consume '='

        // Expect opening brace
        this.expect(TokenType.BRACE_OPEN);

        // Parse style properties
        styles = this.parseStyleBlock();

        // Expect closing brace
        this.expect(TokenType.BRACE_CLOSE);
      }
      // Check for shorthand style attributes
      else if (
        [
          'bg',
          'color',
          'padding',
          'rounded',
          'margin',
          'width',
          'height',
          'gap',
          'shadow',
        ].includes(attrName) &&
        this.peek().type === TokenType.EQUALS
      ) {
        this.advance(); // consume attribute name
        this.advance(); // consume '='

        if (this.current().type === TokenType.STRING) {
          const styleValue = this.current().value;
          this.advance();

          // Convert shorthand to full CSS property
          const cssProperty = this.shorthandToCss(attrName);
          styles[cssProperty] = styleValue;
        } else if (this.current().type === TokenType.NUMBER) {
          const styleValue = this.current().value;
          this.advance();

          const cssProperty = this.shorthandToCss(attrName);
          styles[cssProperty] = styleValue;
        }
      }
      // Regular attributes (onClick, props, class, etc.)
      else if (this.peek().type === TokenType.EQUALS) {
        this.advance(); // consume attribute name
        this.advance(); // consume '='

        if (this.current().type === TokenType.IDENTIFIER) {
          const attrValue = this.current().value;
          this.advance();
          attributes[attrName] = attrValue;
        } else if (this.current().type === TokenType.STRING) {
          const attrValue = this.current().value;
          this.advance();
          attributes[attrName] = attrValue;
        } else if (this.current().type === TokenType.NUMBER) {
          const attrValue = this.current().value;
          this.advance();
          attributes[attrName] = attrValue;
        } else if (this.current().type === TokenType.BRACE_OPEN && attrName === 'class') {
          // Dynamic class binding: class={ active: isActive }
          attributes[attrName] = this.parseClassBinding();
        }
      } else {
        break;
      }
    }

    // Check for nested children (opening brace after attributes)
    let children: ASTNode[] | undefined;
    if (this.current().type === TokenType.BRACE_OPEN) {
      this.advance(); // consume '{'

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      children = [];
      while (this.current().type !== TokenType.BRACE_CLOSE) {
        if (this.current().type === TokenType.KEYWORD && this.current().value === 'if') {
          children.push(this.parseIfStatement());
        } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'for') {
          children.push(this.parseForLoop());
        } else {
          children.push(this.parseElement());
        }

        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }

      this.expect(TokenType.BRACE_CLOSE);
    }

    return {
      type: isComponentInstance ? NodeType.COMPONENT_INSTANCE : NodeType.ELEMENT,
      name: elementName,
      value: value,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      styles: Object.keys(styles).length > 0 ? styles : undefined,
      children: children,
    } as ASTNode;
  }

  private parseStyleBlock(): Record<string, string> {
    const styles: Record<string, string> = {};

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    while (this.current().type !== TokenType.BRACE_CLOSE) {
      // Skip newlines
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.BRACE_CLOSE) {
        break;
      }

      // Parse property name
      const propName = this.expect(TokenType.IDENTIFIER).value;

      // Expect colon
      this.expect(TokenType.COLON);

      // Parse property value (can be string or number)
      let propValue: string;
      if (this.current().type === TokenType.STRING) {
        propValue = this.current().value;
        this.advance();
      } else if (this.current().type === TokenType.NUMBER) {
        propValue = this.current().value;
        this.advance();
      } else {
        throw new Error(`Expected string or number for style value at line ${this.current().line}`);
      }

      styles[propName] = propValue;

      // Skip optional comma
      if (this.current().type === TokenType.COMMA) {
        this.advance();
      }

      // Skip newlines
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    return styles;
  }

  private shorthandToCss(shorthand: string): string {
    const map: Record<string, string> = {
      bg: 'background',
      color: 'color',
      padding: 'padding',
      rounded: 'border-radius',
      margin: 'margin',
      width: 'width',
      height: 'height',
      gap: 'gap',
      shadow: 'box-shadow',
    };
    return map[shorthand] || shorthand;
  }

  private current(): Token {
    return this.tokens[this.position];
  }

  private advance(): Token {
    const token = this.current();
    this.position++;
    return token;
  }

  private peek(): Token {
    return this.tokens[this.position + 1];
  }

  private parseIfStatement(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.KEYWORD); // 'if'

    // Parse condition
    const condition = this.parseCondition();

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    // Parse consequent (if body)
    const consequent: ASTNode[] = [];
    while (this.current().type !== TokenType.BRACE_CLOSE) {
      consequent.push(this.parseElement());

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    // Check for else-if branches
    const elseIfBranches: Array<{ condition: ASTNode; consequent: ASTNode[] }> = [];
    while (this.current().type === TokenType.ELSE_IF) {
      this.advance(); // consume 'else if'

      const elseIfCondition = this.parseCondition();

      this.expect(TokenType.BRACE_OPEN);

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      const elseIfConsequent: ASTNode[] = [];
      while (this.current().type !== TokenType.BRACE_CLOSE) {
        elseIfConsequent.push(this.parseElement());

        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }

      this.expect(TokenType.BRACE_CLOSE);

      elseIfBranches.push({
        condition: elseIfCondition,
        consequent: elseIfConsequent,
      });

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    // Check for else
    let alternate: ASTNode[] | undefined;
    if (this.current().type === TokenType.KEYWORD && this.current().value === 'else') {
      this.advance(); // consume 'else'

      this.expect(TokenType.BRACE_OPEN);

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      alternate = [];
      while (this.current().type !== TokenType.BRACE_CLOSE) {
        alternate.push(this.parseElement());

        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }

      this.expect(TokenType.BRACE_CLOSE);
    }

    return {
      type: NodeType.IF_STATEMENT,
      condition,
      consequent,
      elseIfBranches: elseIfBranches.length > 0 ? elseIfBranches : undefined,
      alternate,
      location: this.getLocation(startToken, this.tokens[this.position - 1]),
    };
  }

  private parseCondition(): ASTNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ASTNode {
    let left = this.parseLogicalAnd();

    while (this.current().type === TokenType.OR) {
      const startToken = this.current();
      const operator = this.current().value;
      this.advance();
      const right = this.parseLogicalAnd();
      left = {
        type: NodeType.LOGICAL_EXPRESSION,
        operator,
        left,
        right,
        location: this.getLocation(startToken, this.tokens[this.position - 1]),
      };
    }

    return left;
  }

  private parseLogicalAnd(): ASTNode {
    let left = this.parseLogicalNot();

    while (this.current().type === TokenType.AND) {
      const startToken = this.current();
      const operator = this.current().value;
      this.advance();
      const right = this.parseLogicalNot();
      left = {
        type: NodeType.LOGICAL_EXPRESSION,
        operator,
        left,
        right,
        location: this.getLocation(startToken, this.tokens[this.position - 1]),
      };
    }

    return left;
  }

  private parseLogicalNot(): ASTNode {
    if (this.current().type === TokenType.NOT) {
      const startToken = this.current();
      const operator = this.current().value;
      this.advance();
      const argument = this.parseLogicalNot();
      return {
        type: NodeType.LOGICAL_EXPRESSION,
        operator,
        argument,
        location: this.getLocation(startToken, this.tokens[this.position - 1]),
      };
    }

    return this.parseComparison();
  }

  private parseComparison(): ASTNode {
    let left = this.parsePrimary();

    if (
      [
        TokenType.GREATER_THAN,
        TokenType.LESS_THAN,
        TokenType.GREATER_EQUAL,
        TokenType.LESS_EQUAL,
        TokenType.EQUAL_EQUAL,
        TokenType.NOT_EQUAL,
      ].includes(this.current().type)
    ) {
      const startToken = this.current();
      const operator = this.current().value;
      this.advance();
      const right = this.parsePrimary();
      return {
        type: NodeType.CONDITION,
        value: operator,
        children: [left, right],
        location: this.getLocation(startToken, this.tokens[this.position - 1]),
      };
    }

    return left;
  }

  private parsePrimary(): ASTNode {
    const startToken = this.current();

    if (this.current().type === TokenType.IDENTIFIER) {
      return this.parseMemberExpression();
    } else if (this.current().type === TokenType.NUMBER) {
      const value = parseFloat(this.current().value);
      this.advance();
      return {
        type: NodeType.NUMBER_LITERAL,
        value,
        location: this.getLocation(startToken),
      };
    } else if (this.current().type === TokenType.STRING) {
      const value = this.current().value;
      this.advance();
      return {
        type: NodeType.STRING_LITERAL,
        value,
        location: this.getLocation(startToken),
      };
    } else if (this.current().type === TokenType.BOOLEAN) {
      const value = this.current().value === 'true';
      this.advance();
      return {
        type: NodeType.BOOLEAN_LITERAL,
        value,
        location: this.getLocation(startToken),
      };
    } else if (this.current().type === TokenType.NULL) {
      this.advance();
      return {
        type: NodeType.NULL_LITERAL,
        value: null,
        location: this.getLocation(startToken),
      };
    } else if (this.current().type === TokenType.PAREN_OPEN) {
      this.advance(); // consume '('
      const expr = this.parseCondition();
      this.expect(TokenType.PAREN_CLOSE);
      return expr;
    } else {
      throw new Error(
        `Expected identifier, number, string, boolean, null, or '(' in condition at line ${this.current().line}`
      );
    }
  }

  private parseMemberExpression(): ASTNode {
    const startToken = this.current();
    let object: ASTNode = {
      type: NodeType.IDENTIFIER,
      value: this.current().value,
      location: this.getLocation(startToken),
    };
    this.advance();

    while (this.current().type === TokenType.DOT) {
      this.advance(); // consume '.'
      const propertyToken = this.expect(TokenType.IDENTIFIER);
      object = {
        type: NodeType.MEMBER_EXPRESSION,
        object,
        property: propertyToken.value,
        location: this.getLocation(startToken, propertyToken),
      };
    }

    return object;
  }

  private parseArrayLiteral(): unknown[] {
    this.expect(TokenType.BRACKET_OPEN);

    const items: unknown[] = [];

    // Skip any newlines after opening bracket
    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    while (this.current().type !== TokenType.BRACKET_CLOSE) {
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.BRACKET_CLOSE) {
        break;
      }

      if (this.current().type === TokenType.STRING) {
        items.push(this.current().value);
        this.advance();
      } else if (this.current().type === TokenType.NUMBER) {
        items.push(parseFloat(this.current().value));
        this.advance();
      } else {
        throw new Error(`Expected string or number in array at line ${this.current().line}`);
      }

      // Skip newlines after item
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      // Handle comma
      if (this.current().type === TokenType.COMMA) {
        this.advance();
        // Skip newlines after comma
        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }
    }

    this.expect(TokenType.BRACKET_CLOSE);

    return items;
  }

  private parseObjectLiteral(): Record<string, unknown> {
    this.expect(TokenType.BRACE_OPEN);

    const obj: Record<string, unknown> = {};

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    while (this.current().type !== TokenType.BRACE_CLOSE) {
      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.BRACE_CLOSE) {
        break;
      }

      const key = this.expect(TokenType.IDENTIFIER).value;
      this.expect(TokenType.COLON);

      let value: unknown;
      if (this.current().type === TokenType.STRING) {
        value = this.current().value;
        this.advance();
      } else if (this.current().type === TokenType.NUMBER) {
        value = parseFloat(this.current().value);
        this.advance();
      } else {
        throw new Error(`Expected string or number in object at line ${this.current().line}`);
      }

      obj[key] = value;

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }

      if (this.current().type === TokenType.COMMA) {
        this.advance();
        while (this.current().type === TokenType.NEWLINE) {
          this.advance();
        }
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return obj;
  }

  private parseForLoop(): ASTNode {
    this.expect(TokenType.KEYWORD); // 'for'

    // Parse item name
    const itemToken = this.expect(TokenType.IDENTIFIER);

    // Expect 'in'
    if (this.current().type !== TokenType.KEYWORD || this.current().value !== 'in') {
      throw new Error(`Expected 'in' keyword at line ${this.current().line}`);
    }
    this.advance();

    // Parse array name
    const arrayToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    // Parse loop body
    const body: ASTNode[] = [];
    while (this.current().type !== TokenType.BRACE_CLOSE) {
      body.push(this.parseElement());

      while (this.current().type === TokenType.NEWLINE) {
        this.advance();
      }
    }

    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.FOR_LOOP,
      itemName: itemToken.value,
      arrayName: arrayToken.value,
      body,
    };
  }

  private parseAsyncFunction(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.ASYNC);

    this.expect(TokenType.KEYWORD); // 'function'

    const nameToken = this.expect(TokenType.IDENTIFIER);

    this.expect(TokenType.PAREN_OPEN);

    // Parse parameters
    const parameters: ASTNode[] = [];
    while (this.current().type !== TokenType.PAREN_CLOSE) {
      if (this.current().type === TokenType.IDENTIFIER) {
        const paramToken = this.current();
        parameters.push({
          type: NodeType.FUNCTION_PARAMETER,
          name: paramToken.value,
          location: this.getLocation(paramToken),
        });
        this.advance();

        if (this.current().type === TokenType.COMMA) {
          this.advance();
        }
      } else {
        break;
      }
    }

    this.expect(TokenType.PAREN_CLOSE);

    this.expect(TokenType.BRACE_OPEN);

    while (this.current().type === TokenType.NEWLINE) {
      this.advance();
    }

    const body: string[] = [];
    let braceDepth = 0;

    while (this.current().type !== TokenType.BRACE_CLOSE || braceDepth > 0) {
      if (this.current().type === TokenType.BRACE_OPEN) {
        braceDepth++;
        body.push(this.current().value);
        this.advance();
      } else if (this.current().type === TokenType.BRACE_CLOSE) {
        if (braceDepth > 0) {
          braceDepth--;
          body.push(this.current().value);
          this.advance();
        } else {
          break;
        }
      } else if (this.current().type === TokenType.NEWLINE) {
        body.push(';\n');
        this.advance();
      } else {
        if (this.current().type === TokenType.STRING) {
          body.push(`"${this.current().value}"`);
        } else {
          body.push(this.current().value);
        }
        this.advance();

        if (
          this.current().type !== TokenType.BRACE_CLOSE &&
          this.current().type !== TokenType.NEWLINE &&
          this.current().type !== TokenType.BRACE_OPEN
        ) {
          body.push(' ');
        }
      }
    }

    const endToken = this.current();
    this.expect(TokenType.BRACE_CLOSE);

    return {
      type: NodeType.ASYNC_FUNCTION,
      name: nameToken.value,
      value: body.join(''),
      parameters,
      isAsync: true,
      location: this.getLocation(startToken, endToken),
    };
  }

  private parseImportDeclaration(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.IMPORT);

    const specifiers: Array<{ imported: string; local: string }> = [];

    // Check for default import or named imports
    if (this.current().type === TokenType.IDENTIFIER) {
      // Default import: import Component from "./file"
      const localName = this.current().value;
      this.advance();
      specifiers.push({ imported: 'default', local: localName });
    } else if (this.current().type === TokenType.BRACE_OPEN) {
      // Named imports: import { A, B } from "./file"
      this.advance(); // consume '{'

      while (this.current().type !== TokenType.BRACE_CLOSE) {
        const importedName = this.expect(TokenType.IDENTIFIER).value;
        let localName = importedName;

        // Check for 'as' alias
        if (this.current().type === TokenType.KEYWORD && this.current().value === 'as') {
          this.advance();
          localName = this.expect(TokenType.IDENTIFIER).value;
        }

        specifiers.push({ imported: importedName, local: localName });

        if (this.current().type === TokenType.COMMA) {
          this.advance();
        }
      }

      this.expect(TokenType.BRACE_CLOSE);
    }

    this.expect(TokenType.FROM);

    const source = this.expect(TokenType.STRING).value;

    return {
      type: NodeType.IMPORT_DECLARATION,
      specifiers,
      source,
      location: this.getLocation(startToken, this.tokens[this.position - 1]),
    };
  }

  private parseExportDeclaration(): ASTNode {
    const startToken = this.current();
    this.expect(TokenType.EXPORT);

    let declaration: ASTNode | undefined;

    if (this.current().type === TokenType.KEYWORD && this.current().value === 'component') {
      declaration = this.parseComponent();
    } else if (this.current().type === TokenType.KEYWORD && this.current().value === 'function') {
      declaration = this.parseFunction();
    } else if (this.current().type === TokenType.ASYNC) {
      declaration = this.parseAsyncFunction();
    }

    return {
      type: NodeType.EXPORT_DECLARATION,
      declaration,
      location: this.getLocation(startToken, this.tokens[this.position - 1]),
    };
  }

  private expect(type: TokenType): Token {
    const token = this.current();

    if (token.type !== type) {
      throw new Error(
        `Expected ${TokenType[type]} but got ${TokenType[token.type]} ` +
          `at line ${token.line}, column ${token.column}`
      );
    }

    return this.advance();
  }
}
