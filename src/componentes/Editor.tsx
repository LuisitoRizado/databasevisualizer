import React, { useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Ajustar la altura del textarea automáticamente para acomodar el contenido
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative h-full overflow-auto">
      <Highlight theme={themes.nightOwl} code={value} language="sql">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} `} style={style}>
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line, key: i })}
                className="table-row"
              >
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
        className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-white resize-none outline-none"
      />
    </div>
  );
};

export default Editor;
