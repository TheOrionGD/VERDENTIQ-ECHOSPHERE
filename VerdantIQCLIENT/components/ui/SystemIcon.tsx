import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon, LucideProps } from 'lucide-react';

/**
 * Standardized icon size tokens matching Section 4 of MASTER UI ICON REDESIGN PROMPT
 * - 12-14px: Compact metadata and dense table controls
 * - 16px: Standard inline actions, list indicators, and secondary controls
 * - 20px: Primary buttons, command palette items, and main interface controls
 * - 24px: Major navigation destinations and prominent toolbar actions
 * - 32px+: Empty states, hero callouts, and onboarding highlights
 */
export type SystemIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

export interface SystemIconProps extends Omit<LucideProps, 'size'> {
  icon: LucideIcon;
  size?: SystemIconSize;
  variant?: 'outline' | 'filled' | 'accent' | 'muted';
  className?: string;
  'aria-label'?: string;
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', { px: number; cls: string }> = {
  xs: { px: 13, cls: 'h-3.5 w-3.5' },
  sm: { px: 16, cls: 'h-4 w-4' },
  md: { px: 18, cls: 'h-[18px] w-[18px]' },
  lg: { px: 20, cls: 'h-5 w-5' },
  xl: { px: 24, cls: 'h-6 w-6' },
  '2xl': { px: 32, cls: 'h-8 w-8' },
};

/**
 * SystemIcon ensures:
 * 1. Windows 11 Fluent optical centering and uniform stroke weight (1.75 - 2px)
 * 2. Optical alignment beside Segoe UI text
 * 3. Consistent hover, active, and glassmorphism transparency states
 * 4. Intentional filled vs outline variants without layout shifting
 */
export const SystemIcon: React.FC<SystemIconProps> = ({
  icon: IconComponent,
  size = 'sm',
  variant = 'outline',
  className,
  strokeWidth,
  'aria-label': ariaLabel,
  ...props
}) => {
  const sizeConfig = typeof size === 'number' ? null : SIZE_MAP[size];
  const pixelSize = typeof size === 'number' ? size : sizeConfig?.px || 16;
  const sizeClass = sizeConfig ? sizeConfig.cls : '';

  // Standardize Windows 11 Fluent stroke weight: 1.75 for 18px-24px, 1.85 for 16px, 2 for 12-14px
  const defaultStroke = strokeWidth ?? (pixelSize <= 14 ? 2 : pixelSize <= 18 ? 1.85 : 1.75);

  const variantClass = cn(
    // Base Fluent alignment
    'shrink-0 transition-colors duration-150 inline-block align-middle select-none',
    
    // Variants
    variant === 'outline' && 'text-slate-300 group-hover:text-white',
    variant === 'filled' && 'fill-current text-emerald-400',
    variant === 'accent' && 'text-[var(--win-accent-primary,#10b981)]',
    variant === 'muted' && 'text-slate-500 group-hover:text-slate-400',
    
    sizeClass,
    className
  );

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={defaultStroke}
      className={variantClass}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      focusable={false}
      {...props}
    />
  );
};

export default SystemIcon;
