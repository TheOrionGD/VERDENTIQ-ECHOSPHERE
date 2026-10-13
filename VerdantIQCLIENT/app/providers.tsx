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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesktopProvider>
      <ScreenCompilationProvider>
        <AuthProvider>
          <MacThemeProvider>
            <VoiceCommandProvider>
              <ToastProvider>
                <div
                  className="min-h-screen flex flex-col text-slate-100 bg-stone-950 bg-no-repeat bg-cover bg-center bg-fixed"
                  style={{
                    backgroundImage: "url('/bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                  }}
                >
                  <DesktopTitlebar />
                  <DesktopTelemetryDrawer />
                  <div className="flex-1">{children}</div>
                </div>
              </ToastProvider>
            </VoiceCommandProvider>
          </MacThemeProvider>
        </AuthProvider>
      </ScreenCompilationProvider>
    </DesktopProvider>
  );
}
