import React from 'react';
import { cn } from '@/lib/utils';
import { Leaf, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Telemetry Data Available',
  description = 'No matching environmental records or metrics were located for this filter parameter.',
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-stone-300/80 bg-stone-50/50',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-900 mb-3 shadow-xs">
        {icon || <Leaf className="h-6 w-6" />}
      </div>
      <h3 className="font-editorial text-base font-semibold text-stone-900 mb-1">
        {title}
      </h3>
      <p className="text-xs text-stone-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
