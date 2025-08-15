import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { pdfProcessor } from '@/lib/pdf-utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFilesSelected,
  multiple = false,
  accept = '.pdf',
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
  disabled = false,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = useCallback((files: File[]) => {
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      if (!pdfProcessor.validatePDFFile(file)) {
        validationErrors.push(`${file.name} is not a valid PDF file`);
        return;
      }

      if (file.size > maxSize) {
        validationErrors.push(`${file.name} is too large (max ${pdfProcessor.formatFileSize(maxSize)})`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, validationErrors };
  }, [maxSize]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const { validFiles, validationErrors } = validateFiles(acceptedFiles);
    
    setErrors(validationErrors);
    
    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [selectedFiles, multiple, onFilesSelected, validateFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple,
    disabled,
    maxSize,
  });

  const removeFile = useCallback((fileToRemove: File) => {
    const newFiles = selectedFiles.filter(file => file !== fileToRemove);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    setErrors([]);
    onFilesSelected([]);
  }, [onFilesSelected]);

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-all duration-300 p-8",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        data-testid="file-upload-dropzone"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
          )}>
            <Upload className={cn("w-8 h-8", isDragActive && "animate-bounce")} />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragActive ? "Drop PDF files here" : "Drop PDF files here or click to upload"}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4">
            {multiple ? "Choose multiple files" : "Choose from your computer"}
            <br />
            Max size: {pdfProcessor.formatFileSize(maxSize)}
          </p>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            data-testid="file-upload-button"
          >
            Select Files
          </Button>
        </div>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Upload Errors</span>
          </div>
          <ul className="space-y-1 text-sm text-destructive">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">
              Selected Files ({selectedFiles.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFiles}
              data-testid="clear-all-files"
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                data-testid={`selected-file-${index}`}
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pdfProcessor.formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  data-testid={`remove-file-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
