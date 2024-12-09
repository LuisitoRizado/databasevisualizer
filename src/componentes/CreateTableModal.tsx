import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Column } from "@/types/tableTypes.exports";
import { useCreateQuery } from "@/hooks/useCreateQuery";

type CreateTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTableModal({
  isOpen,
  onClose,
}: CreateTableModalProps) {
  const [tableName, setTableName] = useState("");
  const [messageError, setMessageError] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    {
      name: "",
      type: "INT",
      length: "",
      nullable: false,
      isPrimaryKey: true,
      isForeignKey: false,
      isAutoIncrement: true,
    },
  ]);
  const [sqlScript, setSqlScript] = useState("");
  const { onCreateQuery } = useCreateQuery();

  const generateSqlScript = () => {
    if (!tableName) {
      setSqlScript("");
      return;
    }

    let script = `CREATE TABLE ${tableName} (\n`;
    const foreignKeys: string[] = [];

    columns.forEach((column, index) => {
      script += `  ${column.name} ${column.type}`;
      if (column.length) script += `(${column.length})`;
      if (index === 0 && column.isAutoIncrement) script += " AUTO_INCREMENT";
      if (index === 0) script += " PRIMARY KEY";
      if (!column.nullable) script += " NOT NULL";
      if (
        column.isForeignKey &&
        column.referencedTable &&
        column.referencedColumn
      ) {
        foreignKeys.push(
          `  FOREIGN KEY (${column.name}) REFERENCES ${column.referencedTable}(${column.referencedColumn})`
        );
      }
      if (index < columns.length - 1 || foreignKeys.length > 0) script += ",";
      script += "\n";
    });

    if (foreignKeys.length > 0) {
      script += foreignKeys.join(",\n") + "\n";
    }

    script += ");";
    setSqlScript(script);
  };

  useEffect(() => {
    generateSqlScript();
  }, [tableName, columns, generateSqlScript]);

  const addColumn = useCallback(() => {
    setColumns([
      ...columns,
      {
        name: "",
        type: "VARCHAR",
        length: "",
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        isAutoIncrement: false,
      },
    ]);
  }, [columns]);

  const removeColumn = useCallback(
    (index: number) => {
      if (index === 0) {
        setMessageError("Cannot remove the primary key column");
        return;
      }
      setColumns(columns.filter((_, i) => i !== index));
    },
    [columns]
  );

  const updateColumn = (
    index: number,
    field: keyof Column,
    value: string | boolean
  ) => {
    const newColumns = [...columns];
    switch (field) {
      case "name":
      case "length":
      case "referencedTable":
      case "referencedColumn":
        if (typeof value === "string") {
          newColumns[index][field] = value;
        }
        break;

      case "nullable":
      case "isPrimaryKey":
      case "isForeignKey":
      case "isAutoIncrement":
        if (typeof value === "boolean") {
          newColumns[index][field] = value;
        }
        break;

      case "type":
        if (typeof value === "string") {
          newColumns[index][field] = value;
          if (index === 0 && !["INT", "UUID"].includes(value)) {
            newColumns[index].type = "INT";
          }
        }
        break;

      default:
        break;
    }

    if (index === 0) {
      newColumns[0].isPrimaryKey = true;
      newColumns[0].nullable = false;
    }

    setColumns(newColumns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageError) {
      await onCreateQuery(sqlScript);
      onClose();
    }
  };

  const onChangeTableName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTableName = e.target.value.trim();
    if (newTableName.includes(" ")) {
      setMessageError("No se permiten espacios para el nombre");
      return;
    }
    setTableName(newTableName);
    setMessageError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          {messageError && (
            <p className="text-red-800 text-bold mt-2">{messageError}</p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={onChangeTableName}
            />
          </div>
          <div>
            <Label>Columns</Label>
            {columns.map((column, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Column name"
                  value={column.name}
                  onChange={(e) => updateColumn(index, "name", e.target.value)}
                  required
                />
                <Select
                  value={column.type}
                  onValueChange={(value) => updateColumn(index, "type", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INT">INT</SelectItem>
                    <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                    <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                    <SelectItem value="DATE">DATE</SelectItem>
                    <SelectItem value="UUID">UUID</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Length"
                  value={column.length}
                  onChange={(e) =>
                    updateColumn(index, "length", e.target.value)
                  }
                  className="w-20"
                />
                <div className="flex items-center">
                  <Checkbox
                    id={`primaryKey-${index}`}
                    checked={column.isPrimaryKey}
                    onCheckedChange={(checked) =>
                      updateColumn(index, "isPrimaryKey", checked as boolean)
                    }
                    disabled={index === 0}
                  />
                  <Label htmlFor={`primaryKey-${index}`} className="ml-2 mr-2">
                    PK
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={`autoIncrement-${index}`}
                    checked={column.isAutoIncrement}
                    onCheckedChange={(checked) =>
                      updateColumn(index, "isAutoIncrement", checked as boolean)
                    }
                    disabled={index !== 0}
                  />
                  <Label
                    htmlFor={`autoIncrement-${index}`}
                    className="ml-2 mr-2"
                  >
                    AI
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id={`foreignKey-${index}`}
                    checked={column.isForeignKey}
                    onCheckedChange={(checked) =>
                      updateColumn(index, "isForeignKey", checked as boolean)
                    }
                  />
                  <Label htmlFor={`foreignKey-${index}`} className="ml-2 mr-2">
                    FK
                  </Label>
                </div>
                <div className="flex items-center">
                  <Label htmlFor={`nullable-${index}`} className="mr-2">
                    Nullable
                  </Label>
                  <Switch
                    id={`nullable-${index}`}
                    checked={column.nullable}
                    onCheckedChange={(checked) =>
                      updateColumn(index, "nullable", checked)
                    }
                    disabled={index === 0}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColumn(index)}
                  disabled={index === 0}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addColumn}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Column
            </Button>
          </div>
          <div>
            <Label>Generated SQL Script</Label>
            <pre className="bg-gray-100 p-2 rounded">{sqlScript}</pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Table</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
