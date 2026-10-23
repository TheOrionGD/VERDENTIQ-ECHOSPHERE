'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import {
  Compass,
  LayoutDashboard,
  Bot,
  Cpu,
  ShieldCheck,
  Palette,
  Activity,
  Bell,
  Settings,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface WheelDestination {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
}

export const WindowsMobileWheelNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { roleConfig, notifications } = useAuth();
  const { isMobileWheelOpen, setIsMobileWheelOpen, setIsCommandPaletteOpen } = useWindowsTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showLinearFallback, setShowLinearFallback] = useState(false);
  const touchStartY = useRef(0);
  const startAngle = useRef(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const destinations: WheelDestination[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
      color: '#10b981',
    },
    {
      id: 'assistant',
      label: 'AI Copilot',
      path: '/assistant',
      icon: Bot,
      color: '#0078d4',
    },
    {
      id: 'mlops',
      label: 'ML Models',
      path: '/mlops/models',
      icon: Cpu,
      color: '#8b5cf6',
    },
    {
      id: 'compliance',
      label: 'Compliance',
      path: '/audit/overview',
      icon: ShieldCheck,
      color: '#f59e0b',
    },
    {
      id: 'notifications',
      label: 'Alerts',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      color: '#ef4444',
    },
    {
      id: 'activity',
      label: 'Activity',
      path: '/my-activity',
      icon: Activity,
      color: '#06b6d4',
    },
    {
      id: 'design',
      label: 'Design Kit',
      path: '/design-system',
      icon: Palette,
      color: '#ec4899',
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      color: '#64748b',
    },
  ];

  // Match current path to initial active index
  useEffect(() => {
    const foundIdx = destinations.findIndex(
      (d) => pathname === d.path || (d.path !== '/' && pathname.startsWith(d.path))
    );
    if (foundIdx !== -1) {
      setActiveIndex(foundIdx);
      const angleStep = 360 / destinations.length;
      setRotationAngle(-foundIdx * angleStep);
    }
  }, [pathname]);

  // Haptic feedback trigger
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  // Touch gesture handling for wheel rotary interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    startAngle.current = rotationAngle;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const newAngle = startAngle.current + deltaY * 0.6;
    setRotationAngle(newAngle);

    // Calculate snapped index
    const angleStep = 360 / destinations.length;
    const normalized = ((-newAngle % 360) + 360) % 360;
    const snapped = Math.round(normalized / angleStep) % destinations.length;
    if (snapped !== activeIndex) {
      setActiveIndex(snapped);
      triggerHaptic();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Snap to nearest destination angle
    const angleStep = 360 / destinations.length;
    const snappedAngle = -activeIndex * angleStep;
    setRotationAngle(snappedAngle);
  };

  const selectDestination = (dest: WheelDestination, index: number) => {
    setActiveIndex(index);
    const angleStep = 360 / destinations.length;
    setRotationAngle(-index * angleStep);
    triggerHaptic();
    setTimeout(() => {
      setIsMobileWheelOpen(false);
      router.push(dest.path);
    }, 120);
  };

  const currentDest = destinations[activeIndex] || destinations[0];
  const CurrentIcon = currentDest.icon;

  return (
    <>
      {/* Floating Trigger Button (Mobile / Tablet only, fixed bottom right) */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsMobileWheelOpen(!isMobileWheelOpen)}
          className="relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-bold shadow-xl shadow-emerald-950/60 border border-emerald-300/40 active:scale-95 transition-transform cursor-pointer"
          aria-label="Open Workspace Rotary Wheel Navigation"
        >
          <Compass className={`h-6 w-6 text-slate-950 transition-transform duration-300 ${isMobileWheelOpen ? 'rotate-90' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Rotary Wheel Modal Overlay */}
      {isMobileWheelOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1"
            onClick={() => setIsMobileWheelOpen(false)}
          />

          {/* Rotary Navigation Container */}
          <div className="w-full rounded-t-3xl win11-mica-surface border-t border-slate-700/80 p-5 shadow-2xl flex flex-col items-center relative animate-in slide-in-from-bottom-6 duration-200">
            
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-slate-600 rounded-full mb-3" />

            {/* Header with Title and Mode Switcher */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold tracking-wide text-slate-200">
                  Workspace Rotary Dial
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLinearFallback(!showLinearFallback)}
                  className="text-[11px] font-medium text-emerald-400 hover:underline px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
                >
                  {showLinearFallback ? 'Wheel View' : 'List View'}
                </button>
                <button
                  onClick={() => setIsMobileWheelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Wheel vs List View */}
            {!showLinearFallback ? (
              <div className="relative w-full flex flex-col items-center py-6">
                
                {/* Active Destination Card Preview */}
                <div
                  onClick={() => selectDestination(currentDest, activeIndex)}
                  className="mb-6 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg flex items-center gap-3 active:scale-95 transition-transform cursor-pointer"
                >
                  <div
                    className="p-2 rounded-lg text-slate-950 font-bold"
                    style={{ backgroundColor: currentDest.color }}
                  >
                    <CurrentIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{currentDest.label}</span>
                      <ChevronRight className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-400">Tap to navigate now</span>
                  </div>
                </div>

                {/* Touch-Interactive Circular Rotary Wheel */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative h-64 w-64 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center touch-none shadow-inner"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Wheel Center Hub */}
                  <div className="absolute h-16 w-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono text-[10px] shadow-lg pointer-events-none">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  {/* Satellite Dest Icons */}
                  {destinations.map((dest, idx) => {
                    const angleDeg = (idx * 360) / destinations.length;
                    const rad = (angleDeg * Math.PI) / 180;
                    const radius = 100; // px
                    const x = radius * Math.cos(rad);
                    const y = radius * Math.sin(rad);
                    const isCurrent = idx === activeIndex;
                    const Icon = dest.icon;

                    return (
                      <button
                        key={dest.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectDestination(dest, idx);
                        }}
                        className={`absolute h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 scale-125 border-2 border-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                        style={{
                          transform: `translate(${x}px, ${y}px) rotate(${-rotationAngle}deg)`,
                        }}
                        title={dest.label}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 mt-4 text-center">
                  Drag the wheel dial to rotate, or tap any destination node.
                </p>
              </div>
            ) : (
              /* Accessible Linear Alternative List */
              <div className="w-full py-3 space-y-1.5 max-h-72 overflow-y-auto">
                {destinations.map((dest, idx) => {
                  const Icon = dest.icon;
                  const isActive = pathname === dest.path;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => selectDestination(dest, idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/30 text-white font-semibold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-1.5 rounded-lg text-slate-950 font-bold"
                          style={{ backgroundColor: dest.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{dest.label}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Command Search Link */}
            <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsMobileWheelOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-medium py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <Search className="h-3.5 w-3.5 text-emerald-400" />
                <span>Search all commands...</span>
              </button>

              <span className="text-[10px] text-slate-500 font-mono">
                Windows Rotary Touch
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
