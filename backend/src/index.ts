import express, { Request, Response } from 'express';
import cors from 'cors';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { CodeGenerator } from './codegen';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3333'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '100kb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Frobo API is running' });
});

// Compile endpoint
app.post('/api/compile', (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    // Validation
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Code must be a non-empty string'
      });
    }

    if (code.length > 100000) {
      return res.status(400).json({
        error: 'Code too large',
        message: 'Code must be less than 100KB'
      });
    }

    // Compile the code
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const generator = new CodeGenerator(ast);
    const output = generator.generate();

    // Return compiled output
    res.json({
      success: true,
      output: {
        html: output.html,
        css: output.css,
        js: output.js
      }
    });

  } catch (error: any) {
    console.error('Compilation error:', error);
    
    res.status(400).json({
      error: 'Compilation failed',
      message: error.message || 'Unknown error occurred'
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Frobo API server running on http://localhost:${PORT}`);
  console.log(`📝 Compile endpoint: POST http://localhost:${PORT}/api/compile`);
});
