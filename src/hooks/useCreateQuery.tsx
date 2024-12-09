import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { parseSqlResponseToTableData } from "@/componentes/SqlEditor.exports";
import { useContextTables } from "@/context/Provider";

type UseCreateQueryHook = {
  isLoading: boolean;
  onCreateQuery: (sqlQuery: string) => Promise<void>;
};

export const useCreateQuery = (): UseCreateQueryHook => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setTables } = useContextTables();

  const onCreateQuery = useCallback(async (sqlQuery: string) => {
    setIsLoading(true);

    if (!sqlQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La sentencia está vacía",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://databaseonlyvisualizer-api.vercel.app/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sqlSentence: sqlQuery,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const tables = parseSqlResponseToTableData(data);

        setTables((prev) => {
          const existingTables = prev?.tables || [];

          tables.forEach((table) => {
            if (
              existingTables.some((tableItem) => tableItem.name === table.name)
            ) {
              toast({
                variant: "destructive",
                title: "Error",
                description: `Ya existe una tabla con nombre ${table.name}`,
              });
            } else {
              existingTables.push(table);
            }
          });

          return {
            ...prev,
            tables: [...existingTables],
          };
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Hubo un problema al procesar tu solicitud, verifica que tu sentencia sea correcta.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud." + error,
      });
    }

    setIsLoading(false);
  }, []);

  return { isLoading, onCreateQuery };
};
