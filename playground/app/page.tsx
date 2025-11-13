'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getDefaultExample } from '@/lib/examples';

// Dynamically import components to avoid SSR issues
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
const Preview = dynamic(() => import('@/components/Preview'), { ssr: false });
const Toolbar = dynamic(() => import('@/components/Toolbar'), { ssr: false });
const ErrorPanel = dynamic(() => import('@/components/ErrorPanel'), { ssr: false });

export default function Home() {
  const [code, setCode] = useState('');
  
  const [compiledOutput, setCompiledOutput] = useState<{
    html: string;
    css: string;
    js: string;
  } | null>(null);
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Load default example on mount
  useEffect(() => {
    const defaultExample = getDefaultExample();
    setCode(defaultExample.code);
  }, []);

  const handleRun = async () => {
    console.log('🚀 Starting compilation...');
    console.log('Code to compile:', code);
    
    setIsCompiling(true);
    setErrors([]);
    
    try {
      // Import the compiler dynamically (client-side only)
      const { compile } = await import('@/lib/compiler');
      console.log('✅ Compiler imported');
      
      // Compile the Frobo code
      const output = compile(code);
      console.log('✅ Compilation successful!', output);
      
      // Set the compiled output
      setCompiledOutput(output);
      setIsCompiling(false);
      
    } catch (error: unknown) {
      console.error('❌ Compilation error:', error);
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['An unknown error occurred']);
      }
      setIsCompiling(false);
    }
  };

  const handleLoadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setCompiledOutput(null);
    setErrors([]);
  };

  const handleExport = () => {
    if (!compiledOutput) {
      alert('Please run your code first before exporting!');
      return;
    }

    // Create standalone HTML file
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frobo App</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    ${compiledOutput.css}
  </style>
</head>
<body>
  ${compiledOutput.html}
  
  <script>
    ${compiledOutput.js}
  </script>
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frobo-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Toolbar */}
      <Toolbar 
        onRun={handleRun} 
        isCompiling={isCompiling}
        onLoadExample={handleLoadExample}
        onExport={handleExport}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 border-r border-gray-700">
          <Editor value={code} onChange={setCode} />
        </div>
        
        {/* Preview */}
        <div className="w-1/2 bg-white">
          <Preview output={compiledOutput} />
        </div>
      </div>
      
      {/* Error Panel */}
      {errors.length > 0 && (
        <ErrorPanel errors={errors} onClose={() => setErrors([])} />
      )}
    </div>
  );
}