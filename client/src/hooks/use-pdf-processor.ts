import { useState, useCallback } from 'react';
import { pdfProcessor } from '@/lib/pdf-utils';
import type { FileProcessingStatus, ProcessingResult } from '@shared/schema';

export interface UsePDFProcessorOptions {
  onSuccess?: (result: ProcessingResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export function usePDFProcessor(options: UsePDFProcessorOptions = {}) {
  const [status, setStatus] = useState<FileProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const updateProgress = useCallback((value: number) => {
    setProgress(value);
    options.onProgress?.(value);
  }, [options]);

  const resetState = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const processFiles = useCallback(async (
    operation: string,
    files: File[],
    operationOptions?: any
  ) => {
    try {
      setStatus('processing');
      setError(null);
      updateProgress(10);

      let processedData: Uint8Array | Uint8Array[];
      let fileName: string;

      switch (operation) {
        case 'merge':
          processedData = await pdfProcessor.mergePDFs(files);
          fileName = 'merged-document.pdf';
          break;

        case 'split':
          if (!operationOptions?.ranges) {
            throw new Error('Split ranges are required');
          }
          processedData = await pdfProcessor.splitPDF(files[0], operationOptions.ranges);
          fileName = 'split-documents.pdf';
          break;

        case 'compress':
          processedData = await pdfProcessor.compressPDF(files[0], operationOptions?.level);
          fileName = `compressed-${files[0].name}`;
          break;

        case 'watermark':
          if (!operationOptions?.text) {
            throw new Error('Watermark text is required');
          }
          processedData = await pdfProcessor.addWatermark(
            files[0], 
            operationOptions.text,
            operationOptions
          );
          fileName = `watermarked-${files[0].name}`;
          break;

        case 'rotate':
          processedData = await pdfProcessor.rotatePDF(files[0], operationOptions?.angle || 90);
          fileName = `rotated-${files[0].name}`;
          break;

        case 'protect':
          if (!operationOptions?.password) {
            throw new Error('Password is required');
          }
          processedData = await pdfProcessor.protectPDF(files[0], operationOptions.password);
          fileName = `protected-${files[0].name}`;
          break;

        case 'extract':
          processedData = await pdfProcessor.extractPageRange(
            files[0],
            operationOptions?.startPage || 1,
            operationOptions?.endPage || 1
          );
          fileName = `extracted-pages-${files[0].name}`;
          break;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      updateProgress(90);

      const resultData: ProcessingResult = {
        success: true,
        data: Array.isArray(processedData) ? processedData[0] : processedData,
        fileName,
      };

      setResult(resultData);
      setStatus('completed');
      updateProgress(100);
      
      options.onSuccess?.(resultData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMessage);
      setStatus('error');
      options.onError?.(errorMessage);
    }
  }, [updateProgress, options]);

  const downloadResult = useCallback(() => {
    if (!result || !result.data) return;

    const blob = new Blob([result.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.fileName || 'processed-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result]);

  return {
    status,
    progress,
    error,
    result,
    processFiles,
    downloadResult,
    resetState,
  };
}
