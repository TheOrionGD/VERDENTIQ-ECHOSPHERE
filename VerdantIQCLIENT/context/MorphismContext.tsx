'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleType } from '@/lib/services/authService';

/**
 * The 8 Core Morphism Styles supported by the Engine
 */
export type MorphismStyle =
  | 'skeuomorphism'
  | 'flat'
  | 'neumorphism'
  | 'material'
  | 'glassmorphism'
  | 'claymorphism'
  | 'neubrutalism'
  | 'polymorphism';

/**
 * Surface density options
 */
export type SurfaceDensity = 'compact' | 'comfortable' | 'spacious';

/**
 * Glass material depth levels (specifically for Obsidian & Smoked Glass)
 */
export type GlassMaterialLevel = 'subtle' | 'standard' | 'premium';

export interface MorphismProfile {
  id: string;
  role: RoleType;
  primaryStyle: MorphismStyle;
  supportingStyle: MorphismStyle;
  isObsidianGlass: boolean;
  accentGlow: string;
  surfaceClass: string;
  panelClass: string;
  buttonClass: string;
  tableClass: string;
  dialogClass: string;
  inputClass: string;
  badgeClass: string;
}

/**
 * Deterministic mapping of application roles to multi-morphism visual profiles
 * as specified in Section 6 of the Master Implementation Prompt
 */
export const ROLE_MORPHISM_PROFILES: Record<RoleType, MorphismProfile> = {
  // System / Platform Administrator: Obsidian Glassmorphism + Flat Design
  admin: {
    id: 'admin_obsidian',
    role: 'admin',
    primaryStyle: 'glassmorphism',
    supportingStyle: 'flat',
    isObsidianGlass: true,
    accentGlow: '0 0 25px rgba(16, 185, 129, 0.25)',
    surfaceClass: 'morphism-obsidian-glass',
    panelClass: 'morphism-obsidian-panel',
    buttonClass: 'morphism-obsidian-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-obsidian-dialog',
    inputClass: 'morphism-flat-input',
    badgeClass: 'morphism-obsidian-badge',
  },
  // MLOps Architect & Operations: Material Design + Glassmorphism
  mlops: {
    id: 'mlops_material',
    role: 'mlops',
    primaryStyle: 'material',
    supportingStyle: 'glassmorphism',
    isObsidianGlass: false,
    accentGlow: '0 0 20px rgba(245, 158, 11, 0.2)',
    surfaceClass: 'morphism-material-surface',
    panelClass: 'morphism-material-panel',
    buttonClass: 'morphism-material-btn',
    tableClass: 'morphism-material-table',
    dialogClass: 'morphism-glass-dialog',
    inputClass: 'morphism-material-input',
    badgeClass: 'morphism-material-badge',
  },
  // ESG Auditor & Research: Flat Design + Frosted Glassmorphism
  audit: {
    id: 'audit_flat',
    role: 'audit',
    primaryStyle: 'flat',
    supportingStyle: 'glassmorphism',
    isObsidianGlass: false,
    accentGlow: '0 0 16px rgba(100, 116, 139, 0.15)',
    surfaceClass: 'morphism-flat-surface',
    panelClass: 'morphism-flat-panel',
    buttonClass: 'morphism-flat-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-frosted-dialog',
    inputClass: 'morphism-flat-input',
    badgeClass: 'morphism-flat-badge',
  },
  // Regional District: Flat Design + Material Design
  region: {
    id: 'region_flat_material',
    role: 'region',
    primaryStyle: 'flat',
    supportingStyle: 'material',
    isObsidianGlass: false,
    accentGlow: '0 0 20px rgba(16, 185, 129, 0.2)',
    surfaceClass: 'morphism-material-surface',
    panelClass: 'morphism-material-panel',
    buttonClass: 'morphism-material-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-material-dialog',
    inputClass: 'morphism-flat-input',
    badgeClass: 'morphism-material-badge',
  },
  // Institution Admin: Material Design + Layered Glassmorphism
  institution: {
    id: 'institution_material_glass',
    role: 'institution',
    primaryStyle: 'material',
    supportingStyle: 'glassmorphism',
    isObsidianGlass: false,
    accentGlow: '0 0 20px rgba(0, 120, 212, 0.2)',
    surfaceClass: 'morphism-material-surface',
    panelClass: 'morphism-glass-panel',
    buttonClass: 'morphism-material-btn',
    tableClass: 'morphism-material-table',
    dialogClass: 'morphism-glass-dialog',
    inputClass: 'morphism-material-input',
    badgeClass: 'morphism-material-badge',
  },
  // Department Admin: Neumorphism + Flat Design
  dept: {
    id: 'dept_neumorphic',
    role: 'dept',
    primaryStyle: 'neumorphism',
    supportingStyle: 'flat',
    isObsidianGlass: false,
    accentGlow: '0 0 16px rgba(139, 92, 246, 0.2)',
    surfaceClass: 'morphism-neumorphic-surface',
    panelClass: 'morphism-neumorphic-panel',
    buttonClass: 'morphism-neumorphic-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-neumorphic-dialog',
    inputClass: 'morphism-neumorphic-input',
    badgeClass: 'morphism-neumorphic-badge',
  },
  // Student: Claymorphism + Soft Neumorphism
  student: {
    id: 'student_clay',
    role: 'student',
    primaryStyle: 'claymorphism',
    supportingStyle: 'neumorphism',
    isObsidianGlass: false,
    accentGlow: '0 0 25px rgba(236, 72, 153, 0.2)',
    surfaceClass: 'morphism-clay-surface',
    panelClass: 'morphism-clay-panel',
    buttonClass: 'morphism-clay-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-clay-dialog',
    inputClass: 'morphism-clay-input',
    badgeClass: 'morphism-clay-badge',
  },
  // Household User: Polymorphic Glassmorphism + Material Design
  user: {
    id: 'user_polymorphic',
    role: 'user',
    primaryStyle: 'glassmorphism',
    supportingStyle: 'material',
    isObsidianGlass: false,
    accentGlow: '0 0 20px rgba(16, 185, 129, 0.25)',
    surfaceClass: 'morphism-glass-surface',
    panelClass: 'morphism-glass-panel',
    buttonClass: 'morphism-glass-btn',
    tableClass: 'morphism-flat-table',
    dialogClass: 'morphism-glass-dialog',
    inputClass: 'morphism-glass-input',
    badgeClass: 'morphism-glass-badge',
  },
};

interface MorphismContextType {
  activeProfile: MorphismProfile;
  resolveComponentStyle: (
    componentType: 'panel' | 'button' | 'table' | 'dialog' | 'input' | 'surface' | 'badge',
    overrideStyle?: MorphismStyle,
    density?: SurfaceDensity
  ) => string;
  getGlassMaterial: (level: GlassMaterialLevel) => string;
  isObsidianAdmin: boolean;
}

const MorphismContext = createContext<MorphismContextType | null>(null);

export const MorphismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  const activeProfile = useMemo(() => {
    return ROLE_MORPHISM_PROFILES[role] || ROLE_MORPHISM_PROFILES.user;
  }, [role]);

  const isObsidianAdmin = role === 'admin';

  /**
   * Deterministic context-aware Polymorphic style resolver:
   * 1. Explicit override if provided for specialized components
   * 2. Active role's assigned style profile
   * 3. Density classes
   */
  const resolveComponentStyle = (
    componentType: 'panel' | 'button' | 'table' | 'dialog' | 'input' | 'surface' | 'badge',
    overrideStyle?: MorphismStyle,
    density: SurfaceDensity = 'comfortable'
  ): string => {
    if (overrideStyle) {
      switch (overrideStyle) {
        case 'skeuomorphism':
          return `morphism-skeuo-${componentType}`;
        case 'neubrutalism':
          return `morphism-neubrutal-${componentType}`;
        case 'flat':
          return `morphism-flat-${componentType}`;
        case 'neumorphism':
          return `morphism-neumorphic-${componentType}`;
        case 'material':
          return `morphism-material-${componentType}`;
        case 'claymorphism':
          return `morphism-clay-${componentType}`;
        case 'glassmorphism':
          return isObsidianAdmin
            ? `morphism-obsidian-${componentType}`
            : `morphism-glass-${componentType}`;
        default:
          break;
      }
    }

    switch (componentType) {
      case 'panel':
        return activeProfile.panelClass;
      case 'button':
        return activeProfile.buttonClass;
      case 'table':
        return activeProfile.tableClass;
      case 'dialog':
        return activeProfile.dialogClass;
      case 'input':
        return activeProfile.inputClass;
      case 'surface':
        return activeProfile.surfaceClass;
      case 'badge':
        return activeProfile.badgeClass;
      default:
        return activeProfile.panelClass;
    }
  };

  const getGlassMaterial = (level: GlassMaterialLevel): string => {
    if (isObsidianAdmin) {
      switch (level) {
        case 'subtle':
          return 'glass-obsidian-subtle';
        case 'standard':
          return 'glass-obsidian-standard';
        case 'premium':
          return 'glass-obsidian-premium';
      }
    }
    switch (level) {
      case 'subtle':
        return 'glass-fluent-subtle';
      case 'standard':
        return 'glass-fluent-standard';
      case 'premium':
        return 'glass-fluent-premium';
    }
  };

  return (
    <MorphismContext.Provider
      value={{
        activeProfile,
        resolveComponentStyle,
        getGlassMaterial,
        isObsidianAdmin,
      }}
    >
      <div
        data-morphism-role={role}
        data-morphism-style={activeProfile.primaryStyle}
        data-obsidian-glass={isObsidianAdmin ? 'true' : 'false'}
        className="contents"
      >
        {children}
      </div>
    </MorphismContext.Provider>
  );
};

export const useMorphism = () => {
  const context = useContext(MorphismContext);
  if (!context) {
    throw new Error('useMorphism must be used within a MorphismProvider');
  }
  return context;
};
