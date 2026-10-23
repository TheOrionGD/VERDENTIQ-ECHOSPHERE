'use client';

import React from 'react';
import { WindowsActionCenter } from './WindowsActionCenter';

// Re-export WindowsActionCenter to replace MacNotificationCenter
export const MacNotificationCenter = WindowsActionCenter;
export default MacNotificationCenter;
