import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PDFTool } from '@shared/schema';

interface ToolCardProps {
  tool: PDFTool;
  onClick: (toolId: string) => void;
  className?: string;
}

export function ToolCard({ tool, onClick, className }: ToolCardProps) {
  const getGradientClass = (color: string) => {
    const gradients = {
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
      yellow: 'from-yellow-500 to-yellow-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600',
      cyan: 'from-cyan-500 to-cyan-600',
      emerald: 'from-emerald-500 to-emerald-600',
      primary: 'from-primary to-primary-dark',
      secondary: 'from-secondary to-pink-600',
    };
    return gradients[color as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  const getTextColorClass = (color: string) => {
    const textColors = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      yellow: 'text-yellow-600',
      orange: 'text-orange-600',
      teal: 'text-teal-600',
      cyan: 'text-cyan-600',
      emerald: 'text-emerald-600',
      primary: 'text-primary',
      secondary: 'text-secondary',
    };
    return textColors[color as keyof typeof textColors] || 'text-gray-600';
  };

  const getBgColorClass = (color: string) => {
    const bgColors = {
      red: 'bg-red-50 hover:bg-red-100',
      blue: 'bg-blue-50 hover:bg-blue-100',
      green: 'bg-green-50 hover:bg-green-100',
      purple: 'bg-purple-50 hover:bg-purple-100',
      indigo: 'bg-indigo-50 hover:bg-indigo-100',
      yellow: 'bg-yellow-50 hover:bg-yellow-100',
      orange: 'bg-orange-50 hover:bg-orange-100',
      teal: 'bg-teal-50 hover:bg-teal-100',
      cyan: 'bg-cyan-50 hover:bg-cyan-100',
      emerald: 'bg-emerald-50 hover:bg-emerald-100',
      primary: 'bg-primary/10 hover:bg-primary/20',
      secondary: 'bg-secondary/10 hover:bg-secondary/20',
    };
    return bgColors[color as keyof typeof bgColors] || 'bg-gray-50 hover:bg-gray-100';
  };

  return (
    <Card 
      className={cn(
        "tool-card relative group cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100",
        className
      )}
      onClick={() => onClick(tool.id)}
      data-testid={`tool-card-${tool.id}`}
    >
      <CardContent className="p-6">
        {/* New Badge */}
        {tool.isNew && (
          <Badge 
            className="absolute top-4 right-4 bg-gradient-to-r from-accent to-orange-500 text-white border-0"
            data-testid="new-badge"
          >
            NEW
          </Badge>
        )}

        {/* Premium Badge */}
        {tool.isPremium && (
          <Badge 
            variant="outline" 
            className="absolute top-4 right-4 border-amber-400 text-amber-600"
            data-testid="premium-badge"
          >
            PRO
          </Badge>
        )}

        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
          getGradientClass(tool.color)
        )}>
          <i className={cn("text-white text-lg", tool.icon)} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* Action Button */}
        <Button
          className={cn(
            "w-full font-medium transition-colors",
            getBgColorClass(tool.color),
            getTextColorClass(tool.color)
          )}
          variant="ghost"
          data-testid={`tool-button-${tool.id}`}
        >
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
}
