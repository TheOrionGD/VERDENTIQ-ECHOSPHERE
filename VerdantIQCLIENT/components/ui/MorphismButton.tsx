'use client';

import React from 'react';
import { useMorphism, MorphismStyle } from '@/context/MorphismContext';
import { cn } from '@/lib/utils';

export interface MorphismButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  styleVariant?: MorphismStyle;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const MorphismButton: React.FC<MorphismButtonProps> = ({
  variant = 'primary',
  styleVariant,
  size = 'md',
  className,
  children,
  ...props
}) => {
  const { resolveComponentStyle } = useMorphism();

  // If danger variant, automatically morph to Neubrutalism for critical incident clarity
  const effectiveStyle = variant === 'danger' ? 'neubrutalism' : styleVariant;
  const baseMorphism = resolveComponentStyle('button', effectiveStyle);

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-5 py-2 text-sm',
  }[size];

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all select-none',
        baseMorphism,
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default MorphismButton;
