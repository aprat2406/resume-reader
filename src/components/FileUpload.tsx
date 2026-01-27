import { useState, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  acceptedFormats?: string[];
}

export function FileUpload({ 
  onFileSelect, 
  isLoading = false,
  acceptedFormats = [".pdf", ".doc", ".docx"]
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer group",
          "bg-card hover:bg-muted/50",
          isDragging && "border-secondary bg-secondary/5 scale-[1.02]",
          !isDragging && "border-border hover:border-secondary/50",
          isLoading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center text-center space-y-4">
          {isLoading ? (
            <>
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">Analyzing Resume...</p>
                <p className="text-sm text-muted-foreground mt-1">Generating interview questions</p>
              </div>
            </>
          ) : selectedFile ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • PDF, DOC, DOCX supported
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
