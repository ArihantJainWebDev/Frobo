'use client';

// import { useEffect, useRef } from 'react';

interface PreviewProps {
  output: {
    html: string;
    css: string;
    js: string;
  } | null;
}

export default function Preview({ output }: PreviewProps) {
  console.log('📺 Preview component rendered with output:', output);

  // Generate the HTML content for the iframe
  const htmlContent = output ? 
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<style>\n' +
    'body {\n' +
    '  margin: 0;\n' +
    '  padding: 20px;\n' +
    '  font-family: system-ui, -apple-system, sans-serif;\n' +
    '}\n' +
    output.css +
    '\n</style>\n' +
    '</head>\n' +
    '<body>\n' +
    output.html +
    '\n<script>\n' +
    output.js +
    '\n</script>\n' +
    '</body>\n' +
    '</html>'
   : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div>Click "Run Code" to see your Frobo app here!</div>
      </body>
    </html>
  `;

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
        <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
      </div>
      <iframe
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
        srcDoc={htmlContent}
      />
    </div>
  );
}
