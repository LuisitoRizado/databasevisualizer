export type Table = {
  id: number;
  name: string; // Nombre de la tabla
  columns: Column[]; // Array de columnas que pertenecen a la tabla
  x: number;
  y: number;
};

export type Column = {
  name: string;
  type: string;
  length: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
  referencedColumn?: string;
  isAutoIncrement?: boolean;
};

// Define un tipo para los tipos de columna
export type ColumnType =
  | "int"
  | "varchar"
  | "boolean"
  | "date" // Para manejar fechas
  | "decimal" // Para manejar números decimales
  | "text" // Para texto largo
  | "timestamp"; // Para marcas de tiempo
