import { Column } from "@/types/tableTypes.exports";

export type TableData = {
  name: string;
  columns: Column[];
  relationships?: string[];
};

export type Tables = {
  tables?: TableData[];
};

export type TableVisualizerProps = {
  tables?: TableData[];
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TableRect = Rect & {
  name: string;
};

export type RelationType = "oneToOne" | "oneToMany" | "manyToOne";

export type Relationship = {
  table: string;
  column: string;
  relatedTable: string;
  relatedColumn: string;
  relationshipType: RelationType;
};