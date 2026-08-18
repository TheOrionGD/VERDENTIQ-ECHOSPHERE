'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Leaf, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RootLoaderPage() {
  const router = useRouter();
  const { isLoggedIn, isInitializing, roleConfig, user } = useAuth();
  const [redirectCountdown, setRedirectCountdown] = useState(2);

  useEffect(() => {
    if (isInitializing) return;

    if (!isLoggedIn || !roleConfig) {
      router.push('/landing');
      return;
    }

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isInitializing, isLoggedIn, roleConfig, router]);

  useEffect(() => {
    if (!isInitializing && isLoggedIn && roleConfig && redirectCountdown === 0) {
      router.push(roleConfig.dashboardPath);
    }
  }, [redirectCountdown, isInitializing, isLoggedIn, roleConfig, router]);

  return (
    <div
      className="min-h-screen text-stone-100 font-sans flex items-center justify-center p-4 relative bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-md pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full bg-stone-900/90 border border-emerald-800/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Animated Brand Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 shadow-xl shadow-emerald-900/40">
            <Leaf className="h-8 w-8 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl font-bold text-white tracking-tight">VerdantIQ</h1>
            <p className="text-xs font-mono text-emerald-400">Emerald Oasis Auth Resolver</p>
          </div>
        </div>

        {/* Loader Status */}
        {isInitializing ? (
          <div className="space-y-3 py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <span>Verifying Firebase ID Token & Custom Claims...</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Cross-checking MongoDB claims mirror for tenant and department scope...
            </p>
          </div>
        ) : isLoggedIn ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/40 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Active Session Resolved
                </span>
                <span className="font-mono text-[10px] text-stone-400">{user.role.toUpperCase()}</span>
              </div>
              <div className="text-sm font-bold text-white">{user.name}</div>
              <div className="text-xs text-stone-300 font-mono">{user.email}</div>
              <div className="text-[11px] text-stone-400 pt-1 border-t border-emerald-900/60">
                Tenant: <strong className="text-stone-200">{user.institution || 'Global Platform'}</strong>
              </div>
            </div>

            <p className="text-xs text-stone-300">
              Redirecting to <strong className="text-emerald-400">{roleConfig.label}</strong> in {redirectCountdown}s...
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(roleConfig.dashboardPath)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold"
              >
                Enter {roleConfig.label} Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/landing')}
                className="text-stone-400 hover:text-white text-xs"
              >
                Go to Public Landing Page
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-xs text-stone-300">
              No active session token found. Redirecting to platform landing page...
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/landing')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold"
            >
              Go to Landing Page <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-800">
          VerdantIQ Foundation Gateway • Spring Boot ID Token Verification Mirror
        </div>
      </div>
    </div>
  );
}
