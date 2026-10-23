'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { MacThemeProvider } from '@/context/MacThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { VoiceCommandProvider } from '@/context/VoiceCommandContext';

import { DesktopProvider } from '@/context/DesktopContext';
import { DesktopTitlebar } from '@/components/desktop/DesktopTitlebar';
import { DesktopTelemetryDrawer } from '@/components/desktop/DesktopTelemetryDrawer';
import { ScreenCompilationProvider } from '@/components/ui/ScreenCompilationNotifier';
import { BackgroundVideo } from '@/components/common/BackgroundVideo';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesktopProvider>
      <ScreenCompilationProvider>
        <AuthProvider>
          <MacThemeProvider>
            <VoiceCommandProvider>
              <ToastProvider>
                <div className="relative min-h-screen flex flex-col text-slate-100 bg-stone-950">
                  <BackgroundVideo />
                  <DesktopTitlebar />
                  <DesktopTelemetryDrawer />
                  <div className="flex-1 relative z-0">{children}</div>
                </div>
              </ToastProvider>
            </VoiceCommandProvider>
          </MacThemeProvider>
        </AuthProvider>
      </ScreenCompilationProvider>
    </DesktopProvider>
  );
}
