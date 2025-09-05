import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface CommunicationMessageRendererProps {
  content: string;
  className?: string;
}

export function CommunicationMessageRenderer({ content, className = '' }: CommunicationMessageRendererProps) {
  return (
    <div className={`communication-message ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-gray-800 mb-1 mt-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium text-gray-700 mb-1 mt-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-medium text-gray-600 mb-1 mt-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 leading-tight mb-2 text-sm">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 bg-yellow-100 px-1 rounded">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-blue-700 bg-blue-50 px-1 rounded">
              {children}
            </em>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto mb-3 border text-sm">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-0.5 text-gray-800 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-0.5 text-gray-800 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-800 leading-tight text-sm">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-3 py-1 bg-blue-50 mb-2 italic text-gray-700 text-sm">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-300 rounded text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-200">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-1 text-left font-semibold text-gray-700 text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1 text-gray-800 text-xs">
              {children}
            </td>
          ),
          // Special handling for communication evolution symbols
          span: ({ children, className }) => {
            if (className?.includes('symbol')) {
              return (
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono mx-1 border border-purple-200">
                  {children}
                </span>
              );
            }
            return <span className={className}>{children}</span>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Special component for rendering evolved communication with enhanced styling
export function EvolvedCommunicationRenderer({ content, className = '' }: CommunicationMessageRendererProps) {
  // Process content to handle both markdown and HTML spans
  const processContent = (text: string) => {
    // First, handle markdown formatting
    let processed = text
      // Handle headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Handle bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Handle code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Handle lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Handle decode sections (must come before general symbol pattern)
      .replace(/\[decode:\s*([^\]]+)\]/gi, 
        '<div class="decode-section text-xs bg-green-50 p-2 rounded border-l-4 border-green-400 mb-2"><strong class="text-green-800">Decode:</strong> <span class="text-gray-700">$1</span></div>')
      // Handle decompress sections (must come before general symbol pattern)
      .replace(/\[decompress:\s*([^\]]+)\]/gi, 
        '<div class="decompress-section text-xs bg-orange-50 p-2 rounded border-l-4 border-orange-400 mb-2"><strong class="text-orange-800">Decompress:</strong> <span class="text-gray-700">$1</span></div>')
      // Handle optimize sections for iterative optimization scenario
      .replace(/\[optimize:\s*([^\]]+)\]/gi, 
        '<div class="optimize-section text-xs bg-red-50 p-2 rounded border-l-4 border-red-400 mb-2"><strong class="text-red-800">Optimize:</strong> <span class="text-gray-700">$1</span></div>')
      // Handle compression ratios
      .replace(/(\d+\.?\d*)\s*(words?\s*=\s*\d+\.?\d*\s*meanings?)/gi, 
        '<span class="compression-ratio inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mx-1">$1 $2</span>')
      // Handle efficiency metrics
      .replace(/(\d+%)\s*(improvement|efficiency)/gi, 
        '<span class="efficiency-metric inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono mx-1">$1 $2</span>')
      // Handle symbol patterns like [symbol: meaning] or [⊕: Understanding] (but not decode/decompress/optimize)
      .replace(/\[(?!decode:|decompress:|optimize:)([^\]]+):\s*([^\]]+)\]/g, 
        '<span class="symbol-pattern inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono mx-1 border border-purple-200"><span class="font-bold">$1</span>: <span class="text-gray-700">$2</span></span>')
      // Handle creative example markers for iterative optimization
      .replace(/(POEM|ANECDOTE|SCIENTIFIC STORY|ARTISTIC EXPRESSION|METAPHOR|ANALOGY|FABLE|HAIKU|LIMERICK|RIDDLE):\s*/gi, 
        '<div class="creative-example-header text-sm font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-t border-b border-indigo-200 mt-3 mb-1">$1:</div>')
      // Handle creative example content
      .replace(/(<div class="creative-example-header[^>]*>.*?<\/div>)(.*?)(?=<div class="creative-example-header|$)/g, 
        '$1<div class="creative-example-content bg-indigo-25 p-3 rounded-b border border-indigo-200 mb-3 italic text-gray-700">$2</div>');

    // Wrap list items in ul tags
    processed = processed.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // Wrap paragraphs
    processed = processed
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h|u|l|d])/gm, '<p>')
      .replace(/(?<!>)$/gm, '</p>');

    return processed;
  };

  return (
    <div className={`evolved-communication ${className}`}>
      <div 
        className="text-sm leading-tight"
        dangerouslySetInnerHTML={{ 
          __html: processContent(content)
        }} 
      />
    </div>
  );
}