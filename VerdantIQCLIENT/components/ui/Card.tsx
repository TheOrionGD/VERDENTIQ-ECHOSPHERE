import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'glow' | 'dark' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200 font-sf select-none',
          variant === 'default' &&
            'glass-card text-stone-900 dark:text-stone-100 hover:shadow-md',
          variant === 'glass' &&
            'macos-liquid-glass text-stone-900 dark:text-stone-100',
          variant === 'flat' &&
            'bg-white/40 dark:bg-stone-900/40 border border-white/60 dark:border-white/10 backdrop-blur-sm',
          variant === 'glow' &&
            'border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md shadow-lg shadow-emerald-950/10 text-stone-900 dark:text-stone-100',
          variant === 'dark' &&
            'border-white/10 bg-stone-900 text-white shadow-xl',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-bold text-base tracking-tight text-stone-900 dark:text-stone-100 font-sf',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sf', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0 font-sf', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0 border-t border-stone-200/50 dark:border-stone-800/50 mt-3 pt-3 font-sf', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
