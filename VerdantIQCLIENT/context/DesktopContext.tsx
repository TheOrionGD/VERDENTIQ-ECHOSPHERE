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

  useEffect(() => {
    // Check if running inside Tauri environment
    const inTauri =
      typeof window !== 'undefined' &&
      (('__TAURI_INTERNALS__' in window) || ('__TAURI__' in window) || (window as any).__TAURI_METADATA__);
    
    setIsTauri(Boolean(inTauri));

    if (inTauri) {
      refreshMetrics();
      refreshHealth();

      const interval = setInterval(() => {
        refreshMetrics();
        refreshHealth();
      }, 5000);

      return () => clearInterval(interval);
    }
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
      console.warn(`[Tauri fallback] Command ${command} execution simulated/failed:`, e);
      return null;
    }
  };

  const minimizeWindow = async () => {
    if (isTauri) {
      await invokeTauriCommand('minimize_window');
    }
  };

  const toggleMaximizeWindow = async () => {
    if (isTauri) {
      await invokeTauriCommand('toggle_maximize_window');
      setIsMaximized(!isMaximized);
    }
  };

  const closeWindow = async () => {
    if (isTauri) {
      await invokeTauriCommand('close_window');
    }
  };

  const refreshMetrics = async () => {
    if (!isTauri) {
      // Simulated metrics for web preview
      setSystemMetrics({
        cpu_usage: 14.2,
        total_memory_mb: 16384,
        used_memory_mb: 6144,
        free_memory_mb: 10240,
        memory_percentage: 37.5,
        os_name: 'Windows 11 Enterprise (2026)',
        os_version: '10.0.26100',
        host_name: 'VERDANT-STATION-01',
      });
      return;
    }
    const res = await invokeTauriCommand('get_system_metrics');
    if (res) setSystemMetrics(res as SystemMetrics);
  };

  const refreshHealth = async () => {
    if (!isTauri) return;
    const res = await invokeTauriCommand('check_service_health');
    if (res) setServiceHealth(res as ServiceHealthStatus);
  };

  const launchServiceStack = async (): Promise<string> => {
    if (isTauri) {
      const res = await invokeTauriCommand('launch_service_stack');
      return (res as string) || 'Services launched';
    }
    return 'Desktop runtime required to launch native service stack';
  };

  const sendNotification = async (title: string, body: string) => {
    if (isTauri) {
      await invokeTauriCommand('send_native_notification', { title, body });
    }
  };

  return (
    <DesktopContext.Provider
      value={{
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
