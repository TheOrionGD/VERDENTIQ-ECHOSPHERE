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
        'inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors whitespace-nowrap backdrop-blur-xs',
        size === 'xs' ? 'px-2 py-0.2 text-[10px] font-semibold' : 'px-2.5 py-0.5 text-[11px] font-medium',
        variant === 'emerald' &&
          'bg-emerald-100/70 text-[#064E3B] border border-emerald-300/60 font-semibold',
        variant === 'amber' &&
          'bg-amber-100/70 text-amber-900 border border-amber-300/60 font-semibold',
        (variant === 'coral' || variant === 'rose') &&
          'bg-rose-100/70 text-rose-900 border border-rose-300/60 font-semibold',
        variant === 'stone' &&
          'bg-white/60 text-[#064E3B] border border-white/80 font-semibold',
        variant === 'neutral' &&
          'bg-[#064E3B] text-white border border-emerald-800 font-semibold',
        variant === 'outline' &&
          'bg-transparent text-[#064E3B] border border-[#064E3B]/30',
        variant === 'blue' &&
          'bg-blue-100/80 text-blue-900 border border-blue-300/60 font-semibold',
        variant === 'teal' &&
          'bg-teal-100/80 text-teal-900 border border-teal-300/60 font-semibold',
        variant === 'orange' &&
          'bg-orange-100/80 text-orange-900 border border-orange-300/60 font-semibold',
        variant === 'lime' &&
          'bg-lime-100/80 text-lime-900 border border-lime-300/60 font-semibold',
        variant === 'pink' &&
          'bg-pink-100/80 text-pink-900 border border-pink-300/60 font-semibold',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full animate-soft-pulse',
            variant === 'emerald' && 'bg-emerald-600',
            variant === 'amber' && 'bg-amber-600',
            variant === 'coral' && 'bg-rose-600',
            variant === 'stone' && 'bg-stone-600',
            variant === 'neutral' && 'bg-emerald-400',
            variant === 'outline' && 'bg-stone-500'
          )}
        />
      )}
      {children}
    </div>
  );
};
