import React, { createContext, useContext, useState } from "react";
import { Tables } from "@/componentes/TableVisualizer.exports";

interface MyContextType {
  tables: Tables | undefined;
  setTables: React.Dispatch<React.SetStateAction<Tables | undefined>>;
}

export const myContext = createContext<MyContextType | undefined>(undefined);

export const useContextTables = () => {
  const context = useContext(myContext);
  if (!context) {
    throw new Error("useMyContext debe usarse dentro de un MyProvider");
  }
  return context;
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tables, setTables] = useState<Tables | undefined>(undefined);

  return (
    <myContext.Provider value={{ tables, setTables }}>
      {children}
    </myContext.Provider>
  );
};
