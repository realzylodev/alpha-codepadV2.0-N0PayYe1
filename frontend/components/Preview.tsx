import { useMemo } from 'react';
import { marked } from 'marked';

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const htmlContent = useMemo(() => {
    try {
      // Configure marked options for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false,
      });
      
      return marked(content);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error parsing markdown</p>';
    }
  }, [content]);

  return (
    <div className="bg-stone-50 dark:bg-neutral-900 h-full overflow-auto transition-colors duration-200 font-serif">
      <div 
        className="p-8 max-w-none markdown-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <style>{`
        .markdown-content {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          line-height: 1.7;
        }
        
        .markdown-content h1 {
          font-size: 2.25rem;
          font-weight: 400;
          color: #1c1917;
          margin-top: 0;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #d6d3d1;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h1 {
          color: #f5f5f5;
          border-bottom-color: #525252;
        }
        
        .markdown-content h2 {
          font-size: 1.875rem;
          font-weight: 400;
          color: #1c1917;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h2 {
          color: #f5f5f5;
        }
        
        .markdown-content h3 {
          font-size: 1.5rem;
          font-weight: 400;
          color: #1c1917;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h3 {
          color: #f5f5f5;
        }
        
        .markdown-content h4 {
          font-size: 1.25rem;
          font-weight: 500;
          color: #1c1917;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h4 {
          color: #f5f5f5;
        }
        
        .markdown-content h5 {
          font-size: 1.125rem;
          font-weight: 500;
          color: #1c1917;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h5 {
          color: #f5f5f5;
        }
        
        .markdown-content h6 {
          font-size: 1rem;
          font-weight: 500;
          color: #1c1917;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }
        
        .dark .markdown-content h6 {
          color: #f5f5f5;
        }
        
        .markdown-content p {
          margin-bottom: 1.25rem;
          color: #44403c;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .dark .markdown-content p {
          color: #d4d4d4;
        }
        
        .markdown-content strong {
          font-weight: 600;
          color: #1c1917;
        }
        
        .dark .markdown-content strong {
          color: #fafafa;
        }
        
        .markdown-content em {
          font-style: italic;
        }
        
        .markdown-content code {
          background-color: #f5f5f4;
          color: #292524;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.9em;
        }
        
        .dark .markdown-content code {
          background-color: #404040;
          color: #e5e5e5;
        }
        
        .markdown-content pre {
          background-color: #f5f5f4;
          border: 1px solid #d6d3d1;
          border-radius: 0.5rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
        }
        
        .dark .markdown-content pre {
          background-color: #404040;
          border-color: #525252;
        }
        
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }
        
        .markdown-content blockquote {
          border-left: 4px solid #a8a29e;
          padding-left: 1.25rem;
          color: #57534e;
          font-style: italic;
          margin: 1.5rem 0;
          font-size: 1.125rem;
        }
        
        .dark .markdown-content blockquote {
          border-left-color: #737373;
          color: #a3a3a3;
        }
        
        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-bottom: 1.25rem;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-bottom: 1.25rem;
        }
        
        .markdown-content li {
          margin-bottom: 0.5rem;
          color: #44403c;
          font-size: 1.125rem;
          line-height: 1.7;
        }
        
        .dark .markdown-content li {
          color: #d4d4d4;
        }
        
        .markdown-content a {
          color: #78716c;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .dark .markdown-content a {
          color: #a3a3a3;
        }
        
        .markdown-content a:hover {
          color: #57534e;
        }
        
        .dark .markdown-content a:hover {
          color: #d4d4d4;
        }
        
        .markdown-content hr {
          border: none;
          border-top: 1px solid #a8a29e;
          margin: 3rem 0;
        }
        
        .dark .markdown-content hr {
          border-top-color: #525252;
        }
        
        .markdown-content table {
          border-collapse: collapse;
          border: 1px solid #a8a29e;
          margin: 1.5rem 0;
          width: 100%;
          font-size: 1rem;
        }
        
        .dark .markdown-content table {
          border-color: #525252;
        }
        
        .markdown-content th {
          border: 1px solid #a8a29e;
          background-color: #f5f5f4;
          padding: 0.75rem;
          font-weight: 500;
          text-align: left;
        }
        
        .dark .markdown-content th {
          border-color: #525252;
          background-color: #404040;
          color: #f5f5f5;
        }
        
        .markdown-content td {
          border: 1px solid #a8a29e;
          padding: 0.75rem;
        }
        
        .dark .markdown-content td {
          border-color: #525252;
          color: #d4d4d4;
        }
      `}</style>
    </div>
  );
}
