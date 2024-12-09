import React, { useState, useRef, useEffect } from 'react';

interface ConnectorProps {
  onConnect: (endX: number, endY: number) => void;
}

const Connector: React.FC<ConnectorProps> = ({ onConnect }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [line, setLine] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const connectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawing && connectorRef.current) {
        const rect = connectorRef.current.getBoundingClientRect();
        setLine(prev => ({
          ...prev,
          x2: e.clientX - rect.left,
          y2: e.clientY - rect.top
        }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDrawing) {
        setIsDrawing(false);
        onConnect(e.clientX, e.clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, onConnect]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (connectorRef.current) {
      const rect = connectorRef.current.getBoundingClientRect();
      setLine({
        x1: e.clientX - rect.left,
        y1: e.clientY - rect.top,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top
      });
      setIsDrawing(true);
    }
  };

  return (
    <div
      ref={connectorRef}
      className="absolute inset-0 pointer-events-none"
    >
      <div
        className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-pointer pointer-events-auto"
        style={{ transform: 'translateY(-50%)' }}
        onMouseDown={handleMouseDown}
      />
      {isDrawing && (
        <svg className="absolute inset-0 pointer-events-none">
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="blue"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
};

export default Connector;

