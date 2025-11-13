'use client';

interface ToolbarProps {
  onRun: () => void;
  isCompiling: boolean;
}

export default function Toolbar({ onRun, isCompiling }: ToolbarProps) {
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
      
      <div className="flex-1" />
      
      <div className="text-gray-400 text-sm">
        Press Ctrl+Enter to run
      </div>
    </div>
  );
}