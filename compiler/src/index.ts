import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { CodeGenerator } from './codegen.js';

export { Lexer, TokenType } from './lexer.js';
export type { Token } from './lexer.js';

export { Parser, NodeType } from './parser.js';
export type { ASTNode } from './parser.js';

export { CodeGenerator } from './codegen.js';
export type { CompiledOutput } from './codegen.js';

// Convenience function to compile Frobo code
export function compile(code: string) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();

  const generator = new CodeGenerator(ast);
  return generator.generate();
}
