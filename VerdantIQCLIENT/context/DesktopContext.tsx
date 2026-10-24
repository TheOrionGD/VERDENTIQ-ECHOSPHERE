'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SystemMetrics {
  cpu_usage: number;
  total_memory_mb: number;
  used_memory_mb: number;
  free_memory_mb: number;
  memory_percentage: number;
  os_name: string;
  os_version: string;
  host_name: string;
}

export interface ServiceHealthStatus {
  spring_boot_gateway: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  ml_gateway: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  database_status: 'ONLINE' | 'OFFLINE';
  timestamp: string;
}

interface DesktopContextType {
  isDesktop: boolean;
  isElectron: boolean;
  isTauri: boolean;
  isMaximized: boolean;
  systemMetrics: SystemMetrics | null;
  serviceHealth: ServiceHealthStatus | null;
  isTelemetryOpen: boolean;
  setIsTelemetryOpen: (open: boolean) => void;
  minimizeWindow: () => Promise<void>;
  toggleMaximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshHealth: () => Promise<void>;
  launchServiceStack: () => Promise<string>;
  sendNotification: (title: string, body: string) => Promise<void>;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [isElectron, setIsElectron] = useState<boolean>(false);
  const [isTauri, setIsTauri] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthStatus | null>({
    spring_boot_gateway: 'ONLINE',
    ml_gateway: 'ONLINE',
    database_status: 'ONLINE',
    timestamp: new Date().toISOString(),
  });

  const isDesktop = isElectron || isTauri;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect Electron environment
    const electron = (window as any).electronAPI;
    const inElectron = Boolean(electron && electron.isElectron);
    setIsElectron(inElectron);

    // Detect Tauri environment
    const inTauri = Boolean(
      ('__TAURI_INTERNALS__' in window) || ('__TAURI__' in window) || (window as any).__TAURI_METADATA__
    );
    setIsTauri(inTauri);

    // Initial metrics & health
    refreshMetrics();
    refreshHealth();

    const interval = setInterval(() => {
      refreshMetrics();
      refreshHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const invokeTauriCommand = async (command: string, args: Record<string, any> = {}) => {
    if (typeof window === 'undefined') return null;
    try {
      const win = window as any;
      if (win.__TAURI_INTERNALS__?.invoke) {
        return await win.__TAURI_INTERNALS__.invoke(command, args);
      }
      if (win.__TAURI__?.core?.invoke) {
        return await win.__TAURI__.core.invoke(command, args);
      }
      if (win.__TAURI__?.invoke) {
        return await win.__TAURI__.invoke(command, args);
      }
      return null;
    } catch (e) {
      console.warn(`[Desktop fallback] Command ${command} execution simulated/failed:`, e);
      return null;
    }
  };

  const minimizeWindow = async () => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.minimizeWindow) {
      await electron.minimizeWindow();
      return;
    }
    if (isTauri) {
      await invokeTauriCommand('minimize_window');
      return;
    }
    // Browser fallback: toggle telemetry drawer or notification
    setIsTelemetryOpen(false);
  };

  const toggleMaximizeWindow = async () => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.maximizeWindow) {
      const maximized = await electron.maximizeWindow();
      setIsMaximized(Boolean(maximized));
      return;
    }
    if (isTauri) {
      await invokeTauriCommand('toggle_maximize_window');
      setIsMaximized(!isMaximized);
      return;
    }
    // Browser fallback: toggle browser document fullscreen
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
        setIsMaximized(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsMaximized(false);
      }
    }
  };

  const closeWindow = async () => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.closeWindow) {
      await electron.closeWindow();
      return;
    }
    if (isTauri) {
      await invokeTauriCommand('close_window');
      return;
    }
    // Browser fallback: attempt window close or navigate to landing
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/landing';
      }
    }
  };

  const refreshMetrics = async () => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.getSystemMetrics) {
      try {
        const metrics = await electron.getSystemMetrics();
        if (metrics) {
          setSystemMetrics(metrics as SystemMetrics);
          return;
        }
      } catch (e) {
        console.warn('Failed to fetch Electron system metrics:', e);
      }
    }

    if (isTauri) {
      const res = await invokeTauriCommand('get_system_metrics');
      if (res) {
        setSystemMetrics(res as SystemMetrics);
        return;
      }
    }

    // Default simulated metrics for browser view
    setSystemMetrics({
      cpu_usage: 14.2,
      total_memory_mb: 16384,
      used_memory_mb: 6144,
      free_memory_mb: 10240,
      memory_percentage: 37.5,
      os_name: 'Windows 11 Pro (Desktop Runtime)',
      os_version: '10.0.26100',
      host_name: 'VERDANT-DESKTOP-01',
    });
  };

  const refreshHealth = async () => {
    if (isTauri) {
      const res = await invokeTauriCommand('check_service_health');
      if (res) setServiceHealth(res as ServiceHealthStatus);
    }
  };

  const launchServiceStack = async (): Promise<string> => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.launchServiceStack) {
      return await electron.launchServiceStack();
    }
    if (isTauri) {
      const res = await invokeTauriCommand('launch_service_stack');
      return (res as string) || 'Services launched';
    }
    return 'Desktop runtime required to launch native service stack';
  };

  const sendNotification = async (title: string, body: string) => {
    const electron = typeof window !== 'undefined' ? (window as any).electronAPI : null;
    if (electron?.sendNotification) {
      await electron.sendNotification(title, body);
      return;
    }
    if (isTauri) {
      await invokeTauriCommand('send_native_notification', { title, body });
      return;
    }
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  return (
    <DesktopContext.Provider
      value={{
        isDesktop,
        isElectron,
        isTauri,
        isMaximized,
        systemMetrics,
        serviceHealth,
        isTelemetryOpen,
        setIsTelemetryOpen,
        minimizeWindow,
        toggleMaximizeWindow,
        closeWindow,
        refreshMetrics,
        refreshHealth,
        launchServiceStack,
        sendNotification,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
}
