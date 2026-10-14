import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Search,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

export function WindowsTaskbar({ onToggleStartMenu, isStartOpen, onToggleActionCenter }) {
  const { 
    roleMeta, 
    availableScreens = [], 
    activeScreen, 
    setActiveScreen, 
    isDarkMode, 
    toggleTheme,
    isWindowMinimized,
    setIsWindowMinimized,
    fluidDensity
  } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 win-taskbar flex items-center justify-between px-3 z-50 select-none">
      {/* Left side / Widgets preview */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400">
        <span className="px-2 py-1 rounded hover:bg-white/5 cursor-pointer">VerdantIQ 100% JS</span>
      </div>

      {/* Centered Taskbar App Icons & Start Button */}
      <div className="flex items-center space-x-1.5">
        {/* Windows 11 Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`p-2 rounded-md transition-colors ${
            isStartOpen ? 'bg-white/15 text-emerald-400' : 'hover:bg-white/10 text-neutral-200'
          }`}
          title="Windows Start"
        >
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <span className="bg-sky-400 rounded-xs"></span>
            <span className="bg-sky-400 rounded-xs"></span>
            <span className="bg-sky-400 rounded-xs"></span>
            <span className="bg-sky-400 rounded-xs"></span>
          </div>
        </button>

        {/* Windows Search pill */}
        <button
          onClick={onToggleStartMenu}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span>Search roles & apps</span>
        </button>

        <div className="h-5 w-px bg-white/10 mx-1"></div>

        {/* Active Role Application Icon / Window Restore Button */}
        {roleMeta && (
          <button
            onClick={() => setIsWindowMinimized(!isWindowMinimized)}
            title={isWindowMinimized ? `Restore ${roleMeta.label} Window` : `Minimize ${roleMeta.label} Window`}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border text-xs flex-shrink-0 cursor-pointer transition-all ${
              !isWindowMinimized 
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm shadow-emerald-500/30' 
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{roleMeta.label}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${!isWindowMinimized ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
          </button>
        )}

        {/* Dynamic Role-Based Dashboard Page Icons/Tabs */}
        <div className="flex items-center space-x-1 max-w-[50vw] overflow-x-auto scrollbar-none px-1">
          {availableScreens.map((screen) => {
            const isActive = activeScreen === screen.id && !isWindowMinimized;
            return (
              <button
                key={screen.id}
                onClick={() => {
                  setActiveScreen(screen.id);
                  if (isWindowMinimized) setIsWindowMinimized(false);
                }}
                title={`${screen.label} (${screen.category})`}
                className={`relative px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                <span className="truncate max-w-[120px]">{screen.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400/50"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side System Tray (Theme, Wi-Fi, Audio, Battery, Clock) */}
      <div className="flex items-center space-x-2 text-neutral-300 text-xs">
        <button
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mica Theme' : 'Switch to Dark Mica Theme'}
          className="p-1.5 rounded-md hover:bg-white/10 text-emerald-400 cursor-pointer transition-colors"
        >
          {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Fluid Glass Density Quick Toggle Button */}
        <button
          onClick={onToggleActionCenter}
          title={`Fluid Glass UI Density: ${fluidDensity}% (Click to adjust blur and density)`}
          className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-400 font-mono text-[10px] cursor-pointer transition"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>{fluidDensity}%</span>
        </button>

        <button
          onClick={onToggleActionCenter}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
        >
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </button>

        <div
          onClick={onToggleActionCenter}
          className="text-right px-2 py-1 rounded hover:bg-white/10 cursor-pointer leading-tight"
        >
          <div className="font-medium text-[11px]">{timeStr}</div>
          <div className="text-[10px] text-neutral-400">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
