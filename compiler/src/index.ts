import { Lexer } from './lexer';
import { Parser } from './parser';
import { CodeGenerator } from './codegen';

export { Lexer, TokenType } from './lexer';
export type { Token } from './lexer';

export { Parser, NodeType } from './parser';
export type { ASTNode } from './parser';

export { CodeGenerator } from './codegen';
export type { CompiledOutput } from './codegen';

// Convenience function to compile Frobo code
export function compile(code: string) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();

  const generator = new CodeGenerator(ast);
  return generator.generate();
}
