import { Tables } from "./TableVisualizer.exports";

export const parseSqlResponseToTableData = (data: any) => {
  if (!Array.isArray(data)) {
    throw new Error("La respuesta no tiene el formato esperado.");
  }

  return data.map((tableData) => {
    const tableName = tableData?.table?.[0]?.table;
    if (!tableName) {
      throw new Error("No se encontró un nombre de tabla en la respuesta.");
    }

    const tablesRelation = tableData.create_definitions
      ?.filter((def: any) => def.constraint_type === "FOREIGN KEY") // Filtrar solo FOREIGN KEY
      .flatMap((def: any) =>
        def.reference_definition?.table?.map(
          (tableName: any) => tableName.table
        )
      )
      .filter(Boolean);

    console.log("relaciones : ", tablesRelation);
    const columns = tableData?.create_definitions
      ?.filter((def: any) => def.resource === "column")
      ?.map((columnDef: any) => {
        const columnName = columnDef?.column?.column;
        const dataType = columnDef?.definition?.dataType;
        const length = columnDef?.definition?.length || null;
        const nullable =
          columnDef?.nullable?.value === "not null" ? false : true;
        const isPrimaryKey = columnDef?.primary_key ? true : false;
        const isAutoIncrement = columnDef?.auto_increment ? true : false;
        const isUnique = columnDef?.unique ? true : false;
        const defaultValue =
          columnDef?.default_val?.value?.name?.[0]?.value || null;

        if (!columnName || !dataType) {
          throw new Error("La definición de columna no es válida.");
        }

        return {
          name: columnName,
          type: dataType,
          length,
          nullable,
          isPrimaryKey,
          isAutoIncrement,
          isUnique,
          defaultValue,
        };
      });

    if (!columns || columns.length === 0) {
      throw new Error(
        `No se encontraron columnas válidas para la tabla ${tableName}.`
      );
    }

    return {
      name: tableName,
      columns,
      relationships: tablesRelation,
    };
  });
};

export const isThereAnotherTableWithSameName = (
  tableName: string,
  tables: Tables | undefined
): boolean => {
  if (!tableName.trim() || !tables?.tables?.length) {
    return false;
  }

  return tables.tables.some((tableItem) => tableItem.name === tableName);
};
