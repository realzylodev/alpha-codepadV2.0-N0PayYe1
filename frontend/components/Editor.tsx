import { useRef, useEffect } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function Editor({ content, onChange, className = '' }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className={`bg-stone-25 dark:bg-neutral-800 h-full transition-colors duration-200 ${className}`}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start writing your markdown..."
        className="w-full h-full p-8 border-none outline-none resize-none font-mono text-stone-800 dark:text-neutral-200 text-base leading-relaxed placeholder:text-stone-400 dark:placeholder:text-neutral-500 focus:ring-0 bg-stone-25 dark:bg-neutral-800 transition-colors duration-200"
        style={{ 
          minHeight: '100%',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
        }}
      />
    </div>
  );
}
