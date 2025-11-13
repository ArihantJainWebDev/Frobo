'use client';

import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const handleEditorWillMount = (monaco: typeof import('monaco-editor')) => {
    // Register Frobo language
    monaco.languages.register({ id: 'frobo' });

    // Define Frobo syntax highlighting
    monaco.languages.setMonarchTokensProvider('frobo', {
      keywords: [
        'component', 'state', 'function', 'if', 'else', 'for', 'in', 'props'
      ],
      
      tokenizer: {
        root: [
          // Keywords
          [/\b(component|state|function|if|else|for|in|props)\b/, 'keyword'],
          
          // Identifiers
          [/[a-zA-Z_]\w*/, 'identifier'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          
          // Numbers
          [/\d+(\.\d+)?/, 'number'],
          
          // Delimiters
          [/[{}()\[\]]/, '@brackets'],
          [/[,=]/, 'delimiter'],
        ],
        
        string: [
          [/[^\\"]+/, 'string'],
          [/"/, 'string', '@pop']
        ],
      },
    });

    // Define theme colors for Frobo
    monaco.editor.defineTheme('frobo-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
        { token: 'identifier', foreground: '9CDCFE' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {},
    });
  };

  return (
    <div className="h-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="frobo"
        theme="frobo-dark"
        value={value}
        onChange={(value) => onChange(value || '')}
        beforeMount={handleEditorWillMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}