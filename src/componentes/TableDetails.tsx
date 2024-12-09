"use client";

import { Plus, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableData } from "./TableVisualizer.exports";

type TableDetailsProps = {
  isOpen: boolean;
  selectedTable?: TableData | null;
  onClose: () => void;
};

export const TableDetails = ({
  selectedTable,
  isOpen,
  onClose,
}: TableDetailsProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] lg:w-[680px] bg-gray-800 text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Table Details</SheetTitle>
          <SheetDescription className="text-gray-400 text-lg">
            {selectedTable
              ? selectedTable.name
              : "Select a table to view details"}
          </SheetDescription>
        </SheetHeader>
        {selectedTable ? (
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Table Name
                  </h3>
                  <p className="mt-1 text-lg">{selectedTable.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Number of Columns
                  </h3>
                  <p className="mt-1 text-lg">{selectedTable.columns.length}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Column Overview
                </h3>
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Constraints</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTable.columns.map((column, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {column.name}
                        </TableCell>
                        <TableCell>{column.type}</TableCell>
                        <TableCell>
                          {column.isPrimaryKey && (
                            <Badge className="mr-1 bg-blue-600">PK</Badge>
                          )}
                          {column.nullable === false && (
                            <Badge className="mr-1 bg-red-600">NOT NULL</Badge>
                          )}
                          {column.isPrimaryKey && (
                            <Badge className="mr-1 bg-green-600">UNIQUE</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </div>

              <Tabs defaultValue="columns" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="columns">Columns</TabsTrigger>
                  <TabsTrigger value="relations">Relations</TabsTrigger>
                </TabsList>
                <TabsContent value="columns" className="mt-4 space-y-4">
                  {selectedTable.columns.map((column, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        defaultValue={column.name}
                        className="flex-grow bg-gray-700 border-gray-600"
                      />
                      <Select defaultValue={column.type}>
                        <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="int">int</SelectItem>
                          <SelectItem value="varchar">varchar</SelectItem>
                          <SelectItem value="timestamp">timestamp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Column
                  </Button>
                </TabsContent>
                <TabsContent value="relations" className="mt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Add table options here */}
                      </SelectContent>
                    </Select>
                    <ChevronRight className="w-4 h-4" />
                    <Select>
                      <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTable.columns.map((column, index) => (
                          <SelectItem key={index} value={column.name}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Relation
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        ) : (
          <div className="mt-6 text-gray-400 flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center">
              <Info className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-lg">Select a table to view details</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
