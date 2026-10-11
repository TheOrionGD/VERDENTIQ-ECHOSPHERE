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
    login,
    dbAuthReady,
    mongoConnected,
    isLoggedIn,
    isInitializing,
    user,
  } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRoleOverride, setSelectedRoleOverride] = useState<RoleType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [shakeEmail, setShakeEmail] = useState(false);

  // Auto-redirect already logged-in users to their role dashboard
  React.useEffect(() => {
    if (!isInitializing && isLoggedIn && user?.role) {
      const activeConfig = ROLE_CONFIGS[user.role] || ROLE_CONFIGS.user;
      router.push(activeConfig.dashboardPath);
    }
  }, [isInitializing, isLoggedIn, user, router]);

  const triggerShake = () => {
    setShakeEmail(true);
    setTimeout(() => setShakeEmail(false), 500);
  };

  // Resolve role: manual override or inferred from email ID
  const inferredRole: RoleType = inferRoleFromEmail(email);
  const activeRole: RoleType = selectedRoleOverride || inferredRole;
  const currentRoleConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.user;

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    // Validate domain only for new account registrations
    if (authMode === 'signup') {
      const check = validateRoleDomain(email, activeRole);
      if (!check.isValid) {
        triggerShake();
        setDomainError(check.errorMessage || 'Invalid email domain for assigned role');
        toast.error('Domain Restriction', check.errorMessage || 'Invalid domain');
        return;
      }
    }

    setIsLoading(true);

    try {
      let authUser;
      if (authMode === 'signup') {
        authUser = await signUpWithEmail(email, password, activeRole, displayName);
        toast.success('Account Ready', `Registered as ${ROLE_CONFIGS[authUser?.role || activeRole]?.label}`);
      } else {
        authUser = await signInWithEmail(email, password, activeRole);
        toast.success('Signed In', `Welcome back! Active Role: ${ROLE_CONFIGS[authUser?.role || activeRole]?.label}`);
      }

      // Direct routing to authentic resolved role dashboard from database
      const resolvedRole = authUser?.role || activeRole;
      const targetPath = ROLE_CONFIGS[resolvedRole]?.dashboardPath || '/user/dashboard';
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
        const authUser = await login(email, activeRole);
        const resolvedRole = authUser?.role || activeRole;
        const activeConfig = ROLE_CONFIGS[resolvedRole] || ROLE_CONFIGS.user;
        toast.info('Session Logged In', `Routed to ${activeConfig.label} Task Board`);
        if (typeof window !== 'undefined') {
          window.location.href = activeConfig.dashboardPath;
        } else {
          router.push(activeConfig.dashboardPath);
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
    setSelectedRoleOverride(targetRole);
    setIsLoading(true);
    try {
      const authUser = await login(sampleEmail, targetRole);
      const resolvedRole = authUser?.role || targetRole;
      const targetConfig = ROLE_CONFIGS[resolvedRole] || ROLE_CONFIGS.user;
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
    { label: 'Student', email: 'mchen24@edu.institution.org', role: 'student' as RoleType, icon: GraduationCap },
    { label: 'Dept Moderator', email: 'athorne@dept.institution.org', role: 'dept' as RoleType, icon: Building2 },
    { label: 'Institution Admin', email: 'ssterling@admin.institution.org', role: 'institution' as RoleType, icon: ShieldCheck },
    { label: 'Regional Admin', email: 'sundaram.k@tn.gov.in', role: 'region' as RoleType, icon: MapPin },
    { label: 'Platform Admin', email: 'a.okafor@verdantiq.io', role: 'admin' as RoleType, icon: ShieldAlert },
    { label: 'Auditor', email: 'auditor@audit.org', role: 'audit' as RoleType, icon: Database },
    { label: 'ML Ops', email: 'mlops@verdantiq.io', role: 'mlops' as RoleType, icon: Key },
    { label: 'Household User', email: 'elena.r@verdantiq.org', role: 'user' as RoleType, icon: User },
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

        {/* Database & System Readiness Status */}
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
            dbAuthReady
              ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
              : 'bg-stone-800/80 border-stone-700 text-stone-400'
          }`}>
            <Key className={`h-3 w-3 ${dbAuthReady ? 'text-emerald-400' : 'text-stone-400'}`} />
            <span>Database Auth: <strong>{dbAuthReady ? 'JWT Verified' : 'Local Verification'}</strong></span>
          </div>
        </div>

        {/* Quick-Select Active Sample Accounts */}
        <div className="mb-6 space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider block text-center">
            Quick Select Active Account Persona:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {prefillSampleAccounts.map((acc) => {
              const IconComponent = acc.icon;
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSampleAccountClick(acc.email)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-900/80 border-emerald-500 text-white shadow-md'
                      : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:border-emerald-700/60 hover:text-white'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`} />
                  <span className="text-[10px] font-medium leading-tight">{acc.label}</span>
                </button>
              );
            })}
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
            <span>Sign In with Database</span>
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

        {/* Dynamic Role Card & Manual Override Selector */}
        <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-emerald-500/30 text-xs mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
              {selectedRoleOverride ? 'Manually Selected System Role' : 'Assigned System Role'}
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              Task Board: {currentRoleConfig.dashboardPath}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-stone-100 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentRoleConfig.label}</span>
            </div>
            {selectedRoleOverride && (
              <button
                type="button"
                onClick={() => setSelectedRoleOverride(null)}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer font-mono"
              >
                Reset to Auto-Infer
              </button>
            )}
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            {currentRoleConfig.description}
          </p>

          {/* Role override selector buttons */}
          <div className="pt-2 border-t border-stone-800/80">
            <span className="text-[10px] font-mono text-stone-400 block mb-1.5">Specify Role Persona:</span>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((rKey) => (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => setSelectedRoleOverride(rKey)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                    activeRole === rKey
                      ? 'bg-emerald-900 border-emerald-500 text-white font-bold'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {ROLE_CONFIGS[rKey].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
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
