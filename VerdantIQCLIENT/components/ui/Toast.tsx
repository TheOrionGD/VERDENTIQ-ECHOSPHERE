'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, description?: string) => addToast('success', title, description),
    warning: (title: string, description?: string) => addToast('warning', title, description),
    error: (title: string, description?: string) => addToast('error', title, description),
    info: (title: string, description?: string) => addToast('info', title, description),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
              t.type === 'success' && 'bg-white border-emerald-300 text-stone-900 shadow-emerald-950/5',
              t.type === 'warning' && 'bg-white border-amber-300 text-stone-900 shadow-amber-950/5',
              t.type === 'error' && 'bg-white border-rose-300 text-stone-900 shadow-rose-950/5',
              t.type === 'info' && 'bg-stone-900 border-stone-800 text-stone-100 shadow-stone-950/20'
            )}
          >
            <div className="mt-0.5 flex-shrink-0">
              {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {t.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
              {t.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-600" />}
              {t.type === 'info' && <Info className="h-4 w-4 text-emerald-400" />}
            </div>

            <div className="flex-1 text-xs">
              <h4 className="font-semibold">{t.title}</h4>
              {t.description && (
                <p className={cn('mt-0.5 text-[11px]', t.type === 'info' ? 'text-stone-300' : 'text-stone-600')}>
                  {t.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-stone-400 hover:text-stone-600 cursor-pointer p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};
