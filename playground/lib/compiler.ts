import { Lexer } from './lexer';
import { Parser } from './parser';
import { CodeGenerator, CompiledOutput } from './codegen';

export function compile(code: string): CompiledOutput {
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const generator = new CodeGenerator(ast);
    const output = generator.generate();
    
    return output;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Compilation failed');
  }
}

export type { CompiledOutput };