import React, { useState, useCallback } from 'react';
import { ArrowLeft, Combine, Download } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { ProgressModal } from '@/components/ui/progress-modal';
import { usePDFProcessor } from '@/hooks/use-pdf-processor';

export default function CompressPDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [showProgressModal, setShowProgressModal] = useState(false);

  const {
    status,
    progress,
    error,
    result,
    processFiles,
    downloadResult,
    resetState,
  } = usePDFProcessor();

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleCompress = useCallback(() => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file to compress');
      return;
    }

    setShowProgressModal(true);
    processFiles('compress', selectedFiles, { level: compressionLevel });
  }, [selectedFiles, compressionLevel, processFiles]);

  const handleCloseModal = useCallback(() => {
    setShowProgressModal(false);
    resetState();
  }, [resetState]);

  const compressionOptions = [
    {
      value: 'low',
      label: 'Low Compression',
      description: 'Minimal compression, best quality',
      reduction: '10-20%',
    },
    {
      value: 'medium',
      label: 'Medium Compression',
      description: 'Balanced compression and quality',
      reduction: '30-50%',
    },
    {
      value: 'high',
      label: 'High Compression',
      description: 'Maximum compression, smaller file size',
      reduction: '50-80%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="back-button">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Combine className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Combine PDF</h1>
                <p className="text-muted-foreground">Reduce file size while maintaining quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-500" />
                How to compress PDFs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload the PDF file you want to compress</li>
                <li>Choose your preferred compression level</li>
                <li>Click "Combine PDF" to process</li>
                <li>Download your optimized PDF file</li>
              </ol>
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={false}
            className="mb-8"
          />

          {/* Compression Options */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Compression Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={compressionLevel} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setCompressionLevel(value)}
                  className="space-y-4"
                >
                  {compressionOptions.map((option) => (
                    <div 
                      key={option.value}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        data-testid={`compression-${option.value}`}
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            ~{option.reduction} size reduction
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {/* Action Button */}
                <Button
                  onClick={handleCompress}
                  className="bg-green-500 hover:bg-green-600 w-full"
                  data-testid="compress-button"
                >
                  <Combine className="w-4 h-4 mr-2" />
                  Combine PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-balance-scale text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quality Balance</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the perfect balance between size and quality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Smart Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms optimize your PDF efficiently
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Safe Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Your files are processed securely and never stored
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={handleCloseModal}
        status={status}
        progress={progress}
        operation="Combine PDF"
        error={error}
        onDownload={downloadResult}
        onRetry={handleCompress}
      />
    </div>
  );
}
