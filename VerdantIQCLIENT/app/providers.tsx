'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { MacThemeProvider } from '@/context/MacThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { VoiceCommandProvider } from '@/context/VoiceCommandContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MacThemeProvider>
        <VoiceCommandProvider>
          <ToastProvider>{children}</ToastProvider>
        </VoiceCommandProvider>
      </MacThemeProvider>
    </AuthProvider>
  );
}
