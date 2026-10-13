'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardDispatcherPage() {
  const router = useRouter();
  const { isLoggedIn, isInitializing, roleConfig } = useAuth();

  useEffect(() => {
    if (isInitializing) return;

    if (isLoggedIn && roleConfig?.dashboardPath) {
      router.replace(roleConfig.dashboardPath);
    } else {
      router.replace('/login?from=/dashboard');
    }
  }, [isInitializing, isLoggedIn, roleConfig, router]);

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-3xl bg-stone-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-4 max-w-sm w-full">
        <div className="h-12 w-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-100">Resolving Active Workspace</h2>
          <p className="text-xs text-slate-400 font-mono">Routing to role dashboard...</p>
        </div>
      </div>
    </div>
  );
}
