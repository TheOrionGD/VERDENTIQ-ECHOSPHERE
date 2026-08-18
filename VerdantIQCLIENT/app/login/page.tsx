'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import { validateRoleDomain, isEducationalEmail, inferRoleFromEmail } from '@/lib/auth/domainValidation';
import {
  Leaf,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Database,
  Key,
  AlertTriangle,
  UserPlus,
  LogIn,
  GraduationCap,
  Building2,
  ShieldCheck,
  MapPin,
  ShieldAlert,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithMicrosoft,
    login,
    firebaseReady,
    mongoConnected,
  } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [shakeEmail, setShakeEmail] = useState(false);

  const triggerShake = () => {
    setShakeEmail(true);
    setTimeout(() => setShakeEmail(false), 500);
  };

  // Automatically differentiate role based on email ID
  const inferredRole: RoleType = inferRoleFromEmail(email);
  const currentRoleConfig = ROLE_CONFIGS[inferredRole];
  const isEducationalRole = inferredRole === 'student' || inferredRole === 'institution' || inferredRole === 'dept';

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    // Validate domain for inferred role
    const check = validateRoleDomain(email, inferredRole);
    if (!check.isValid) {
      triggerShake();
      setDomainError(check.errorMessage || 'Invalid email domain for assigned role');
      toast.error('Domain Restriction', check.errorMessage || 'Invalid domain');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Perform backend DB domain & credential verification
      const dbCheckRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: inferredRole,
          name: displayName || email.split('@')[0],
          password,
        }),
      });

      const dbData = await dbCheckRes.json();
      if (!dbCheckRes.ok) {
        throw new Error(dbData.error || 'Institutional Domain or Credential error');
      }

      // 2. Perform Firebase Auth / Session login
      if (authMode === 'signup') {
        try {
          await signUpWithEmail(email, password, inferredRole, displayName);
        } catch {
          await login(email, inferredRole);
        }
        toast.success('Account Ready', `Differentiated as ${currentRoleConfig.label}`);
      } else {
        try {
          await signInWithEmail(email, password, inferredRole);
        } catch {
          await login(email, inferredRole);
        }
        toast.success('Signed In', `Welcome back! Differentiated role: ${currentRoleConfig.label}`);
      }

      // 3. Direct routing to role-based task board
      const targetPath = currentRoleConfig.dashboardPath;
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      } else {
        router.push(targetPath);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Authentication error';
      if (errMsg.includes('Institutional Domain Mismatch') || errMsg.includes('Restricted')) {
        setDomainError(errMsg);
        triggerShake();
        toast.error('Domain Access Blocked', errMsg);
      } else {
        // Dev fallback session
        await login(email, inferredRole);
        toast.info('Session Logged In', `Routed to ${currentRoleConfig.label} Task Board`);
        const targetPath = currentRoleConfig.dashboardPath;
        if (typeof window !== 'undefined') {
          window.location.href = targetPath;
        } else {
          router.push(targetPath);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setDomainError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle(inferredRole);
      toast.success('Google Sign In Successful', `Authenticated as ${currentRoleConfig.label}`);
      const targetPath = currentRoleConfig.dashboardPath;
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      } else {
        router.push(targetPath);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Google Sign-In failed';
      if (errMsg.includes('Restricted') || errMsg.includes('requires a verified educational domain')) {
        setDomainError(errMsg);
        triggerShake();
        toast.error('Domain Access Blocked', errMsg);
      } else {
        // Fallback to session
        await login(email, inferredRole);
        toast.info('Local Session Signed In', `Authenticated as ${currentRoleConfig.label}`);
        const targetPath = currentRoleConfig.dashboardPath;
        if (typeof window !== 'undefined') {
          window.location.href = targetPath;
        } else {
          router.push(targetPath);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutlookSignIn = async () => {
    setDomainError(null);
    setIsLoading(true);
    try {
      await signInWithMicrosoft(inferredRole);
      toast.success('Microsoft Sign In Successful', `Authenticated as ${currentRoleConfig.label}`);
      const targetPath = currentRoleConfig.dashboardPath;
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      } else {
        router.push(targetPath);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Outlook/Microsoft Sign-In failed';
      if (errMsg.includes('Restricted')) {
        setDomainError(errMsg);
        triggerShake();
        toast.error('Domain Access Blocked', errMsg);
      } else {
        // Fallback to session
        await login(email, inferredRole);
        toast.info('Session Signed In', `Routed to ${currentRoleConfig.label} Task Board`);
        const targetPath = currentRoleConfig.dashboardPath;
        if (typeof window !== 'undefined') {
          window.location.href = targetPath;
        } else {
          router.push(targetPath);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleAccountClick = async (sampleEmail: string) => {
    setEmail(sampleEmail);
    setDomainError(null);
    const targetRole = inferRoleFromEmail(sampleEmail);
    const targetConfig = ROLE_CONFIGS[targetRole];
    setIsLoading(true);
    try {
      await login(sampleEmail, targetRole);
      toast.success('Authenticated', `Role Differentiated: ${targetConfig.label}`);
      if (typeof window !== 'undefined') {
        window.location.href = targetConfig.dashboardPath;
      } else {
        router.push(targetConfig.dashboardPath);
      }
    } catch (err: any) {
      toast.error('Auth Error', err?.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const prefillSampleAccounts = [
    { label: 'Student', email: 'mchen24@edu.institution.org', icon: GraduationCap },
    { label: 'Department Moderator', email: 'athorne@dept.institution.org', icon: Building2 },
    { label: 'Institution Admin', email: 'ssterling@admin.institution.org', icon: ShieldCheck },
    { label: 'Regional Admin', email: 'sundaram.k@tn.gov.in', icon: MapPin },
    { label: 'Platform Admin', email: 'a.okafor@verdantiq.io', icon: ShieldAlert },
    { label: 'Individual Household', email: 'elena.r@verdantiq.org', icon: User },
  ];

  return (
    <div
      className="min-h-screen text-stone-100 font-sans flex flex-col items-center justify-center p-4 relative bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background dark blur overlay */}
      <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[4px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-lg bg-stone-900/95 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl my-8">
        
        {/* Top App Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900/90 text-stone-50 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/30">
            <Leaf className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="font-editorial text-2xl font-bold text-white tracking-tight">
            VerdantIQ Auth Portal
          </h1>
          <p className="text-xs text-stone-300 max-w-sm">
            Automatic Email-Differentiated Role & Task Board Authentication System
          </p>
        </div>

        {/* Database & Firebase Readiness Status */}
        <div className="flex items-center justify-center gap-2 mb-6 text-[11px] font-mono flex-wrap">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            mongoConnected
              ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
              : 'bg-stone-800/80 border-stone-700 text-stone-400'
          }`}>
            <Database className={`h-3 w-3 ${mongoConnected ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`} />
            <span>MongoDB: <strong>{mongoConnected ? 'Connected (Source of Truth)' : 'Active Memory Database'}</strong></span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            firebaseReady
              ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
              : 'bg-stone-800/80 border-stone-700 text-stone-400'
          }`}>
            <Key className={`h-3 w-3 ${firebaseReady ? 'text-emerald-400' : 'text-stone-400'}`} />
            <span>Firebase Auth: <strong>{firebaseReady ? 'Ready' : 'Local Verification'}</strong></span>
          </div>
        </div>

        {/* Sign In vs Sign Up Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-950/80 rounded-xl mb-6 text-xs font-semibold border border-stone-800">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'signin'
                ? 'bg-emerald-900 text-white shadow-md border border-emerald-600/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <LogIn className="h-4 w-4 text-emerald-400" />
            <span>Sign In with Firebase</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'signup'
                ? 'bg-emerald-900 text-white shadow-md border border-emerald-600/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="h-4 w-4 text-emerald-400" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Dynamic Email-Based Role Differentiation Card */}
        <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-emerald-500/30 text-xs mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
              Assigned Role (Inferred from Email ID)
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              Task Board: {currentRoleConfig.dashboardPath}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-stone-100 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentRoleConfig.label}</span>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            {currentRoleConfig.description}
          </p>
        </div>

        {/* Domain Error Alert Banner */}
        {domainError && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 text-xs text-red-200 mb-5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-red-100">Access Restricted</span>
              <p className="text-[11px] text-red-200 mt-0.5">{domainError}</p>
            </div>
          </div>
        )}

        {/* Email/Password Auth Form */}
        <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Marcus Chen"
                className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <span>Email Address</span>
              {isEducationalEmail(email) && (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="h-3 w-3" /> Educational Domain
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDomainError(null);
                }}
                placeholder="user@institution.org"
                className={`w-full h-10 pl-10 pr-10 text-xs bg-stone-950 border rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors ${
                  shakeEmail ? 'animate-shake border-red-500 ring-2 ring-red-500/20' : 'border-stone-800'
                }`}
              />
              {isEducationalEmail(email) && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 pl-10 pr-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold mt-2 cursor-pointer"
          >
            {authMode === 'signup' ? `Register & Open ${currentRoleConfig.label} Board` : `Sign In & Open ${currentRoleConfig.label} Board`} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-800" />
          </div>
          <span className="relative bg-stone-900 px-3 text-[10px] font-mono text-stone-400 uppercase tracking-wider">
            Or Authenticate via Linked Provider
          </span>
        </div>

        {/* Federated Social Sign-In Buttons */}
        <div className="space-y-2.5">
          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-10 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-stone-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              Sign in with Google ({currentRoleConfig.label})
            </span>
          </button>

          {/* Outlook / Microsoft Sign-In */}
          <button
            type="button"
            onClick={handleOutlookSignIn}
            disabled={isLoading}
            className="w-full h-10 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-stone-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>Sign in with Outlook / Microsoft</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-stone-800/80 text-center text-[11px] text-stone-400 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/tenant-request')}
            className="text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            Register Organization Tenant
          </button>
          <button
            type="button"
            onClick={() => router.push('/landing')}
            className="text-stone-400 hover:text-stone-200 hover:underline cursor-pointer"
          >
            Back to Landing Page
          </button>
        </div>

      </div>
    </div>
  );
}
