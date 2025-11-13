import { Token, TokenType } from "./lexer";

export enum NodeType {
    PROGRAM,
    COMPONENT,
    ELEMENT,
    FUNCTION,
    STATE_DECLARATION,
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
        const components: ASTNode[] = [];

        while(this.current().type === TokenType.NEWLINE) {
            this.advance();
        }

        while(this.current().type !== TokenType.EOF) {
            if(this.current().type === TokenType.KEYWORD && this.current().value === 'component') {
                components.push(this.parseComponent());
            }

            while(this.current().type === TokenType.NEWLINE) {
                this.advance();
            }
        }

        return {
            type: NodeType.PROGRAM,
            children: components
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
            children.push(this.parseElement());

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
    private parseElement(): ASTNode { 
        const nameToken = this.expect(TokenType.IDENTIFIER);

        const valueToken = this.expect(TokenType.STRING);

        return {
            type: NodeType.ELEMENT,
            name: nameToken.value,
            value: valueToken.value
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