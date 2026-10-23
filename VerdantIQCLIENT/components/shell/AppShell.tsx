'use client';

import React from 'react';
import { WindowsCommandPalette } from './WindowsCommandPalette';
import { WindowsMobileWheelNav } from './WindowsMobileWheelNav';
import { WindowsQuickSettings } from './WindowsQuickSettings';
import { WindowsActionCenter } from './WindowsActionCenter';
import { WindowsAppHeader } from './WindowsAppHeader';
import { WindowsCommandStrip } from './WindowsCommandStrip';
import { VoiceCommandWidget } from './VoiceCommandWidget';
import { ApiProgressIndicator } from '@/components/ui/ApiProgressIndicator';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col antialiased relative font-segoe select-none">
      {/* Top Network & API Progress Bar */}
      <ApiProgressIndicator />

      {/* Windows 11 Fluent App Header (Integrated Search, Role & Actions) */}
      <WindowsAppHeader />

      {/* Compact Contextual Windows Command Strip (Replaces bulky permanent sidebars & navbars) */}
      <WindowsCommandStrip />

      {/* Immersive Windows Desktop Workspace */}
      <main className="flex-1 w-full p-2 sm:p-4 lg:p-6 flex flex-col min-w-0">
        <div className="flex-1 w-full max-w-7xl mx-auto rounded-xl win11-mica-surface border border-slate-800/80 p-3 sm:p-5 lg:p-6 shadow-xl backdrop-blur-xl">
          {children}
        </div>
      </main>

      {/* Windows 11 Global Overlays & Interaction Surfaces */}
      <WindowsCommandPalette />
      <WindowsQuickSettings />
      <WindowsActionCenter />
      <WindowsMobileWheelNav />
      <VoiceCommandWidget />
    </div>
  );
};

export default AppShell;
