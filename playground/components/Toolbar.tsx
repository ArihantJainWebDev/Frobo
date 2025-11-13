'use client';

import { useState } from 'react';
import { examples, type Example } from '@/lib/examples';

interface ToolbarProps {
  onRun: () => void;
  isCompiling: boolean;
  onLoadExample: (code: string) => void;
}

export default function Toolbar({ onRun, isCompiling, onLoadExample }: ToolbarProps) {
  const [showExamples, setShowExamples] = useState(false);

  const handleExampleClick = (example: Example) => {
    onLoadExample(example.code);
    setShowExamples(false);
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-4">
      <h1 className="text-xl font-bold text-white">Frobo Playground</h1>
      
      <button
        onClick={onRun}
        disabled={isCompiling}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        {isCompiling ? 'Compiling...' : 'Run Code'}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Examples ▼
        </button>

        {showExamples && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-700 rounded-md shadow-lg z-50 overflow-hidden">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-b-0"
              >
                <div className="text-white font-medium">{example.name}</div>
                <div className="text-gray-400 text-sm">{example.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1" />
      
      <div className="text-gray-400 text-sm">
        Press Ctrl+Enter to run
      </div>
    </div>
  );
}