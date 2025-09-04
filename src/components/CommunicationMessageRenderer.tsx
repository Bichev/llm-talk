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
            <h1 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-gray-700 mb-2 mt-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium text-gray-600 mb-1 mt-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 leading-relaxed mb-3">
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
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-gray-800">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-800">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-800 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 mb-3 italic text-gray-700">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300 rounded-lg">
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
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-800">
              {children}
            </td>
          ),
          // Special handling for communication evolution symbols
          span: ({ children, className }) => {
            if (className?.includes('symbol')) {
              return (
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono mx-1">
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
      // Handle decode sections
      .replace(/\[decode:\s*([^\]]+)\]/gi, 
        '<div class="decode-section"><strong>Decode:</strong> $1</div>')
      // Handle decompress sections
      .replace(/\[decompress:\s*([^\]]+)\]/gi, 
        '<div class="decompress-section"><strong>Decompress:</strong> $1</div>')
      // Handle compression ratios
      .replace(/(\d+\.?\d*)\s*(words?\s*=\s*\d+\.?\d*\s*meanings?)/gi, 
        '<span class="compression-ratio">$1 $2</span>')
      // Handle efficiency metrics
      .replace(/(\d+%)\s*(improvement|efficiency)/gi, 
        '<span class="efficiency-metric">$1 $2</span>');

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
        dangerouslySetInnerHTML={{ 
          __html: processContent(content)
        }} 
      />
    </div>
  );
}