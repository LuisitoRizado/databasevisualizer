import React, { useCallback, useRef, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Tab') {
        evt.preventDefault();
        const target = evt.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);

        // Move the cursor to the end of the inserted tab
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
      }
    },
    [value, onChange]
  );

  useEffect(() => {
    // Ajustar la altura del textarea automáticamente para acomodar el contenido
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative h-full overflow-auto">
      <Highlight theme={themes.nightOwl} code={value} language="sql">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })} className="table-row">
                <span className="table-cell text-right pr-4 select-none opacity-50 text-sm">{i + 1}</span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-white resize-none outline-none"
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
