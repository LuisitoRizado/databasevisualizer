import { useState } from "react";
import { Rnd } from "react-rnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Key, Hash, Clock, Trash2, CaseSensitive } from 'lucide-react';
import { Column } from "@/types/tableTypes.exports";

interface TableCardProps {
  table: {
    name: string;
    columns: Column[];
  };
  position: { x: number; y: number };
  onDrag: (name: string, data: { x: number; y: number }) => void;
  onDoubleClick?: () => void;
}

export default function TableCard({
  table,
  position,
  onDrag,
  onDoubleClick,
}: TableCardProps) {
  const [dimensions, setDimensions] = useState({ width: 250, height: 200 });

  const getColumnIcon = (column: Column) => {
    if (column.isPrimaryKey || column.isForeignKey) {
      return <Key className="h-4 w-4 text-blue-500" />;
    }
    if (column.type === "DATE") {
      return <Clock className="h-4 w-4 text-gray-500" />;
    }
    if (["INT", "DECIMAL", "FLOAT", "NUMBER"].includes(column.type)) {
      return <Hash className="h-4 w-4 text-gray-500" />;
    }
    if (column.type === "BOOLEAN") {
      return <Trash2 className="h-4 w-4 text-gray-500" />;
    }
    if(column.type === "VARCHAR")
      return <CaseSensitive className="h-4 w-4 text-gray-500" />
    return null;
  };

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(_, d) => {
        onDrag(table.name, { x: d.x, y: d.y });
      }}
      onResize={(_, direction, ref) => {
        setDimensions({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
      minWidth={250}
      minHeight={200}
      bounds="parent"
    >
      <Card 
        className="w-full h-full shadow-lg overflow-hidden border-0 p-1"
        onDoubleClick={onDoubleClick}
      >
        <CardHeader className="py-2 bg-blue-500 w-full">
          <CardTitle className="text-sm font-medium text-white">
            {table.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto" style={{ height: 'calc(100% - 40px)' }}>
          <Table>
            <TableBody>
              {table.columns
                .sort((a, b) => {
                  if (a.isPrimaryKey) return -1;
                  if (b.isPrimaryKey) return 1;
                  if (a.isForeignKey) return -1;
                  if (b.isForeignKey) return 1;
                  return 0;
                })
                .map((column) => (
                  <TableRow 
                    key={column.name}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="py-1 pl-2">
                      <div className="flex items-center gap-2">
                        {getColumnIcon(column)}
                        <span className="text-sm text-gray-700">
                          {column.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <span className="text-xs text-gray-500">
                        {column.type.toLowerCase()}
                        {column.length && `(${column.length})`}
                        {!column.nullable && ` nn`}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Rnd>
  );
}

