'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Leaf, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    logout();
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push('/login');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 bg-dark-grid-pattern">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-stone-50 mx-auto">
          <LogOut className="h-7 w-7 text-emerald-400" />
        </div>

        <h1 className="font-editorial text-2xl font-bold text-white">
          Logged Out of VerdantIQ
        </h1>

        <p className="text-xs text-stone-400">
          Your session token has been invalidated. Redirecting to login in{' '}
          <strong className="text-emerald-400 font-mono text-sm">{countdown}s</strong>...
        </p>

        <div className="pt-4 flex justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/login')}
            className="bg-emerald-600 text-stone-950 font-bold"
          >
            Sign Back In Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-stone-400"
          >
            Go to Landing
          </Button>
        </div>
      </div>
    </div>
  );
}
