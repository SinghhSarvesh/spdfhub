import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = "Loading...", 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}
      data-testid="loading-overlay"
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-xl">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Processing
        </h3>
        <p className="text-muted-foreground text-sm">
          {message}
        </p>
      </div>
    </div>
  );
}
