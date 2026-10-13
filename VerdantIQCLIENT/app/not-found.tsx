'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, LayoutDashboard, Home, Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const router = useRouter();
  const { isLoggedIn, roleConfig } = useAuth();

  const primaryTarget = isLoggedIn && roleConfig?.dashboardPath
    ? roleConfig.dashboardPath
    : '/landing';

  return (
    <div
      className="min-h-screen text-slate-100 flex items-center justify-center p-4 relative bg-stone-950 bg-no-repeat bg-cover bg-center bg-fixed font-sans"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md pointer-events-none z-0" />

      <div className="relative z-10 max-w-lg w-full bg-slate-950/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        {/* Glow Element */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-950/50">
          <Compass className="h-10 w-10 animate-spin text-emerald-400" style={{ animationDuration: '24s' }} />
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-mono font-bold text-slate-950">
            404
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <span>ROUTE RESOLUTION ANOMALY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Screen View Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            The route you navigated to doesn’t exist or has moved. Choose a safe destination below to continue navigating VerdantIQ Ecosphere.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5 pt-2">
          <Link href={primaryTarget} className="block w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{isLoggedIn ? `Return to ${roleConfig?.label || 'Dashboard'}` : 'Explore Platform Landing'}</span>
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Go Back</span>
            </button>

            <Link href="/assistant">
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bot className="h-3.5 w-3.5 text-teal-400" />
                <span>AI Copilot</span>
              </button>
            </Link>
          </div>

          <Link href="/landing" className="inline-block text-[11px] text-slate-400 hover:text-emerald-400 underline pt-2 transition-colors">
            Return to Public Landing Showcase
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500">
          VerdantIQ Resilient Router • Automated 404 Recovery Handler
        </div>
      </div>
    </div>
  );
}
