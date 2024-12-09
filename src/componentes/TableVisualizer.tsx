"use client";

import { useState, useEffect, forwardRef } from "react";
import { TableDetails } from "./TableDetails";
import { useModalHook } from "@/hooks/useModalHook";
import { TableRect } from "./TableVisualizer.exports";
import { useContextTables } from "@/context/Provider";
import TableCard from "./TableCards";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const TableVisualizer = forwardRef<HTMLDivElement>((_, ref) => {
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [lines, setLines] = useState<JSX.Element[]>([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const { tables } = useContextTables();
  const {
    isOpen: isSidebarTableDetailsOpen,
    onOpen: onOpenSidebarTableDetails,
    onClose: onCloseSidebarTableDetails,
  } = useModalHook();

  const handleDrag = (tableName: string, data: { x: number; y: number }) => {
    setPositions((prev) => ({
      ...prev,
      [tableName]: { x: data.x, y: data.y },
    }));
  };

  const getTableRect = (tableName: string): TableRect => {
    const pos = positions[tableName] || { x: 0, y: 0 };
    return {
      name: tableName,
      x: pos.x,
      y: pos.y,
      width: 256, // Assuming card width is 256px (w-64)
      height: 200, // Approximating the height of the card
    };
  };

  const getConnectionPoints = (
    sourceRect: TableRect,
    targetRect: TableRect
  ): { start: { x: number; y: number }; end: { x: number; y: number } } => {
    const sourceCenter = {
      x: sourceRect.x + sourceRect.width / 2,
      y: sourceRect.y + sourceRect.height / 2,
    };
    const targetCenter = {
      x: targetRect.x + targetRect.width / 2,
      y: targetRect.y + targetRect.height / 2,
    };

    return { start: sourceCenter, end: targetCenter };
  };

  useEffect(() => {
    const drawRelationshipLines = () => {
      const newLines: JSX.Element[] = [];

      tables?.tables?.forEach((sourceTable) => {
        sourceTable.relationships?.forEach((relatedTableName) => {
          const targetTable = tables.tables?.find(
            (table) => table.name === relatedTableName
          );

          if (!targetTable) return;

          const sourceRect = getTableRect(sourceTable.name);
          const targetRect = getTableRect(relatedTableName);

          const { start, end } = getConnectionPoints(sourceRect, targetRect);

          newLines.push(
            <path
              key={`${sourceTable.name}-${relatedTableName}`}
              d={`M${start.x},${start.y} L${end.x},${end.y}`}
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
            />
          );
        });
      });

      setLines(newLines);
    };

    drawRelationshipLines();
  }, [tables, positions]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  const onSelectTable = (table:any) => {
    setSelectedTable(table);
    onOpenSidebarTableDetails();
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-[calc(100vh-64px)] overflow-auto bg-gray-700 bg-[radial-gradient(circle,_#61dafb_1px,_transparent_1px)] bg-[length:20px_20px]"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines}
      </svg>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`,
        }}
      >
        {tables?.tables?.map((table) => (
          <TableCard
            key={table.name}
            table={table}
            position={positions[table.name] || { x: 0, y: 0 }}
            onDrag={handleDrag}
            onDoubleClick={() => onSelectTable(table)}
          />
        ))}
      </div>
      <TableDetails
        isOpen={isSidebarTableDetailsOpen}
        onClose={onCloseSidebarTableDetails}
        selectedTable={selectedTable}
      />
      <div className="fixed bottom-8 right-8 flex space-x-2 z-10">
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export default TableVisualizer;
