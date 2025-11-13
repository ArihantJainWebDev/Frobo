import { CodeGenerator } from "./codegen";
import { Lexer, TokenType } from "./lexer";
import { Parser } from './parser';

const code = 
`component Hello {
    text "Hello World"
    button "Click Me"
}`;

console.log("Input Code:");
console.log(code);

const lexer = new Lexer(code);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const generator = new CodeGenerator(ast);
const output = generator.generate();

console.log('\n=== Generated HTML ===');
console.log(output.html);

console.log('\n=== Generated CSS ===');
console.log(output.css);

console.log('\n=== Generated JS ===');
console.log(output.js);