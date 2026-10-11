'use client';

import React from 'react';
import { MacMenuBar } from './MacMenuBar';
import { MacDock } from './MacDock';
import { MacControlCenter } from './MacControlCenter';
import { MacSpotlight } from './MacSpotlight';
import { MacNotificationCenter } from './MacNotificationCenter';
import { MacSiriOrb } from './MacSiriOrb';
import { MacWindow } from './MacWindow';
import { VoiceCommandWidget } from './VoiceCommandWidget';
import { ApiProgressIndicator } from '@/components/ui/ApiProgressIndicator';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-100 dark flex flex-col antialiased relative overflow-x-hidden font-sf bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Network & API Progress Indicator Bar */}
      <ApiProgressIndicator />

      {/* Top System Menu Bar */}
      <MacMenuBar />

      {/* Main Window Frame wrapping children */}
      <MacWindow>{children}</MacWindow>

      {/* Floating System Dock */}
      <MacDock />

      {/* Flyout & Overlay Controls */}
      <MacControlCenter />
      <MacSpotlight />
      <MacNotificationCenter />
      <MacSiriOrb />
      <VoiceCommandWidget />
    </div>
  );
};
