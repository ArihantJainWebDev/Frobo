"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.NodeType = void 0;
var lexer_1 = require("./lexer");
var NodeType;
(function (NodeType) {
    NodeType[NodeType["PROGRAM"] = 0] = "PROGRAM";
    NodeType[NodeType["COMPONENT"] = 1] = "COMPONENT";
    NodeType[NodeType["COMPONENT_INSTANCE"] = 2] = "COMPONENT_INSTANCE";
    NodeType[NodeType["ELEMENT"] = 3] = "ELEMENT";
    NodeType[NodeType["FUNCTION"] = 4] = "FUNCTION";
    NodeType[NodeType["STATE_DECLARATION"] = 5] = "STATE_DECLARATION";
    NodeType[NodeType["COMPUTED_DECLARATION"] = 6] = "COMPUTED_DECLARATION";
    NodeType[NodeType["LIFECYCLE_HOOK"] = 7] = "LIFECYCLE_HOOK";
    NodeType[NodeType["FETCH_DECLARATION"] = 8] = "FETCH_DECLARATION";
    NodeType[NodeType["WATCHER"] = 9] = "WATCHER";
    NodeType[NodeType["PROPS_DECLARATION"] = 10] = "PROPS_DECLARATION";
    NodeType[NodeType["IF_STATEMENT"] = 11] = "IF_STATEMENT";
    NodeType[NodeType["FOR_LOOP"] = 12] = "FOR_LOOP";
    NodeType[NodeType["CONDITION"] = 13] = "CONDITION";
    NodeType[NodeType["IDENTIFIER"] = 14] = "IDENTIFIER";
    NodeType[NodeType["STRING_LITERAL"] = 15] = "STRING_LITERAL";
    NodeType[NodeType["NUMBER_LITERAL"] = 16] = "NUMBER_LITERAL";
})(NodeType || (exports.NodeType = NodeType = {}));
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.position = 0;
        this.tokens = tokens;
    }
    Parser.prototype.parse = function () {
        return this.parseProgram();
    };
    Parser.prototype.parseProgram = function () {
        var children = [];
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        while (this.current().type !== lexer_1.TokenType.EOF) {
            if (this.current().type === lexer_1.TokenType.KEYWORD) {
                if (this.current().value === 'component') {
                    children.push(this.parseComponent());
                }
                else if (this.current().value === 'function') {
                    children.push(this.parseFunction());
                }
            }
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
        }
        return {
            type: NodeType.PROGRAM,
            children: children
        };
    };
    Parser.prototype.parseFunction = function () {
        this.expect(lexer_1.TokenType.KEYWORD);
        var nameToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        this.expect(lexer_1.TokenType.PAREN_OPEN);
        this.expect(lexer_1.TokenType.PAREN_CLOSE);
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        var body = [];
        var braceDepth = 0;
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE || braceDepth > 0) {
            if (this.current().type === lexer_1.TokenType.BRACE_OPEN) {
                braceDepth++;
                body.push(this.current().value);
                this.advance();
            }
            else if (this.current().type === lexer_1.TokenType.BRACE_CLOSE) {
                if (braceDepth > 0) {
                    braceDepth--;
                    body.push(this.current().value);
                    this.advance();
                }
                else {
                    break;
                }
            }
            else if (this.current().type === lexer_1.TokenType.NEWLINE) {
                body.push(';\n');
                this.advance();
            }
            else {
                // Preserve quotes for string literals
                if (this.current().type === lexer_1.TokenType.STRING) {
                    body.push("\"".concat(this.current().value, "\""));
                }
                else {
                    body.push(this.current().value);
                }
                this.advance();
                // Add space after tokens for readability
                if (this.current().type !== lexer_1.TokenType.BRACE_CLOSE &&
                    this.current().type !== lexer_1.TokenType.NEWLINE &&
                    this.current().type !== lexer_1.TokenType.BRACE_OPEN) {
                    body.push(' ');
                }
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return {
            type: NodeType.FUNCTION,
            name: nameToken.value,
            value: body.join('')
        };
    };
    Parser.prototype.parseComponent = function () {
        this.expect(lexer_1.TokenType.KEYWORD);
        var nameToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        var children = [];
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'props') {
                children.push(this.parseProps());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'state') {
                children.push(this.parseState());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'computed') {
                children.push(this.parseComputed());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && (this.current().value === 'onMount' || this.current().value === 'onUpdate')) {
                children.push(this.parseLifecycleHook());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'fetch') {
                children.push(this.parseFetch());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'watch') {
                children.push(this.parseWatch());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'if') {
                children.push(this.parseIfStatement());
            }
            else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'for') {
                children.push(this.parseForLoop());
            }
            else {
                children.push(this.parseElement());
            }
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return {
            type: NodeType.COMPONENT,
            name: nameToken.value,
            children: children
        };
    };
    Parser.prototype.parseProps = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'props'
        var propNames = [];
        // Parse first prop name
        propNames.push(this.expect(lexer_1.TokenType.IDENTIFIER).value);
        // Parse additional prop names separated by commas
        while (this.current().type === lexer_1.TokenType.COMMA) {
            this.advance(); // consume comma
            propNames.push(this.expect(lexer_1.TokenType.IDENTIFIER).value);
        }
        return {
            type: NodeType.PROPS_DECLARATION,
            value: propNames
        };
    };
    Parser.prototype.parseComputed = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'computed'
        var nameToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        this.expect(lexer_1.TokenType.EQUALS);
        // Parse the expression (everything until newline)
        var expression = '';
        while (this.current().type !== lexer_1.TokenType.NEWLINE && this.current().type !== lexer_1.TokenType.EOF) {
            // Preserve quotes for string literals
            if (this.current().type === lexer_1.TokenType.STRING) {
                expression += "\"".concat(this.current().value, "\" ");
            }
            else {
                expression += this.current().value + ' ';
            }
            this.advance();
        }
        return {
            type: NodeType.COMPUTED_DECLARATION,
            name: nameToken.value,
            value: expression.trim()
        };
    };
    Parser.prototype.parseLifecycleHook = function () {
        var hookName = this.current().value; // 'onMount' or 'onUpdate'
        this.advance();
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        var body = [];
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            if (this.current().type === lexer_1.TokenType.NEWLINE) {
                body.push(';\n');
                this.advance();
            }
            else {
                if (this.current().type === lexer_1.TokenType.STRING) {
                    body.push("\"".concat(this.current().value, "\""));
                }
                else {
                    body.push(this.current().value);
                }
                this.advance();
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return {
            type: NodeType.LIFECYCLE_HOOK,
            name: hookName,
            value: body.join(' ')
        };
    };
    Parser.prototype.parseFetch = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'fetch'
        var attributes = {};
        // Parse attributes: url, into, loading, error
        while (this.current().type === lexer_1.TokenType.IDENTIFIER && this.peek().type === lexer_1.TokenType.EQUALS) {
            var attrName = this.current().value;
            this.advance(); // consume attribute name
            this.advance(); // consume '='
            if (this.current().type === lexer_1.TokenType.STRING) {
                attributes[attrName] = this.current().value;
                this.advance();
            }
            else if (this.current().type === lexer_1.TokenType.IDENTIFIER) {
                attributes[attrName] = this.current().value;
                this.advance();
            }
        }
        return {
            type: NodeType.FETCH_DECLARATION,
            attributes: attributes
        };
    };
    Parser.prototype.parseWatch = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'watch'
        var watchVar = this.expect(lexer_1.TokenType.IDENTIFIER).value;
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        var body = [];
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            if (this.current().type === lexer_1.TokenType.NEWLINE) {
                body.push(';\n');
                this.advance();
            }
            else {
                if (this.current().type === lexer_1.TokenType.STRING) {
                    body.push("\"".concat(this.current().value, "\""));
                }
                else {
                    body.push(this.current().value);
                }
                this.advance();
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return {
            type: NodeType.WATCHER,
            name: watchVar,
            value: body.join(' ')
        };
    };
    Parser.prototype.parseClassBinding = function () {
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        var classes = {};
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.BRACE_CLOSE) {
                break;
            }
            var className = this.expect(lexer_1.TokenType.IDENTIFIER).value;
            this.expect(lexer_1.TokenType.COLON);
            var condition = this.expect(lexer_1.TokenType.IDENTIFIER).value;
            classes[className] = condition;
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.COMMA) {
                this.advance();
                while (this.current().type === lexer_1.TokenType.NEWLINE) {
                    this.advance();
                }
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return classes;
    };
    Parser.prototype.parseState = function () {
        this.expect(lexer_1.TokenType.KEYWORD);
        var nameToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        this.expect(lexer_1.TokenType.EQUALS);
        // Skip any whitespace/newlines after equals
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        var value;
        if (this.current().type === lexer_1.TokenType.NUMBER) {
            value = parseFloat(this.current().value);
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.STRING) {
            value = this.current().value;
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.IDENTIFIER && (this.current().value === 'true' || this.current().value === 'false')) {
            // Parse boolean
            value = this.current().value === 'true';
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.IDENTIFIER && this.current().value === 'null') {
            // Parse null
            value = null;
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.BRACKET_OPEN) {
            // Parse array literal
            value = this.parseArrayLiteral();
        }
        else if (this.current().type === lexer_1.TokenType.BRACE_OPEN) {
            // Parse object literal
            value = this.parseObjectLiteral();
        }
        else {
            throw new Error("Expected number, string, boolean, null, array, or object for state value at line ".concat(this.current().line, ". Got: ").concat(lexer_1.TokenType[this.current().type], " with value: \"").concat(this.current().value, "\""));
        }
        return {
            type: NodeType.STATE_DECLARATION,
            name: nameToken.value,
            value: value
        };
    };
    Parser.prototype.parseElement = function () {
        var nameToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        var elementName = nameToken.value;
        // Check if it's a component instance (starts with uppercase)
        var isComponentInstance = /^[A-Z]/.test(elementName);
        var value = '';
        var attributes = {};
        var styles = {};
        if (this.current().type === lexer_1.TokenType.STRING) {
            var valueToken = this.expect(lexer_1.TokenType.STRING);
            value = valueToken.value;
        }
        while (this.current().type === lexer_1.TokenType.IDENTIFIER) {
            var attrName = this.current().value;
            // Check if it's a style attribute
            if (attrName === 'style' && this.peek().type === lexer_1.TokenType.EQUALS) {
                this.advance(); // consume 'style'
                this.advance(); // consume '='
                // Expect opening brace
                this.expect(lexer_1.TokenType.BRACE_OPEN);
                // Parse style properties
                styles = this.parseStyleBlock();
                // Expect closing brace
                this.expect(lexer_1.TokenType.BRACE_CLOSE);
            }
            // Check for shorthand style attributes
            else if (['bg', 'color', 'padding', 'rounded', 'margin', 'width', 'height', 'gap', 'shadow'].includes(attrName) && this.peek().type === lexer_1.TokenType.EQUALS) {
                this.advance(); // consume attribute name
                this.advance(); // consume '='
                if (this.current().type === lexer_1.TokenType.STRING) {
                    var styleValue = this.current().value;
                    this.advance();
                    // Convert shorthand to full CSS property
                    var cssProperty = this.shorthandToCss(attrName);
                    styles[cssProperty] = styleValue;
                }
                else if (this.current().type === lexer_1.TokenType.NUMBER) {
                    var styleValue = this.current().value;
                    this.advance();
                    var cssProperty = this.shorthandToCss(attrName);
                    styles[cssProperty] = styleValue;
                }
            }
            // Regular attributes (onClick, props, class, etc.)
            else if (this.peek().type === lexer_1.TokenType.EQUALS) {
                this.advance(); // consume attribute name
                this.advance(); // consume '='
                if (this.current().type === lexer_1.TokenType.IDENTIFIER) {
                    var attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                }
                else if (this.current().type === lexer_1.TokenType.STRING) {
                    var attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                }
                else if (this.current().type === lexer_1.TokenType.NUMBER) {
                    var attrValue = this.current().value;
                    this.advance();
                    attributes[attrName] = attrValue;
                }
                else if (this.current().type === lexer_1.TokenType.BRACE_OPEN && attrName === 'class') {
                    // Dynamic class binding: class={ active: isActive }
                    attributes[attrName] = this.parseClassBinding();
                }
            }
            else {
                break;
            }
        }
        // Check for nested children (opening brace after attributes)
        var children;
        if (this.current().type === lexer_1.TokenType.BRACE_OPEN) {
            this.advance(); // consume '{'
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            children = [];
            while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
                if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'if') {
                    children.push(this.parseIfStatement());
                }
                else if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'for') {
                    children.push(this.parseForLoop());
                }
                else {
                    children.push(this.parseElement());
                }
                while (this.current().type === lexer_1.TokenType.NEWLINE) {
                    this.advance();
                }
            }
            this.expect(lexer_1.TokenType.BRACE_CLOSE);
        }
        return {
            type: isComponentInstance ? NodeType.COMPONENT_INSTANCE : NodeType.ELEMENT,
            name: elementName,
            value: value,
            attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
            styles: Object.keys(styles).length > 0 ? styles : undefined,
            children: children
        };
    };
    Parser.prototype.parseStyleBlock = function () {
        var styles = {};
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            // Skip newlines
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.BRACE_CLOSE) {
                break;
            }
            // Parse property name
            var propName = this.expect(lexer_1.TokenType.IDENTIFIER).value;
            // Expect colon
            this.expect(lexer_1.TokenType.COLON);
            // Parse property value (can be string or number)
            var propValue = void 0;
            if (this.current().type === lexer_1.TokenType.STRING) {
                propValue = this.current().value;
                this.advance();
            }
            else if (this.current().type === lexer_1.TokenType.NUMBER) {
                propValue = this.current().value;
                this.advance();
            }
            else {
                throw new Error("Expected string or number for style value at line ".concat(this.current().line));
            }
            styles[propName] = propValue;
            // Skip optional comma
            if (this.current().type === lexer_1.TokenType.COMMA) {
                this.advance();
            }
            // Skip newlines
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
        }
        return styles;
    };
    Parser.prototype.shorthandToCss = function (shorthand) {
        var map = {
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
    };
    Parser.prototype.current = function () {
        return this.tokens[this.position];
    };
    Parser.prototype.advance = function () {
        var token = this.current();
        this.position++;
        return token;
    };
    Parser.prototype.peek = function () {
        return this.tokens[this.position + 1];
    };
    Parser.prototype.parseIfStatement = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'if'
        // Parse condition
        var condition = this.parseCondition();
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        // Parse consequent (if body)
        var consequent = [];
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            consequent.push(this.parseElement());
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        // Check for else
        var alternate;
        if (this.current().type === lexer_1.TokenType.KEYWORD && this.current().value === 'else') {
            this.advance(); // consume 'else'
            this.expect(lexer_1.TokenType.BRACE_OPEN);
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            alternate = [];
            while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
                alternate.push(this.parseElement());
                while (this.current().type === lexer_1.TokenType.NEWLINE) {
                    this.advance();
                }
            }
            this.expect(lexer_1.TokenType.BRACE_CLOSE);
        }
        return {
            type: NodeType.IF_STATEMENT,
            condition: condition,
            consequent: consequent,
            alternate: alternate
        };
    };
    Parser.prototype.parseCondition = function () {
        // Parse left side (identifier or number)
        var left;
        if (this.current().type === lexer_1.TokenType.IDENTIFIER) {
            left = {
                type: NodeType.IDENTIFIER,
                value: this.current().value
            };
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.NUMBER) {
            left = {
                type: NodeType.NUMBER_LITERAL,
                value: parseFloat(this.current().value)
            };
            this.advance();
        }
        else {
            throw new Error("Expected identifier or number in condition at line ".concat(this.current().line));
        }
        // Parse operator
        var operator = this.current().value;
        if (![lexer_1.TokenType.GREATER_THAN, lexer_1.TokenType.LESS_THAN, lexer_1.TokenType.GREATER_EQUAL,
            lexer_1.TokenType.LESS_EQUAL, lexer_1.TokenType.EQUAL_EQUAL, lexer_1.TokenType.NOT_EQUAL].includes(this.current().type)) {
            throw new Error("Expected comparison operator at line ".concat(this.current().line));
        }
        this.advance();
        // Parse right side
        var right;
        if (this.current().type === lexer_1.TokenType.IDENTIFIER) {
            right = {
                type: NodeType.IDENTIFIER,
                value: this.current().value
            };
            this.advance();
        }
        else if (this.current().type === lexer_1.TokenType.NUMBER) {
            right = {
                type: NodeType.NUMBER_LITERAL,
                value: parseFloat(this.current().value)
            };
            this.advance();
        }
        else {
            throw new Error("Expected identifier or number in condition at line ".concat(this.current().line));
        }
        return {
            type: NodeType.CONDITION,
            value: operator,
            children: [left, right]
        };
    };
    Parser.prototype.parseArrayLiteral = function () {
        this.expect(lexer_1.TokenType.BRACKET_OPEN);
        var items = [];
        // Skip any newlines after opening bracket
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        while (this.current().type !== lexer_1.TokenType.BRACKET_CLOSE) {
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.BRACKET_CLOSE) {
                break;
            }
            if (this.current().type === lexer_1.TokenType.STRING) {
                items.push(this.current().value);
                this.advance();
            }
            else if (this.current().type === lexer_1.TokenType.NUMBER) {
                items.push(parseFloat(this.current().value));
                this.advance();
            }
            else {
                throw new Error("Expected string or number in array at line ".concat(this.current().line));
            }
            // Skip newlines after item
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            // Handle comma
            if (this.current().type === lexer_1.TokenType.COMMA) {
                this.advance();
                // Skip newlines after comma
                while (this.current().type === lexer_1.TokenType.NEWLINE) {
                    this.advance();
                }
            }
        }
        this.expect(lexer_1.TokenType.BRACKET_CLOSE);
        return items;
    };
    Parser.prototype.parseObjectLiteral = function () {
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        var obj = {};
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.BRACE_CLOSE) {
                break;
            }
            var key = this.expect(lexer_1.TokenType.IDENTIFIER).value;
            this.expect(lexer_1.TokenType.COLON);
            var value = void 0;
            if (this.current().type === lexer_1.TokenType.STRING) {
                value = this.current().value;
                this.advance();
            }
            else if (this.current().type === lexer_1.TokenType.NUMBER) {
                value = parseFloat(this.current().value);
                this.advance();
            }
            else {
                throw new Error("Expected string or number in object at line ".concat(this.current().line));
            }
            obj[key] = value;
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
            if (this.current().type === lexer_1.TokenType.COMMA) {
                this.advance();
                while (this.current().type === lexer_1.TokenType.NEWLINE) {
                    this.advance();
                }
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return obj;
    };
    Parser.prototype.parseForLoop = function () {
        this.expect(lexer_1.TokenType.KEYWORD); // 'for'
        // Parse item name
        var itemToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        // Expect 'in'
        if (this.current().type !== lexer_1.TokenType.KEYWORD || this.current().value !== 'in') {
            throw new Error("Expected 'in' keyword at line ".concat(this.current().line));
        }
        this.advance();
        // Parse array name
        var arrayToken = this.expect(lexer_1.TokenType.IDENTIFIER);
        this.expect(lexer_1.TokenType.BRACE_OPEN);
        while (this.current().type === lexer_1.TokenType.NEWLINE) {
            this.advance();
        }
        // Parse loop body
        var body = [];
        while (this.current().type !== lexer_1.TokenType.BRACE_CLOSE) {
            body.push(this.parseElement());
            while (this.current().type === lexer_1.TokenType.NEWLINE) {
                this.advance();
            }
        }
        this.expect(lexer_1.TokenType.BRACE_CLOSE);
        return {
            type: NodeType.FOR_LOOP,
            itemName: itemToken.value,
            arrayName: arrayToken.value,
            body: body
        };
    };
    Parser.prototype.expect = function (type) {
        var token = this.current();
        if (token.type !== type) {
            throw new Error("Expected ".concat(lexer_1.TokenType[type], " but got ").concat(lexer_1.TokenType[token.type], " ") +
                "at line ".concat(token.line, ", column ").concat(token.column));
        }
        return this.advance();
    };
    return Parser;
}());
exports.Parser = Parser;
