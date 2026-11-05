import React, { createContext, useContext, useState, useEffect } from 'react';
import { MORPHISM_STYLES } from '../data/showcaseData';

const MorphismContext = createContext();

export function MorphismProvider({ children }) {
  const [activeMorphism, setActiveMorphism] = useState(() => {
    try {
      const saved = localStorage.getItem('verdantiq-morphism');
      if (saved) {
        const found = MORPHISM_STYLES.find(s => s.id === saved);
        if (found) return found;
      }
    } catch {}
    return MORPHISM_STYLES[0]; // Default: Obsidian Glassmorphism
  });

  useEffect(() => {
    try {
      localStorage.setItem('verdantiq-morphism', activeMorphism.id);
    } catch (e) {
      console.warn('Could not persist morphism preference', e);
    }
  }, [activeMorphism]);

  return (
    <MorphismContext.Provider value={{ activeMorphism, setActiveMorphism, MORPHISM_STYLES }}>
      {children}
    </MorphismContext.Provider>
  );
}

export function useMorphism() {
  const context = useContext(MorphismContext);
  if (!context) {
    throw new Error('useMorphism must be used within a MorphismProvider');
  }
  return context;
}

/**
 * MorphicCard: A smart container component that applies the active Multi-Morphism engine styles
 * dynamically across all cards on the showcase website with fluid transitions.
 */
export function MorphicCard({ children, className = '', style = {}, ...props }) {
  const { activeMorphism } = useMorphism();

  return (
    <div
      className={`morphic-engine-card ${className}`}
      style={{
        ...activeMorphism.cardStyle,
        transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * MorphicButton: A button that adopts the active Multi-Morphism design language.
 */
export function MorphicButton({ children, className = '', style = {}, ...props }) {
  const { activeMorphism } = useMorphism();

  return (
    <button
      className={`morphic-engine-btn ${className}`}
      style={{
        ...activeMorphism.buttonStyle,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

