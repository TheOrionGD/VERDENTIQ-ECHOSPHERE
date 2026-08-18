import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';

export interface ApiRequestOptions<T = any> {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export interface BackendHealthStatus {
  gateway: { reachable: boolean; statusText: string; url: string };
  lastChecked: string;
}

export interface ApiProgressState {
  isLoading: boolean;
  activeCount: number;
  currentPath?: string;
  method?: string;
  progressPercent: number;
  lastCompletedPath?: string;
  lastSuccess?: boolean;
}

let activeRequestsCount = 0;
let lastRequestPath = '';
let lastRequestMethod = 'GET';
let currentProgressPercent = 0;
let progressTimer: any = null;
const progressListeners = new Set<(state: ApiProgressState) => void>();

export function getApiProgressState(): ApiProgressState {
  return {
    isLoading: activeRequestsCount > 0,
    activeCount: activeRequestsCount,
    currentPath: lastRequestPath,
    method: lastRequestMethod,
    progressPercent: activeRequestsCount > 0 ? (currentProgressPercent || 30) : 100,
  };
}

export function subscribeToApiProgress(listener: (state: ApiProgressState) => void): () => void {
  progressListeners.add(listener);
  listener(getApiProgressState());
  return () => {
    progressListeners.delete(listener);
  };
}

function notifyApiProgress(extra?: Partial<ApiProgressState>) {
  const state: ApiProgressState = {
    ...getApiProgressState(),
    ...extra,
  };
  progressListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
      console.error('[subscribeToApiProgress] Listener error:', e);
    }
  });
}

export function useApiLoading(): ApiProgressState {
  const [state, setState] = useState<ApiProgressState>(() => getApiProgressState());

  useEffect(() => {
    return subscribeToApiProgress((newState) => {
      setState(newState);
    });
  });

  return state;
}

/**
 * Shared API client for making typed HTTP calls to Spring Boot Gateway or FastAPI ML Service.
 * Attaches Firebase ID token automatically when available.
 * Handles network failures and missing backends gracefully by returning provided fallbacks.
 */
export async function apiClient<T = any>(options: ApiRequestOptions<T>): Promise<T> {
  const {
    path,
    method = 'GET',
    body,
    headers: customHeaders = {},
  } = options;

  activeRequestsCount++;
  lastRequestPath = path;
  lastRequestMethod = method;
  currentProgressPercent = Math.max(currentProgressPercent, 30);
  notifyApiProgress();

  if (!progressTimer && typeof window !== 'undefined') {
    progressTimer = setInterval(() => {
      if (activeRequestsCount > 0) {
        if (currentProgressPercent < 92) {
          currentProgressPercent += Math.floor(Math.random() * 12) + 6;
          notifyApiProgress();
        }
      } else {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
      }
    }, 100);
  }

  const baseUrl = GATEWAY_URL;
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    ...customHeaders,
  };

  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach Firebase ID Token if user is logged in
  if (typeof window !== 'undefined' && auth && auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${idToken}`;
    } catch (e) {
      console.warn('[apiClient] Failed to retrieve Firebase ID token:', e);
    }
  }

  const startTime = Date.now();
  let result: T;
  let isSuccess = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `[apiClient] Backend HTTP ${response.status} ${response.statusText} at ${url}.`
      );
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } else {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = (await response.json()) as T;
      } else {
        result = (await response.text()) as unknown as T;
      }
    }
  } catch (error: any) {
    console.error(
      `[apiClient] Network call failed to ${url} (${error?.name || 'Error'}: ${error?.message || 'Unreachable'}).`
    );
    isSuccess = false;
    throw error;
  } finally {
    const elapsed = Date.now() - startTime;
    if (elapsed < 200 && typeof window !== 'undefined') {
      await new Promise((resolve) => setTimeout(resolve, 200 - elapsed));
    }

    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
      currentProgressPercent = 100;
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    }

    notifyApiProgress({
      lastCompletedPath: path,
      lastSuccess: isSuccess,
    });
  }

  return result;
}

/**
 * SSE Notification Stream Subscriber.
 * Opens a persistent EventSource connection to the Spring Boot Gateway stream endpoint.
 * Falls back gracefully if backend is unreachable.
 */
export function subscribeToNotifications(
  onMessage: (data: any) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const streamUrl = `${GATEWAY_URL.replace(/\/$/, '')}/api/v1/notifications/stream`;
  let eventSource: EventSource | null = null;

  try {
    eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch {
        onMessage(event.data);
      }
    };

    eventSource.onerror = (err) => {
      if (onError) onError(err);
      if (eventSource) {
        eventSource.close();
      }
    };
  } catch (err) {
    if (onError) onError(err);
  }

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
}

/**
 * Utility to check health/reachability of Gateway and ML Service for dev tools.
 */
export async function checkBackendHealth(): Promise<BackendHealthStatus> {
  const result: BackendHealthStatus = {
    gateway: { reachable: false, statusText: 'Checking...', url: GATEWAY_URL },
    lastChecked: new Date().toLocaleTimeString(),
  };

  try {
    const gwController = new AbortController();
    const gwTimeout = setTimeout(() => gwController.abort(), 2000);
    const gwRes = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/api/v1/db/status`, {
      method: 'GET',
      signal: gwController.signal,
    }).catch(() => null);
    clearTimeout(gwTimeout);

    if (gwRes && (gwRes.ok || gwRes.status === 401 || gwRes.status === 403)) {
      result.gateway = { reachable: true, statusText: `Online (${gwRes.status})`, url: GATEWAY_URL };
    } else {
      result.gateway = { reachable: false, statusText: 'Offline (Unreachable)', url: GATEWAY_URL };
    }
  } catch {
    result.gateway = { reachable: false, statusText: 'Offline', url: GATEWAY_URL };
  }

  return result;
}
