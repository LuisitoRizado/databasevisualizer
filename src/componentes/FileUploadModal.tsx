"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCreateQuery } from "@/hooks/useCreateQuery";
import Spinner from "@/components/ui/spinner";
type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FileUploadModal({
  isOpen,
  onClose,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, onCreateQuery } = useCreateQuery();
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (
        selectedFile.name.endsWith(".sql") ||
        selectedFile.name.endsWith(".txt")
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Por favor, selecciona un archivo .sql o .txt");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const sqlSentence = event.target?.result as string;
        onCreateQuery(sqlSentence);
      };

      reader.onerror = () => {
        setError("Error al leer el archivo. Inténtalo de nuevo.");
      };

      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] p-5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Subir Archivo
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 py-4">
            <div
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors ${
                isDragging ? "border-primary bg-primary/10" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload
                  className={`w-12 h-12 mb-4 text-gray-500 transition-transform ${
                    file ? "text-primary scale-110" : "animate-bounce"
                  }`}
                />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">.SQL o .TXT (Max. 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept=".sql,.txt"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
              >
                Seleccionar archivo
              </Label>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {file && (
              <Alert variant="default" className="bg-primary/10 border-primary">
                <Upload className="h-4 w-4 text-primary" />
                <AlertTitle>Archivo seleccionado</AlertTitle>
                <AlertDescription>{file.name}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Subir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
