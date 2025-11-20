"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["KEYWORD"] = 0] = "KEYWORD";
    TokenType[TokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    TokenType[TokenType["STRING"] = 2] = "STRING";
    TokenType[TokenType["NUMBER"] = 3] = "NUMBER";
    TokenType[TokenType["EQUALS"] = 4] = "EQUALS";
    TokenType[TokenType["PLUS"] = 5] = "PLUS";
    TokenType[TokenType["MINUS"] = 6] = "MINUS";
    TokenType[TokenType["MULTIPLY"] = 7] = "MULTIPLY";
    TokenType[TokenType["DIVIDE"] = 8] = "DIVIDE";
    TokenType[TokenType["GREATER_THAN"] = 9] = "GREATER_THAN";
    TokenType[TokenType["LESS_THAN"] = 10] = "LESS_THAN";
    TokenType[TokenType["GREATER_EQUAL"] = 11] = "GREATER_EQUAL";
    TokenType[TokenType["LESS_EQUAL"] = 12] = "LESS_EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 13] = "EQUAL_EQUAL";
    TokenType[TokenType["NOT_EQUAL"] = 14] = "NOT_EQUAL";
    TokenType[TokenType["NOT"] = 15] = "NOT";
    TokenType[TokenType["BRACE_OPEN"] = 16] = "BRACE_OPEN";
    TokenType[TokenType["BRACE_CLOSE"] = 17] = "BRACE_CLOSE";
    TokenType[TokenType["BRACKET_OPEN"] = 18] = "BRACKET_OPEN";
    TokenType[TokenType["BRACKET_CLOSE"] = 19] = "BRACKET_CLOSE";
    TokenType[TokenType["PAREN_OPEN"] = 20] = "PAREN_OPEN";
    TokenType[TokenType["PAREN_CLOSE"] = 21] = "PAREN_CLOSE";
    TokenType[TokenType["COMMA"] = 22] = "COMMA";
    TokenType[TokenType["COLON"] = 23] = "COLON";
    TokenType[TokenType["DOT"] = 24] = "DOT";
    TokenType[TokenType["NEWLINE"] = 25] = "NEWLINE";
    TokenType[TokenType["EOF"] = 26] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
var Lexer = /** @class */ (function () {
    function Lexer(code) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.code = code;
    }
    Lexer.prototype.tokenize = function () {
        var tokens = [];
        while (this.position < this.code.length) {
            var token = this.nextToken();
            if (token) {
                tokens.push(token);
            }
        }
        tokens.push({
            type: TokenType.EOF,
            value: '',
            line: this.line,
            column: this.column
        });
        return tokens;
    };
    Lexer.prototype.nextToken = function () {
        while (this.current() === ' ' || this.current() == '\t') {
            this.advance();
        }
        var char = this.current();
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
                return this.makeToken(TokenType.NOT, '!');
        }
        throw new Error("Unexpected character '".concat(char, " at line ").concat(this.line, ", column ").concat(this.column));
    };
    Lexer.prototype.current = function () {
        return this.code[this.position];
    };
    Lexer.prototype.advance = function () {
        if (this.current() === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        this.position++;
    };
    Lexer.prototype.peek = function () {
        return this.code[this.position + 1];
    };
    Lexer.prototype.isAlpha = function (char) {
        return /[a-zA-Z_]/.test(char);
    };
    Lexer.prototype.isDigit = function (char) {
        return /[0-9]/.test(char);
    };
    Lexer.prototype.makeToken = function (type, value) {
        var token = {
            type: type,
            value: value,
            line: this.line,
            column: this.column
        };
        this.advance();
        return token;
    };
    Lexer.prototype.readString = function () {
        var startLine = this.line;
        var startColumn = this.column;
        this.advance();
        var value = '';
        while (this.current() !== '"' && this.current() !== undefined) {
            value += this.current();
            this.advance();
        }
        if (this.current() === undefined) {
            throw new Error("Unterminated string at line ".concat(startLine, ", column ").concat(startColumn));
        }
        this.advance();
        return {
            type: TokenType.STRING,
            value: value,
            line: startLine,
            column: startColumn
        };
    };
    Lexer.prototype.readNumber = function () {
        var startLine = this.line;
        var startColumn = this.column;
        var value = '';
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
            value: value,
            line: startLine,
            column: startColumn
        };
    };
    Lexer.prototype.readIdentifierOrKeyword = function () {
        var startLine = this.line;
        var startColumn = this.column;
        var value = '';
        while (this.isAlpha(this.current()) || this.isDigit(this.current())) {
            value += this.current();
            this.advance();
        }
        var keywords = ['component', 'state', 'computed', 'function', 'if', 'else', 'for', 'in', 'props', 'onMount', 'onUpdate', 'fetch', 'watch'];
        var type = keywords.includes(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        return {
            type: type,
            value: value,
            line: startLine,
            column: startColumn
        };
    };
    return Lexer;
}());
exports.Lexer = Lexer;
