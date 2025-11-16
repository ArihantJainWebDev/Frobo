import { Token, TokenType } from "./lexer";

export enum NodeType {
    PROGRAM,
    COMPONENT,
    COMPONENT_INSTANCE,
    ELEMENT,
    FUNCTION,
    STATE_DECLARATION,
    COMPUTED_DECLARATION,
    LIFECYCLE_HOOK,
    PROPS_DECLARATION,
    IF_STATEMENT,
    FOR_LOOP,
    CONDITION,
    IDENTIFIER,
    STRING_LITERAL,
    NUMBER_LITERAL
}

export interface ASTNode {
    type: NodeType;
    value?: any;
    name?: string;
    children?: ASTNode[];
    attributes?: Record<string, any>;
    styles?: Record<string, string>;
    condition?: ASTNode;
    consequent?: ASTNode[];
    alternate?: ASTNode[];
    itemName?: string;
    arrayName?: string;
    body?: ASTNode[];
}

export class Parser {
    private tokens: Token[];
    private position: number = 0;
    
    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): ASTNode {
        return this.parseProgram();
    }

    private parseProgram(): ASTNode {
        const children: ASTNode[] = [];

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        while(this.current().type !== TokenType.EOF) {
            if(this.current().type === TokenType.KEYWORD) {
                if(this.current().value === 'component') {
                    children.push(this.parseComponent());
                } else if(this.current().value === 'function') {
                    children.push(this.parseFunction());
                }
            }

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }

        return {
            type: NodeType.PROGRAM,
            children
        };
    }

    private parseFunction(): ASTNode {
        this.expect(TokenType.KEYWORD);

        const nameToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.PAREN_OPEN);

        this.expect(TokenType.PAREN_CLOSE);

        this.expect(TokenType.BRACE_OPEN);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        const body: string[] = [];

        while(this.current().type !== TokenType.BRACE_CLOSE) {
            if(this.current().type === TokenType.NEWLINE) {
                body.push(';\n');
                this.advance();
            } else {
                // Preserve quotes for string literals
                if(this.current().type === TokenType.STRING) {
                    body.push(`"${this.current().value}"`);
                } else {
                    body.push(this.current().value);
                }
                this.advance();
            }
        }

        this.expect(TokenType.BRACE_CLOSE);

        return {
            type: NodeType.FUNCTION,
            name: nameToken.value,
            value: body.join(' ')
        };
    }

    private parseComponent(): ASTNode { 
        this.expect(TokenType.KEYWORD);

        const nameToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.BRACE_OPEN);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        const children: ASTNode[] = [];
        while(this.current().type !== TokenType.BRACE_CLOSE) {
            if(this.current().type === TokenType.KEYWORD && this.current().value === 'props') {
                children.push(this.parseProps());
            } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'state') {
                children.push(this.parseState());
            } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'computed') {
                children.push(this.parseComputed());
            } else if(this.current().type === TokenType.KEYWORD && (this.current().value === 'onMount' || this.current().value === 'onUpdate')) {
                children.push(this.parseLifecycleHook());
            } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'if') {
                children.push(this.parseIfStatement());
            } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'for') {
                children.push(this.parseForLoop());
            } else {
                children.push(this.parseElement());
            }

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }

        this.expect(TokenType.BRACE_CLOSE);

        return {
            type: NodeType.COMPONENT,
            name: nameToken.value,
            children
        };
    }
    
    private parseProps(): ASTNode {
        this.expect(TokenType.KEYWORD); // 'props'
        
        const propNames: string[] = [];
        
        // Parse first prop name
        propNames.push(this.expect(TokenType.IDENTIFIER).value);
        
        // Parse additional prop names separated by commas
        while(this.current().type === TokenType.COMMA) {
            this.advance(); // consume comma
            propNames.push(this.expect(TokenType.IDENTIFIER).value);
        }
        
        return {
            type: NodeType.PROPS_DECLARATION,
            value: propNames
        };
    }

    private parseComputed(): ASTNode {
        this.expect(TokenType.KEYWORD); // 'computed'

        const nameToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.EQUALS);

        // Parse the expression (everything until newline)
        let expression = '';
        while(this.current().type !== TokenType.NEWLINE && this.current().type !== TokenType.EOF) {
            expression += this.current().value + ' ';
            this.advance();
        }

        return {
            type: NodeType.COMPUTED_DECLARATION,
            name: nameToken.value,
            value: expression.trim()
        };
    }
    
    private parseLifecycleHook(): ASTNode {
        const hookName = this.current().value; // 'onMount' or 'onUpdate'
        this.advance();

        this.expect(TokenType.BRACE_OPEN);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        const body: string[] = [];

        while(this.current().type !== TokenType.BRACE_CLOSE) {
            if(this.current().type === TokenType.NEWLINE) {
                body.push(';\n');
                this.advance();
            } else {
                if(this.current().type === TokenType.STRING) {
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
            value: body.join(' ')
        };
    }

    private parseState(): ASTNode {
        this.expect(TokenType.KEYWORD);

        const nameToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.EQUALS);

        // Skip any whitespace/newlines after equals
        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        let value: any;
        if(this.current().type === TokenType.NUMBER) {
            value = parseFloat(this.current().value);
            this.advance();
        } else if(this.current().type === TokenType.STRING) {
            value = this.current().value;
            this.advance();
        } else if(this.current().type === TokenType.BRACKET_OPEN) {
            // Parse array literal
            value = this.parseArrayLiteral();
        } else if(this.current().type === TokenType.BRACE_OPEN) {
            // Parse object literal
            value = this.parseObjectLiteral();
        } else {
            throw new Error(`Expected number, string, array, or object for state value at line ${this.current().line}. Got: ${TokenType[this.current().type]} with value: "${this.current().value}"`);
        }

        return {
            type: NodeType.STATE_DECLARATION,
            name: nameToken.value,
            value: value
        };
    }
    
    private parseElement(): ASTNode { 
        const nameToken = this.expect(TokenType.IDENTIFIER);
        const elementName = nameToken.value;
        
        // Check if it's a component instance (starts with uppercase)
        const isComponentInstance = /^[A-Z]/.test(elementName);
        
        let value = '';
        const attributes: Record<string, any> = {};
        let styles: Record<string, string> = {};

        if(this.current().type === TokenType.STRING) {
            const valueToken = this.expect(TokenType.STRING);
            value = valueToken.value;
        }

        while(this.current().type === TokenType.IDENTIFIER) {
            const attrName = this.current().value;
            
            // Check if it's a style attribute
            if(attrName === 'style' && this.peek().type === TokenType.EQUALS) {
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
            else if(['bg', 'color', 'padding', 'rounded', 'margin', 'width', 'height', 'gap', 'shadow'].includes(attrName) && this.peek().type === TokenType.EQUALS) {
                this.advance(); // consume attribute name
                this.advance(); // consume '='
                
                if(this.current().type === TokenType.STRING) {
                    const styleValue = this.current().value;
                    this.advance();
                    
                    // Convert shorthand to full CSS property
                    const cssProperty = this.shorthandToCss(attrName);
                    styles[cssProperty] = styleValue;
                } else if(this.current().type === TokenType.NUMBER) {
                    const styleValue = this.current().value;
                    this.advance();
                    
                    const cssProperty = this.shorthandToCss(attrName);
                    styles[cssProperty] = styleValue;
                }
            }
            // Regular attributes (onClick, props, etc.)
            else if(this.peek().type === TokenType.EQUALS) {
                this.advance(); // consume attribute name
                this.advance(); // consume '='

                if(this.current().type === TokenType.IDENTIFIER) {
                    const attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                } else if(this.current().type === TokenType.STRING) {
                    const attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                } else if(this.current().type === TokenType.NUMBER) {
                    const attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                }
            } else {
                break;
            }
        }

        // Check for nested children (opening brace after attributes)
        let children: ASTNode[] | undefined;
        if(this.current().type === TokenType.BRACE_OPEN) {
            this.advance(); // consume '{'
            
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
            
            children = [];
            while(this.current().type !== TokenType.BRACE_CLOSE) {
                if(this.current().type === TokenType.KEYWORD && this.current().value === 'if') {
                    children.push(this.parseIfStatement());
                } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'for') {
                    children.push(this.parseForLoop());
                } else {
                    children.push(this.parseElement());
                }
                
                while(this.current().type === TokenType.NEWLINE) {
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
            children: children
        } as ASTNode;
    }
    
    private parseStyleBlock(): Record<string, string> {
        const styles: Record<string, string> = {};
        
        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }
        
        while(this.current().type !== TokenType.BRACE_CLOSE) {
            // Skip newlines
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
            
            if(this.current().type === TokenType.BRACE_CLOSE) {
                break;
            }
            
            // Parse property name
            const propName = this.expect(TokenType.IDENTIFIER).value;
            
            // Expect colon
            this.expect(TokenType.COLON);
            
            // Parse property value (can be string or number)
            let propValue: string;
            if(this.current().type === TokenType.STRING) {
                propValue = this.current().value;
                this.advance();
            } else if(this.current().type === TokenType.NUMBER) {
                propValue = this.current().value;
                this.advance();
            } else {
                throw new Error(`Expected string or number for style value at line ${this.current().line}`);
            }
            
            styles[propName] = propValue;
            
            // Skip optional comma
            if(this.current().type === TokenType.COMMA) {
                this.advance();
            }
            
            // Skip newlines
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }
        
        return styles;
    }
    
    private shorthandToCss(shorthand: string): string {
        const map: Record<string, string> = {
            'bg': 'background',
            'color': 'color',
            'padding': 'padding',
            'rounded': 'border-radius',
            'margin': 'margin',
            'width': 'width',
            'height': 'height',
            'gap': 'gap',
            'shadow': 'box-shadow'
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
        this.expect(TokenType.KEYWORD); // 'if'

        // Parse condition
        const condition = this.parseCondition();

        this.expect(TokenType.BRACE_OPEN);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        // Parse consequent (if body)
        const consequent: ASTNode[] = [];
        while(this.current().type !== TokenType.BRACE_CLOSE) {
            consequent.push(this.parseElement());

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }

        this.expect(TokenType.BRACE_CLOSE);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        // Check for else
        let alternate: ASTNode[] | undefined;
        if(this.current().type === TokenType.KEYWORD && this.current().value === 'else') {
            this.advance(); // consume 'else'

            this.expect(TokenType.BRACE_OPEN);

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }

            alternate = [];
            while(this.current().type !== TokenType.BRACE_CLOSE) {
                alternate.push(this.parseElement());

                while(this.current().type === TokenType.NEWLINE) {
                    this.advance();
                }
            }

            this.expect(TokenType.BRACE_CLOSE);
        }

        return {
            type: NodeType.IF_STATEMENT,
            condition,
            consequent,
            alternate
        };
    }

    private parseCondition(): ASTNode {
        // Parse left side (identifier or number)
        let left: ASTNode;
        if(this.current().type === TokenType.IDENTIFIER) {
            left = {
                type: NodeType.IDENTIFIER,
                value: this.current().value
            };
            this.advance();
        } else if(this.current().type === TokenType.NUMBER) {
            left = {
                type: NodeType.NUMBER_LITERAL,
                value: parseFloat(this.current().value)
            };
            this.advance();
        } else {
            throw new Error(`Expected identifier or number in condition at line ${this.current().line}`);
        }

        // Parse operator
        const operator = this.current().value;
        if(![TokenType.GREATER_THAN, TokenType.LESS_THAN, TokenType.GREATER_EQUAL, 
             TokenType.LESS_EQUAL, TokenType.EQUAL_EQUAL, TokenType.NOT_EQUAL].includes(this.current().type)) {
            throw new Error(`Expected comparison operator at line ${this.current().line}`);
        }
        this.advance();

        // Parse right side
        let right: ASTNode;
        if(this.current().type === TokenType.IDENTIFIER) {
            right = {
                type: NodeType.IDENTIFIER,
                value: this.current().value
            };
            this.advance();
        } else if(this.current().type === TokenType.NUMBER) {
            right = {
                type: NodeType.NUMBER_LITERAL,
                value: parseFloat(this.current().value)
            };
            this.advance();
        } else {
            throw new Error(`Expected identifier or number in condition at line ${this.current().line}`);
        }

        return {
            type: NodeType.CONDITION,
            value: operator,
            children: [left, right]
        };
    }

    private parseArrayLiteral(): unknown[] {
        this.expect(TokenType.BRACKET_OPEN);

        const items: unknown[] = [];

        // Skip any newlines after opening bracket
        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        while(this.current().type !== TokenType.BRACKET_CLOSE) {
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }

            if(this.current().type === TokenType.BRACKET_CLOSE) {
                break;
            }

            if(this.current().type === TokenType.STRING) {
                items.push(this.current().value);
                this.advance();
            } else if(this.current().type === TokenType.NUMBER) {
                items.push(parseFloat(this.current().value));
                this.advance();
            } else {
                throw new Error(`Expected string or number in array at line ${this.current().line}`);
            }

            // Skip newlines after item
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }

            // Handle comma
            if(this.current().type === TokenType.COMMA) {
                this.advance();
                // Skip newlines after comma
                while(this.current().type === TokenType.NEWLINE) {
                    this.advance();
                }
            }
        }

        this.expect(TokenType.BRACKET_CLOSE);

        return items;
    }
    
    private parseObjectLiteral(): Record<string, any> {
        this.expect(TokenType.BRACE_OPEN);

        const obj: Record<string, any> = {};

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        while(this.current().type !== TokenType.BRACE_CLOSE) {
            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }

            if(this.current().type === TokenType.BRACE_CLOSE) {
                break;
            }

            const key = this.expect(TokenType.IDENTIFIER).value;
            this.expect(TokenType.COLON);
            
            let value: unknown;
            if(this.current().type === TokenType.STRING) {
                value = this.current().value;
                this.advance();
            } else if(this.current().type === TokenType.NUMBER) {
                value = parseFloat(this.current().value);
                this.advance();
            } else {
                throw new Error(`Expected string or number in object at line ${this.current().line}`);
            }
            
            obj[key] = value;

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }

            if(this.current().type === TokenType.COMMA) {
                this.advance();
                while(this.current().type === TokenType.NEWLINE) {
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
        if(this.current().type !== TokenType.KEYWORD || this.current().value !== 'in') {
            throw new Error(`Expected 'in' keyword at line ${this.current().line}`);
        }
        this.advance();

        // Parse array name
        const arrayToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.BRACE_OPEN);

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        // Parse loop body
        const body: ASTNode[] = [];
        while(this.current().type !== TokenType.BRACE_CLOSE) {
            body.push(this.parseElement());

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }

        this.expect(TokenType.BRACE_CLOSE);

        return {
            type: NodeType.FOR_LOOP,
            itemName: itemToken.value,
            arrayName: arrayToken.value,
            body
        };
    }

    private expect(type: TokenType): Token { 
        const token = this.current();

        if(token.type !== type) {
            throw new Error(
                `Expected ${TokenType[type]} but got ${TokenType[token.type]} ` +
                `at line ${token.line}, column ${token.column}`
            );
        }

        return this.advance();
    }
}
