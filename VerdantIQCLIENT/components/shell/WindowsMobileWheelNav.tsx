'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import { motion, AnimatePresence } from 'motion/react';
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
  Gauge,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface WheelDestination {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
  tag: string;
}

export const WindowsMobileWheelNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { roleConfig, notifications } = useAuth();
  const { isMobileWheelOpen, setIsMobileWheelOpen, setIsCommandPaletteOpen } = useWindowsTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [steerAngle, setSteerAngle] = useState(0); // in degrees (-180 to +180)
  const [isSteering, setIsSteering] = useState(false);
  const [showLinearFallback, setShowLinearFallback] = useState(false);
  const [turnSignal, setTurnSignal] = useState<'left' | 'right' | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const centerCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startTouchAngle = useRef<number>(0);
  const startSteerAngle = useRef<number>(0);
  const lastVelocity = useRef<number>(0);
  const lastAngle = useRef<number>(0);
  const lastTimestamp = useRef<number>(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const destinations: WheelDestination[] = [
    {
      id: 'dashboard',
      label: 'Cockpit Dashboard',
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
      color: '#10b981',
      tag: 'PORTAL',
    },
    {
      id: 'assistant',
      label: 'AI Copilot Drive',
      path: '/assistant',
      icon: Bot,
      color: '#0078d4',
      tag: 'AUTONOMOUS',
    },
    {
      id: 'mlops',
      label: 'XGBoost Telemetry',
      path: '/mlops/models',
      icon: Cpu,
      color: '#8b5cf6',
      tag: 'INFERENCE',
    },
    {
      id: 'compliance',
      label: 'Audit & Compliance',
      path: '/audit/overview',
      icon: ShieldCheck,
      color: '#f59e0b',
      tag: 'LEDGER',
    },
    {
      id: 'notifications',
      label: 'Alert Radar',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      color: '#ef4444',
      tag: 'TELEMETRY',
    },
    {
      id: 'activity',
      label: 'Fleet Activity',
      path: '/my-activity',
      icon: Activity,
      color: '#06b6d4',
      tag: 'STREAM',
    },
    {
      id: 'design',
      label: 'Design Aesthetics',
      path: '/design-system',
      icon: Palette,
      color: '#ec4899',
      tag: 'CHASSIS',
    },
    {
      id: 'settings',
      label: 'System Config',
      path: '/settings',
      icon: Settings,
      color: '#64748b',
      tag: 'TUNING',
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
      setSteerAngle(-foundIdx * angleStep);
    }
  }, [pathname]);

  // Haptic feedback trigger with simulated mechanical click
  const triggerHaptic = useCallback((strong = false) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(strong ? [20, 30, 20] : 12);
      } catch {}
    }
  }, []);

  // Update center coordinates when modal opens or resizes
  const updateCenter = useCallback(() => {
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      centerCoords.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }, []);

  useEffect(() => {
    if (isMobileWheelOpen) {
      setTimeout(updateCenter, 50);
      window.addEventListener('resize', updateCenter);
      return () => window.removeEventListener('resize', updateCenter);
    }
  }, [isMobileWheelOpen, updateCenter]);

  // Compute angle between wheel center and touch/mouse coordinate in degrees
  const getAngle = (clientX: number, clientY: number) => {
    const dx = clientX - centerCoords.current.x;
    const dy = clientY - centerCoords.current.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  // Touch start: record initial touch angle
  const handlePointerDown = (clientX: number, clientY: number) => {
    updateCenter();
    setIsSteering(true);
    const angle = getAngle(clientX, clientY);
    startTouchAngle.current = angle;
    startSteerAngle.current = steerAngle;
    lastAngle.current = steerAngle;
    lastTimestamp.current = performance.now();
  };

  // Touch move: steer like a car steering wheel with continuous angular rotation
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isSteering) return;
    const currentTouchAngle = getAngle(clientX, clientY);
    let delta = currentTouchAngle - startTouchAngle.current;

    // Handle 180 / -180 boundary wrap-around cleanly
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const newSteer = startSteerAngle.current + delta;
    setSteerAngle(newSteer);

    // Turn indicator signal detection based on angular delta
    if (delta > 8) {
      setTurnSignal('right');
    } else if (delta < -8) {
      setTurnSignal('left');
    }

    // Velocity tracking for inertia
    const now = performance.now();
    const dt = now - lastTimestamp.current;
    if (dt > 10) {
      lastVelocity.current = (newSteer - lastAngle.current) / dt;
      lastAngle.current = newSteer;
      lastTimestamp.current = now;
    }

    // Snap detection for haptic clicks on detents
    const angleStep = 360 / destinations.length;
    const normalized = ((-newSteer % 360) + 360) % 360;
    const snapped = Math.round(normalized / angleStep) % destinations.length;
    if (snapped !== activeIndex) {
      setActiveIndex(snapped);
      triggerHaptic(false);
    }
  };

  // Touch end: apply gentle spring inertia snap to the nearest station detent
  const handlePointerUp = () => {
    if (!isSteering) return;
    setIsSteering(false);
    setTurnSignal(null);

    const angleStep = 360 / destinations.length;
    // Calculate targeted snapped angle
    const targetAngle = -activeIndex * angleStep;
    setSteerAngle(targetAngle);
    triggerHaptic(true);
  };

  const selectDestination = (dest: WheelDestination, index: number) => {
    setActiveIndex(index);
    const angleStep = 360 / destinations.length;
    setSteerAngle(-index * angleStep);
    triggerHaptic(true);
    setTimeout(() => {
      setIsMobileWheelOpen(false);
      router.push(dest.path);
    }, 180);
  };

  const currentDest = destinations[activeIndex] || destinations[0];
  const CurrentIcon = currentDest.icon;

  return (
    <>
      {/* Floating Trigger Button (Mobile / Tablet only, fixed bottom right) */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsMobileWheelOpen(!isMobileWheelOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 font-bold shadow-2xl shadow-emerald-950/80 border-2 border-emerald-300/50 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Workspace Car Steering Navigation"
        >
          <div className="absolute inset-1 rounded-full border border-slate-950/40 pointer-events-none" />
          <Gauge className={`h-6 w-6 text-slate-950 transition-transform duration-500 ${isMobileWheelOpen ? 'rotate-180 scale-110' : 'group-hover:rotate-45'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-950 shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Automotive Steering Wheel Modal Overlay */}
      {isMobileWheelOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1"
            onClick={() => setIsMobileWheelOpen(false)}
          />

          {/* Steering Cockpit Container */}
          <div className="w-full rounded-t-[32px] bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b14] border-t border-emerald-500/30 p-5 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center relative animate-in slide-in-from-bottom-8 duration-300 overflow-hidden">
            
            {/* Ambient Carbon Fiber Top Glow Strip */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />
            
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mb-3" />

            {/* Cockpit Header with Turn Signal Indicators and View Switcher */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors ${
                  turnSignal === 'left'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 animate-pulse shadow-sm shadow-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <span>◀</span>
                  <span className="text-[10px]">L</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wider text-slate-100 uppercase font-sans">
                    Cockpit Wheel
                  </span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors ${
                  turnSignal === 'right'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 animate-pulse shadow-sm shadow-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <span className="text-[10px]">R</span>
                  <span>▶</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinearFallback(!showLinearFallback)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  {showLinearFallback ? 'Steering View' : 'Linear List'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileWheelOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/40 border border-slate-700/60 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Steering Wheel vs List View */}
            {!showLinearFallback ? (
              <div className="relative w-full flex flex-col items-center pt-4">
                
                {/* Active HUD Destination Gauge / Display Banner */}
                <div
                  onClick={() => selectDestination(currentDest, activeIndex)}
                  className="w-full max-w-xs mb-4 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-xl flex items-center justify-between active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl text-slate-950 font-bold shadow-md ring-2 ring-white/10"
                      style={{ backgroundColor: currentDest.color }}
                    >
                      <CurrentIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {currentDest.tag}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {activeIndex + 1}/{destinations.length}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white mt-0.5 group-hover:text-emerald-300 transition-colors">
                        {currentDest.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                    <span>ENGAGE</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 
                  ================================================================
                  CAR STEERING WHEEL CONTAINER
                  Uses full 2D angular polar coordinates to rotate like a real car wheel.
                  Includes metallic outer rim, leather perforation grip marks, 
                  tri-spoke steering columns, and central VerdantIQ horn hub.
                  ================================================================
                */}
                <div
                  ref={wheelRef}
                  onPointerDown={(e) => {
                    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                    handlePointerDown(e.clientX, e.clientY);
                  }}
                  onPointerMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                  onPointerUp={(e) => {
                    try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                    handlePointerUp();
                  }}
                  onPointerCancel={handlePointerUp}
                  className="relative h-72 w-72 rounded-full flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing"
                  style={{
                    filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.7))',
                  }}
                >
                  {/* Outer Top Dead Center 12-O'clock Alignment Stripe */}
                  <div className="absolute top-0 z-30 w-3 h-5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] pointer-events-none" />

                  {/* Rotatable Car Steering Wheel Assembly */}
                  <div
                    className="relative h-full w-full rounded-full flex items-center justify-center transition-transform"
                    style={{
                      transform: `rotate(${steerAngle}deg)`,
                      transition: isSteering ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    {/* Metallic Chrome Outer Ring Lip */}
                    <div className="absolute inset-0 rounded-full border-[7px] border-slate-700/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />

                    {/* Leather Steering Wheel Outer Rim with Stitching / Grip Texture */}
                    <div className="absolute inset-2 rounded-full border-[12px] border-[#161c29] bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)] pointer-events-none flex items-center justify-center">
                      {/* Sub-circumference grip groove */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
                    </div>

                    {/* Internal Wheel Cutout Cavity */}
                    <div className="absolute inset-6 rounded-full bg-slate-950/90 border border-slate-800 shadow-inner flex items-center justify-center pointer-events-none">
                      {/* Circular Compass Detent Tick Marks */}
                      <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20" />
                    </div>

                    {/* 3 STEERING WHEEL SPOKES (Left, Right, Bottom Column) */}
                    {/* Left Horizontal Spoke */}
                    <div className="absolute left-4 w-24 h-7 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 border-y border-slate-700/80 rounded-l shadow-md flex items-center justify-start pl-2 pointer-events-none">
                      <div className="w-1.5 h-3 bg-emerald-400/60 rounded-xs" />
                    </div>
                    {/* Right Horizontal Spoke */}
                    <div className="absolute right-4 w-24 h-7 bg-gradient-to-l from-slate-800 via-slate-900 to-slate-950 border-y border-slate-700/80 rounded-r shadow-md flex items-center justify-end pr-2 pointer-events-none">
                      <div className="w-1.5 h-3 bg-emerald-400/60 rounded-xs" />
                    </div>
                    {/* Bottom Vertical Spoke */}
                    <div className="absolute bottom-4 h-24 w-8 bg-gradient-to-t from-slate-800 via-slate-900 to-slate-950 border-x border-slate-700/80 rounded-b shadow-md flex items-end justify-center pb-2 pointer-events-none">
                      <div className="h-1.5 w-4 bg-emerald-400/60 rounded-xs" />
                    </div>

                    {/* Central Steering Horn Hub & Logo Button */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        selectDestination(currentDest, activeIndex);
                      }}
                      className="relative z-20 h-22 w-22 rounded-full bg-gradient-to-b from-slate-800 via-slate-900 to-[#0b0f19] border-2 border-slate-600 shadow-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer active:scale-95 transition-transform group"
                    >
                      <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
                      <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-0.5 group-hover:bg-emerald-500/40 transition-colors">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-tight text-slate-200 leading-none">
                        ENTER
                      </span>
                    </div>

                    {/* Satellite Destination Orbit Nodes on Steering Wheel Rim */}
                    {destinations.map((dest, idx) => {
                      const angleDeg = (idx * 360) / destinations.length;
                      const rad = (angleDeg * Math.PI) / 180;
                      const radius = 104; // px distance from center to sit on steering grip
                      const x = radius * Math.cos(rad);
                      const y = radius * Math.sin(rad);
                      const isCurrent = idx === activeIndex;
                      const Icon = dest.icon;

                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectDestination(dest, idx);
                          }}
                          className={`absolute h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg z-20 ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 scale-125 border-2 border-white ring-4 ring-emerald-400/30 font-bold'
                              : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:text-white hover:border-emerald-400/60 active:scale-95'
                          }`}
                          style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-steerAngle}deg)`,
                          }}
                          title={dest.label}
                        >
                          <Icon className={`h-4 w-4 ${isCurrent ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Driving Instruction Telemetry Bar */}
                <div className="flex items-center justify-between w-full max-w-xs mt-4 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <RotateCcw className="h-3 w-3" />
                    <span>Steer Rim to Turn</span>
                  </span>
                  <span>Angle: {Math.round(steerAngle % 360)}°</span>
                </div>
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
                      type="button"
                      onClick={() => selectDestination(dest, idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/30 text-white font-semibold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-xl text-slate-950 font-bold shadow-sm"
                          style={{ backgroundColor: dest.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-slate-100">{dest.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{dest.tag} • {dest.path}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Command Search Link */}
            <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileWheelOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-medium py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 active:scale-95 transition-all"
              >
                <Search className="h-3.5 w-3.5 text-emerald-400" />
                <span>Search all commands...</span>
              </button>

              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                VerdantIQ Drive
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
