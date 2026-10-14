import React, { useState } from 'react';
import { ROLE_CONFIGS } from './services/authService';
import { ROLE_SCREENS } from './roleScreens';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('verdantiq_active_role') || 'institution';
  });

  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [institutionId, setInstitutionId] = useState('inst-verdia-central');
  const [userName, setUserName] = useState('Campus Lead Administrator');

  const switchRole = (newRole) => {
    if (ROLE_CONFIGS[newRole]) {
      setCurrentRole(newRole);
      localStorage.setItem('verdantiq_active_role', newRole);
      const screens = ROLE_SCREENS[newRole] || ROLE_SCREENS.institution;
      setActiveScreen(screens[0]?.id || 'dashboard');
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('verdantiq_theme');
    return saved ? saved === 'dark' : true;
  });

  // Windows window state: minimized or visible
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);

  // Dynamic draggable/reorderable tabs list per role
  const [roleScreensMap, setRoleScreensMap] = useState(() => ({ ...ROLE_SCREENS }));

  const availableScreens = roleScreensMap[currentRole] || ROLE_SCREENS[currentRole] || ROLE_SCREENS.institution;

  const reorderScreens = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;
    setRoleScreensMap((prev) => {
      const currentList = [...(prev[currentRole] || ROLE_SCREENS[currentRole] || [])];
      const [movedItem] = currentList.splice(sourceIndex, 1);
      currentList.splice(targetIndex, 0, movedItem);
      return {
        ...prev,
        [currentRole]: currentList,
      };
    });
  };

  // Fluid Glass UI Density (0 to 100, default 65)
  const [fluidDensity, setFluidDensity] = useState(() => {
    const saved = localStorage.getItem('verdantiq_fluid_density');
    return saved !== null ? Number(saved) : 65;
  });

  const updateFluidDensity = (val) => {
    const num = Math.min(100, Math.max(10, Number(val)));
    setFluidDensity(num);
    localStorage.setItem('verdantiq_fluid_density', num.toString());
  };

  React.useEffect(() => {
    // Map fluidDensity (10-100) to blur (8px - 48px), opacity (0.35 - 0.95), and saturation
    const blurPx = Math.round(8 + (fluidDensity / 100) * 36);
    const alphaDark = (0.45 + (fluidDensity / 100) * 0.48).toFixed(2);
    const alphaLight = (0.55 + (fluidDensity / 100) * 0.40).toFixed(2);
    const satPct = Math.round(120 + (fluidDensity / 100) * 60);

    document.documentElement.style.setProperty('--fluid-blur', `${blurPx}px`);
    document.documentElement.style.setProperty('--fluid-density-pct', `${fluidDensity}%`);
    document.documentElement.style.setProperty('--fluid-alpha-dark', alphaDark);
    document.documentElement.style.setProperty('--fluid-alpha-light', alphaLight);
    document.documentElement.style.setProperty('--fluid-saturate', `${satPct}%`);
  }, [fluidDensity]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('verdantiq_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const roleMeta = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.institution;

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        roleMeta,
        switchRole,
        activeScreen,
        setActiveScreen,
        availableScreens,
        reorderScreens,
        isWindowMinimized,
        setIsWindowMinimized,
        institutionId,
        setInstitutionId,
        userName,
        setUserName,
        isDarkMode,
        toggleTheme,
        fluidDensity,
        updateFluidDensity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
