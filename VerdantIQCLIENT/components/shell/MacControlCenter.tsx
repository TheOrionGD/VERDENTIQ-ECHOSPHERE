'use client';

import React from 'react';
import { WindowsQuickSettings } from './WindowsQuickSettings';

// Re-export WindowsQuickSettings to replace MacControlCenter
export const MacControlCenter = WindowsQuickSettings;
export default MacControlCenter;
