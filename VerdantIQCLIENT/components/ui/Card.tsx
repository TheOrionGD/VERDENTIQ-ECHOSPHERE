import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMorphism, MorphismStyle, GlassMaterialLevel } from '@/context/MorphismContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'glow' | 'dark' | 'glass';
  styleVariant?: MorphismStyle;
  glassLevel?: GlassMaterialLevel;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', styleVariant, glassLevel, ...props }, ref) => {
    let morphismClasses = '';
    let glassClass = '';
    
    try {
      // Polymorphically resolve active style and material based on role or explicit override
      const { resolveComponentStyle, getGlassMaterial } = useMorphism();
      morphismClasses = resolveComponentStyle('panel', styleVariant);
      if (glassLevel) {
        glassClass = getGlassMaterial(glassLevel);
      }
    } catch {
      // Fallback if rendered outside MorphismProvider
    }

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200 select-none text-slate-100',
          morphismClasses || 'rounded-xl',
          glassClass,
          variant === 'default' &&
            !morphismClasses && 'win11-acrylic-surface text-slate-100 hover:shadow-md rounded-2xl border border-slate-800',
          variant === 'glass' &&
            !morphismClasses && 'win11-mica-surface text-slate-100 rounded-2xl border border-slate-800',
          variant === 'flat' &&
            !morphismClasses && 'morphism-flat-panel rounded-lg text-slate-100 border border-slate-800',
          variant === 'glow' &&
            'shadow-[0_0_25px_rgba(16,185,129,0.22)] border border-emerald-500/30 text-slate-100',
          variant === 'dark' &&
            'border-slate-800 bg-slate-900/90 text-white shadow-xl',
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
      'font-bold text-base tracking-tight text-slate-100 font-segoe',
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
    className={cn('text-xs text-slate-400 leading-relaxed font-segoe', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0 font-segoe', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0 border-t border-slate-800/80 mt-3 pt-3 font-segoe', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
