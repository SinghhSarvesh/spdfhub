import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Download, Loader2 } from 'lucide-react';
import type { FileProcessingStatus } from '@shared/schema';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: FileProcessingStatus;
  progress: number;
  operation: string;
  error?: string | null;
  onDownload?: () => void;
  onRetry?: () => void;
}

export function ProgressModal({
  isOpen,
  onClose,
  status,
  progress,
  operation,
  error,
  onDownload,
  onRetry,
}: ProgressModalProps) {
  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading files...';
      case 'processing':
        return `Processing your PDF${operation ? ` (${operation})` : ''}...`;
      case 'completed':
        return 'Processing completed successfully!';
      case 'error':
        return 'Processing failed';
      default:
        return 'Preparing...';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-success" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-destructive" />;
      default:
        return <Loader2 className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        data-testid="progress-modal"
      >
        <div className="flex flex-col items-center text-center p-6">
          {/* Status Icon */}
          <div className="mb-6" data-testid="status-icon">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="status-message">
            {getStatusMessage()}
          </h3>

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-sm mb-4" data-testid="error-message">
              {error}
            </p>
          )}

          {/* Progress Bar */}
          {(status === 'uploading' || status === 'processing') && (
            <div className="w-full mb-6" data-testid="progress-container">
              <Progress 
                value={progress} 
                className="w-full h-3"
                data-testid="progress-bar"
              />
              <p className="text-sm text-muted-foreground mt-2" data-testid="progress-text">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {status === 'completed' && onDownload && (
              <Button
                onClick={onDownload}
                className="flex-1"
                data-testid="download-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}

            {status === 'error' && onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                className="flex-1"
                data-testid="retry-button"
              >
                Try Again
              </Button>
            )}

            <Button
              onClick={onClose}
              variant={status === 'completed' ? 'outline' : 'default'}
              className={status === 'completed' ? 'flex-1' : 'w-full'}
              data-testid="close-button"
            >
              {status === 'completed' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
