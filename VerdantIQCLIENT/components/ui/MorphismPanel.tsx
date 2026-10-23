'use client';

import React from 'react';
import { useMorphism, MorphismStyle, GlassMaterialLevel } from '@/context/MorphismContext';
import { cn } from '@/lib/utils';

interface MorphismPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  styleVariant?: MorphismStyle;
  glassLevel?: GlassMaterialLevel;
  className?: string;
  glow?: boolean;
}

/**
 * MorphismPanel: Adaptive polymorphic container supporting all 8 design styles
 * Automatically renders Obsidian Glass for System Administrator unless overridden.
 */
export const MorphismPanel: React.FC<MorphismPanelProps> = ({
  children,
  styleVariant,
  glassLevel,
  className,
  glow = false,
  ...props
}) => {
  const { resolveComponentStyle, getGlassMaterial, isObsidianAdmin } = useMorphism();

  const baseStyle = resolveComponentStyle('panel', styleVariant);
  const glassStyle = glassLevel ? getGlassMaterial(glassLevel) : '';

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        baseStyle,
        glassStyle,
        glow && isObsidianAdmin && 'shadow-[0_0_30px_rgba(16,185,129,0.18)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const AdaptiveSurface = MorphismPanel;
export default MorphismPanel;
