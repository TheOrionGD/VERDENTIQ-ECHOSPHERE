'use client';

import React from 'react';
import { AppShell } from './AppShell';

// Forward MacWindow directly to AppShell
export const MacWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};

export default MacWindow;
