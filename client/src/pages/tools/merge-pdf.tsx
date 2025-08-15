import React, { useState, useCallback } from 'react';
import { ArrowLeft, Layers, Download } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { ProgressModal } from '@/components/ui/progress-modal';
import { usePDFProcessor } from '@/hooks/use-pdf-processor';

export default function MergePDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleMerge = useCallback(() => {
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setShowProgressModal(true);
    processFiles('merge', selectedFiles);
  }, [selectedFiles, processFiles]);

  const handleCloseModal = useCallback(() => {
    setShowProgressModal(false);
    resetState();
  }, [resetState]);

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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Layers className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Merge PDF</h1>
                <p className="text-muted-foreground">Combine multiple PDFs into one document</p>
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
                How to merge PDFs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload the PDF files you want to merge</li>
                <li>Arrange them in the order you prefer</li>
                <li>Click "Merge PDFs" to combine them</li>
                <li>Download your merged PDF file</li>
              </ol>
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={true}
            className="mb-8"
          />

          {/* Action Buttons */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Ready to merge {selectedFiles.length} files
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Files will be merged in the order shown above
                    </p>
                  </div>
                  <Button
                    onClick={handleMerge}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={selectedFiles.length < 2}
                    data-testid="merge-button"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Merge PDFs
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-sort text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Custom Order</h3>
                <p className="text-sm text-muted-foreground">
                  Arrange your PDFs in any order before merging
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">
                  All processing happens locally in your browser
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Download</h3>
                <p className="text-sm text-muted-foreground">
                  Download your merged PDF immediately after processing
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
        operation="Merge PDF"
        error={error}
        onDownload={downloadResult}
        onRetry={handleMerge}
      />
    </div>
  );
}
