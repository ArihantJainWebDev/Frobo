export enum TokenType {
    KEYWORD,
    IDENTIFIER,
    STRING,
    NUMBER,
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
    EOF
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

export class Lexer {
    private code: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;

    constructor(code: string){
        this.code = code;
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];

        while(this.position < this.code.length){
            const token = this.nextToken();
            if(token){
                tokens.push(token);
            }
        }

        tokens.push({
            type: TokenType.EOF,
            value: '',
            line: this.line,
            column: this.column
        })

        return tokens;
    }

    private nextToken(): Token | null {
        while(this.current() === ' ' || this.current() == '\t') {
            this.advance();
        }

        const char = this.current();
        
        if(char === undefined){
            return null;
        }

        if(char === '\n'){
            return this.makeToken(TokenType.NEWLINE, '\n');
        }

        if(char === '"') {
            return this.readString();
        }

        if(this.isDigit(char)){
            return this.readNumber();
        }

        if(this.isAlpha(char)){
            return this.readIdentifierOrKeyword();
        }

        switch(char){
            case '{': return this.makeToken(TokenType.BRACE_OPEN, '{');
            case '}': return this.makeToken(TokenType.BRACE_CLOSE, '}');
            case '[': return this.makeToken(TokenType.BRACKET_OPEN, '[');
            case ']': return this.makeToken(TokenType.BRACKET_CLOSE, ']');
            case '(': return this.makeToken(TokenType.PAREN_OPEN, '(');
            case ')': return this.makeToken(TokenType.PAREN_CLOSE, ')');
            case ',': return this.makeToken(TokenType.COMMA, ',');
            case ':': return this.makeToken(TokenType.COLON, ':');
            case '+': return this.makeToken(TokenType.PLUS, '+');
            case '-': return this.makeToken(TokenType.MINUS, '-');
            case '*': return this.makeToken(TokenType.MULTIPLY, '*');
            case '/': return this.makeToken(TokenType.DIVIDE, '/');
            case '.': return this.makeToken(TokenType.DOT, '.');
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
                break;
        }

        throw new Error(`Unexpected character '${char} at line ${this.line}, column ${this.column}`);
    }

    private current(): string {
        return this.code[this.position];
    }

    private advance(): void {
        if(this.current() === '\n'){
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
            column: this.column
        };
        this.advance();
        return token;
    }

    private readString(): Token {
        const startLine = this.line;
        const startColumn = this.column;

        this.advance();

        let value = '';

        while(this.current() !== '"' && this.current() !== undefined) {
            value += this.current();
            this.advance();
        }

        if(this.current() === undefined) {
            throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`)
        }

        this.advance();

        return {
            type: TokenType.STRING,
            value,
            line: startLine,
            column: startColumn
        };
    }

    private readNumber(): Token {
        const startLine = this.line;
        const startColumn = this.column;

        let value = '';

        while(this.isDigit(this.current())) {
            value += this.current();
            this.advance();
        }

        if(this.current() === '.' && this.isDigit(this.peek())) {
            value += '.';
            this.advance();

            while(this.isDigit(this.current())) {
                value += this.current();
                this.advance();
            }
        }

        return {
            type: TokenType.NUMBER,
            value,
            line: startLine,
            column: startColumn
        };
    }

    private readIdentifierOrKeyword(): Token {
        const startLine = this.line;
        const startColumn = this.column;

        let value = '';

        while(this.isAlpha(this.current()) || this.isDigit(this.current())) {
            value += this.current();
            this.advance();
        }

        const keywords = ['component', 'state', 'computed', 'function', 'if', 'else', 'for', 'in', 'props', 'onMount', 'onUpdate', 'fetch', 'watch'];
        const type = keywords.includes(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;

        return {
            type,
            value,
            line: startLine,
            column: startColumn
        }
    }
}
