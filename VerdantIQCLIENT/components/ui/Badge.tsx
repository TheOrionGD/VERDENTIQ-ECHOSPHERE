import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emerald' | 'amber' | 'coral' | 'rose' | 'stone' | 'neutral' | 'outline' | 'blue' | 'teal' | 'orange' | 'lime' | 'pink';
  dot?: boolean;
  size?: 'xs' | 'sm' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'emerald',
  dot = false,
  size = 'default',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors whitespace-nowrap backdrop-blur-md',
        size === 'xs' ? 'px-2 py-0.2 text-[10px] font-semibold' : 'px-2.5 py-0.5 text-[11px] font-medium',
        variant === 'emerald' &&
          'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold shadow-xs',
        variant === 'amber' &&
          'bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold shadow-xs',
        (variant === 'coral' || variant === 'rose') &&
          'bg-rose-950/80 text-rose-300 border border-rose-500/40 font-semibold shadow-xs',
        variant === 'stone' &&
          'bg-slate-900/80 text-slate-200 border border-slate-700 font-semibold shadow-xs',
        variant === 'neutral' &&
          'bg-slate-900 text-slate-100 border border-slate-700 font-semibold shadow-xs',
        variant === 'outline' &&
          'bg-transparent text-emerald-400 border border-emerald-500/50',
        variant === 'blue' &&
          'bg-blue-950/80 text-blue-300 border border-blue-500/40 font-semibold shadow-xs',
        variant === 'teal' &&
          'bg-teal-950/80 text-teal-300 border border-teal-500/40 font-semibold shadow-xs',
        variant === 'orange' &&
          'bg-orange-950/80 text-orange-300 border border-orange-500/40 font-semibold shadow-xs',
        variant === 'lime' &&
          'bg-lime-950/80 text-lime-300 border border-lime-500/40 font-semibold shadow-xs',
        variant === 'pink' &&
          'bg-pink-950/80 text-pink-300 border border-pink-500/40 font-semibold shadow-xs',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full animate-soft-pulse',
            variant === 'emerald' && 'bg-emerald-400',
            variant === 'amber' && 'bg-amber-400',
            variant === 'coral' && 'bg-rose-400',
            variant === 'stone' && 'bg-slate-400',
            variant === 'neutral' && 'bg-emerald-400',
            variant === 'outline' && 'bg-slate-400'
          )}
        />
      )}
      {children}
    </div>
  );
};
