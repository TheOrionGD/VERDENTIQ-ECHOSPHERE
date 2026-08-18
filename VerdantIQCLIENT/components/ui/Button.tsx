import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'coral' | 'rose' | 'amber' | 'emerald' | 'outline' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium text-xs tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.97] font-sf select-none',
          
          // VerdantIQ System Variants
          variant === 'primary' &&
            'bg-[var(--mac-accent-primary,#064e3b)] text-white hover:opacity-90 shadow-xs border border-white/20',
          variant === 'glass' &&
            'macos-liquid-glass text-stone-900 dark:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800/80 shadow-xs',
          variant === 'secondary' &&
            'bg-stone-200/60 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 border border-white/40 dark:border-white/10 shadow-xs',
          variant === 'ghost' &&
            'bg-transparent text-stone-800 dark:text-stone-200 hover:bg-stone-900/10 dark:hover:bg-stone-100/10',
          variant === 'outline' &&
            'border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-white/50 dark:hover:bg-stone-800/50',
          (variant === 'coral' || variant === 'rose') &&
            'bg-rose-600 text-white hover:bg-rose-700 shadow-xs border border-white/20',
          variant === 'amber' &&
            'bg-amber-600 text-white hover:bg-amber-700 shadow-xs border border-white/20',
          variant === 'emerald' &&
            'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs border border-white/20',

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
