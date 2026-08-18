export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  location?: string;
  source: string;
  read: boolean;
  channel?: 'sse-push' | 'polling';
  isolationForestScore?: number;
}

export type SSEConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'fallback';
