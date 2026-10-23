import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMorphism, MorphismStyle } from '@/context/MorphismContext';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'coral' | 'rose' | 'amber' | 'emerald' | 'outline' | 'glass' | 'danger';
  styleVariant?: MorphismStyle;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      styleVariant,
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    let roleMorphismBtnClass = '';
    try {
      const { resolveComponentStyle } = useMorphism();
      // If variant is danger or rose, apply neubrutalism for high impact clarity
      const effectiveStyle = (variant === 'danger' || variant === 'rose') ? 'neubrutalism' : styleVariant;
      roleMorphismBtnClass = resolveComponentStyle('button', effectiveStyle);
    } catch {
      // Fallback if rendered outside MorphismProvider
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap font-medium text-xs tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none',
          
          // Role-aware Morphism base class (if available and not ghost/outline)
          (variant === 'primary' || variant === 'secondary' || variant === 'danger') && roleMorphismBtnClass
            ? roleMorphismBtnClass
            : null,

          // VerdantIQ Standard Fallback Variants
          variant === 'primary' && !roleMorphismBtnClass &&
            'bg-[var(--win-accent-primary,#10b981)] text-white hover:opacity-90 shadow-xs border border-white/20 rounded-xl',
          variant === 'glass' &&
            'win11-mica-surface text-stone-100 hover:bg-white/10 shadow-xs rounded-xl',
          variant === 'secondary' && !roleMorphismBtnClass &&
            'bg-slate-800/80 text-slate-100 hover:bg-slate-800 border border-white/10 shadow-xs rounded-xl',
          variant === 'ghost' &&
            'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white rounded-xl',
          variant === 'outline' &&
            'border border-slate-700 text-slate-200 hover:bg-white/10 rounded-xl',
          (variant === 'coral' || variant === 'rose' || variant === 'danger') && !roleMorphismBtnClass &&
            'bg-rose-600 text-white hover:bg-rose-700 shadow-xs border border-white/20 rounded-xl',
          variant === 'amber' &&
            'bg-amber-600 text-white hover:bg-amber-700 shadow-xs border border-white/20 rounded-xl',
          variant === 'emerald' &&
            'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs border border-white/20 rounded-xl',

          // Sizes
          size === 'xs' && 'h-6 px-2 text-[10px] rounded-md',
          size === 'sm' && 'h-7 px-3 text-[11px] rounded-lg',
          size === 'md' && 'h-8 px-3.5 text-xs rounded-xl',
          size === 'lg' && 'h-10 px-5 text-sm rounded-xl',
          size === 'icon' && 'h-8 w-8 p-0 rounded-lg',

          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-3.5 w-3.5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
