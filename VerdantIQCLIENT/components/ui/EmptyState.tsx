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
        'flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-emerald-500/30 bg-slate-950/70 text-slate-100 backdrop-blur-md',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 mb-3 shadow-md shadow-emerald-950/40">
        {icon || <Leaf className="h-6 w-6" />}
      </div>
      <h3 className="font-editorial text-base font-bold text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
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
