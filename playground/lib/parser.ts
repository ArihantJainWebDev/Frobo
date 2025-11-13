import { Token, TokenType } from "./lexer";

export enum NodeType {
    PROGRAM,
    COMPONENT,
    ELEMENT,
    FUNCTION,
    STATE_DECLARATION,
    IF_STATEMENT,
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
    condition?: ASTNode;
    consequent?: ASTNode[];
    alternate?: ASTNode[];
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
                body.push(this.current().value);
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
            if(this.current().type === TokenType.KEYWORD && this.current().value === 'state') {
                children.push(this.parseState());
            } else if(this.current().type === TokenType.KEYWORD && this.current().value === 'if') {
                children.push(this.parseIfStatement());
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

    private parseState(): ASTNode {
        this.expect(TokenType.KEYWORD);

        const nameToken = this.expect(TokenType.IDENTIFIER);

        this.expect(TokenType.EQUALS);

        let value: any;
        if(this.current().type === TokenType.NUMBER) {
            value = parseFloat(this.current().value);
            this.advance();
        } else if(this.current().type === TokenType.STRING) {
            value = this.current().value;
            this.advance();
        } else {
            throw new Error(`Expected number or string for state value at line ${this.current().line}`);
        }

        return {
            type: NodeType.STATE_DECLARATION,
            name: nameToken.value,
            value: value
        };
    }
    
    private parseElement(): ASTNode { 
        const nameToken = this.expect(TokenType.IDENTIFIER);
        
        let value = '';
        const attributes: Record<string, any> = {};

        if(this.current().type === TokenType.STRING) {
            const valueToken = this.expect(TokenType.STRING);
            value = valueToken.value;
        }

        while(this.current().type === TokenType.IDENTIFIER && this.peek().type === TokenType.EQUALS) {
            const attrName = this.current().value;
            this.advance();

            if(this.current().type === TokenType.EQUALS) {
                this.advance();

                if(this.current().type === TokenType.IDENTIFIER) {
                    const attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                }
            } else {
                break;
            }
        }

        return {
            type: NodeType.ELEMENT,
            name: nameToken.value,
            value:value,
            attributes: Object.keys(attributes).length > 0 ? attributes : undefined
        }
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
