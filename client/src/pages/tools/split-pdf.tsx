import React, { useState, useCallback } from 'react';
import { ArrowLeft, Scissors, Download } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { ProgressModal } from '@/components/ui/progress-modal';
import { usePDFProcessor } from '@/hooks/use-pdf-processor';

export default function SplitPDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges'>('pages');
  const [pageNumbers, setPageNumbers] = useState('');
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

  const handleSplit = useCallback(() => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file to split');
      return;
    }

    if (!pageNumbers.trim()) {
      alert('Please specify page numbers or ranges');
      return;
    }

    // Parse page numbers/ranges
    const ranges = pageNumbers.split(',').map(range => {
      const [start, end] = range.trim().split('-').map(num => parseInt(num.trim()));
      return { start, end: end || start };
    });

    setShowProgressModal(true);
    processFiles('split', selectedFiles, { ranges });
  }, [selectedFiles, pageNumbers, processFiles]);

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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Scissors className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Split PDF</h1>
                <p className="text-muted-foreground">Extract specific pages or ranges from PDF</p>
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
                How to split PDFs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload the PDF file you want to split</li>
                <li>Specify which pages or ranges to extract</li>
                <li>Click "Split PDF" to process</li>
                <li>Download the extracted pages as separate PDFs</li>
              </ol>
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={false}
            className="mb-8"
          />

          {/* Split Options */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Split Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Split Mode Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Split Method</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={splitMode === 'pages' ? 'default' : 'outline'}
                      onClick={() => setSplitMode('pages')}
                      data-testid="split-pages-mode"
                    >
                      Individual Pages
                    </Button>
                    <Button
                      variant={splitMode === 'ranges' ? 'default' : 'outline'}
                      onClick={() => setSplitMode('ranges')}
                      data-testid="split-ranges-mode"
                    >
                      Page Ranges
                    </Button>
                  </div>
                </div>

                {/* Page Input */}
                <div className="space-y-2">
                  <Label htmlFor="pageNumbers">
                    {splitMode === 'pages' ? 'Page Numbers' : 'Page Ranges'}
                  </Label>
                  <Input
                    id="pageNumbers"
                    placeholder={
                      splitMode === 'pages' 
                        ? "e.g., 1, 3, 5, 10" 
                        : "e.g., 1-5, 8-12, 15"
                    }
                    value={pageNumbers}
                    onChange={(e) => setPageNumbers(e.target.value)}
                    data-testid="page-numbers-input"
                  />
                  <p className="text-sm text-muted-foreground">
                    {splitMode === 'pages' 
                      ? 'Separate page numbers with commas'
                      : 'Use hyphens for ranges and commas to separate multiple ranges'
                    }
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleSplit}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!pageNumbers.trim()}
                  data-testid="split-button"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Split PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-list-ol text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Flexible Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Extract individual pages or continuous ranges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-alt text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Preserve Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Original document quality is maintained
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightning-bolt text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Quick extraction with immediate results
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
        operation="Split PDF"
        error={error}
        onDownload={downloadResult}
        onRetry={handleSplit}
      />
    </div>
  );
}
