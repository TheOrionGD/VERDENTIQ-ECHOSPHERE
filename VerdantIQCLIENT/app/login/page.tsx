'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import { validateRoleDomain, isEducationalEmail, inferRoleFromEmail } from '@/lib/auth/domainValidation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Database,
  Key,
  AlertTriangle,
  GraduationCap,
  Building2,
  ShieldCheck,
  MapPin,
  ShieldAlert,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

function LoginContent() {
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
  const searchParams = useSearchParams();
  const toast = useToast();

  const fromParam = searchParams?.get('from');
  const getSafeDestination = (fallbackPath: string) => {
    if (fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//') && fromParam !== '/login') {
      return fromParam;
    }
    return fallbackPath;
  };

  // Coordinated auth mode: false = Login, true = Register
  const [isRegister, setIsRegister] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRoleOverride, setSelectedRoleOverride] = useState<RoleType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [shakeEmail, setShakeEmail] = useState(false);

  // Auto-redirect already logged-in users to their role dashboard
  React.useEffect(() => {
    if (!isInitializing && isLoggedIn && user?.role) {
      const activeConfig = ROLE_CONFIGS[user.role] || ROLE_CONFIGS.user;
      const target = getSafeDestination(activeConfig.dashboardPath);
      router.push(target);
    }
  }, [isInitializing, isLoggedIn, user, router, fromParam]);

  const triggerShake = () => {
    setShakeEmail(true);
    setTimeout(() => setShakeEmail(false), 500);
  };

  // Role resolution
  const inferredRole: RoleType = inferRoleFromEmail(email);
  const activeRole: RoleType = selectedRoleOverride || inferredRole;
  const currentRoleConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.user;

  // Mode Toggle with brief debounce guard
  const handleToggleMode = (targetRegister: boolean) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsRegister(targetRegister);
    setDomainError(null);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Form Submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    if (isRegister) {
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
      if (isRegister) {
        authUser = await signUpWithEmail(email, password, activeRole, username);
        toast.success('Account Ready', `Registered as ${ROLE_CONFIGS[authUser?.role || activeRole]?.label}`);
      } else {
        authUser = await signInWithEmail(email, password, activeRole);
        toast.success('Signed In', `Welcome back! Active Role: ${ROLE_CONFIGS[authUser?.role || activeRole]?.label}`);
      }

      const resolvedRole = authUser?.role || activeRole;
      const targetPath = getSafeDestination(ROLE_CONFIGS[resolvedRole]?.dashboardPath || '/user/dashboard');
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
        const targetPath = getSafeDestination(activeConfig.dashboardPath);
        toast.info('Session Logged In', `Routed to ${activeConfig.label} Task Board`);
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
    setSelectedRoleOverride(targetRole);
    setIsLoading(true);
    try {
      const authUser = await login(sampleEmail, targetRole);
      const resolvedRole = authUser?.role || targetRole;
      const targetConfig = ROLE_CONFIGS[resolvedRole] || ROLE_CONFIGS.user;
      const targetPath = getSafeDestination(targetConfig.dashboardPath);
      toast.success('Authenticated', `Role Differentiated: ${targetConfig.label}`);
      if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      } else {
        router.push(targetPath);
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
    <div className="min-h-screen text-slate-100 font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative bg-transparent">
      {/* Background ambient radial tint allowing BackgroundVideo to show through */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_40%,rgba(6,78,59,0.35),rgba(2,44,34,0.7),rgba(2,6,23,0.88))] pointer-events-none" />

      {/* Top Status Indicators (MongoDB & System Auth) */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-6 text-[11px] font-mono flex-wrap">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
          mongoConnected
            ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
            : 'bg-stone-800/80 border-stone-700 text-stone-400'
        }`}>
          <Database className={`h-3 w-3 ${mongoConnected ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`} />
          <span>MongoDB: <strong>{mongoConnected ? 'Connected (Atlas Cluster)' : 'Active Memory DB'}</strong></span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
          dbAuthReady
            ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
            : 'bg-stone-800/80 border-stone-700 text-stone-400'
        }`}>
          <Key className={`h-3 w-3 ${dbAuthReady ? 'text-emerald-400' : 'text-stone-400'}`} />
          <span>Database Auth: <strong>{dbAuthReady ? 'JWT Verified' : 'Local Verification'}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-emerald-950/80 border-emerald-500/40 text-emerald-300">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span>Mode: <strong>{isRegister ? 'Register Account' : 'Sign In'}</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN ANIMATED SPLIT-PANEL CARD (Reference Design Realization) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[880px] min-h-[500px] animated-auth-card shadow-2xl flex flex-col md:flex-row">

        {/* 
          PANEL 1: SYSTEM EMERALD WELCOME PANEL
          Animates horizontally: Left (0%) in Login mode, Right (100% / right-half) in Register mode.
          On desktop md: absolute overlay width 50%, translating smoothly via Framer Motion without clipping text.
        */}
        <motion.div
          animate={{
            x: isRegister ? '100%' : '0%',
          }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 20,
            mass: 0.9,
          }}
          className={`
            welcome-panel-gradient text-white z-20 flex flex-col justify-between p-8 sm:p-12
            relative md:absolute md:top-0 md:bottom-0 md:w-1/2 min-h-[320px] md:min-h-full
            ${isRegister ? 'md:order-2' : 'md:order-1'}
          `}
        >
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-black/30 flex items-center justify-center border border-white/20 shadow-inner">
                <Leaf className="h-5 w-5 text-emerald-300" />
              </div>
              <span className="font-editorial text-lg font-bold tracking-tight text-white drop-shadow-sm">
                VerdantIQ
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-sans drop-shadow-md">
                WELCOME!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-50/95 leading-relaxed max-w-xs font-normal">
                We&apos;re delighted to have you here. If you need any assistance, feel free to reach out.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 relative z-10 space-y-1.5">
            <div className="text-[11px] font-mono text-emerald-100 flex items-center justify-between">
              <span className="uppercase font-semibold tracking-wider">Target Domain</span>
              <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 border border-emerald-400/20">
                {currentRoleConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-100/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">Active Board: {currentRoleConfig.dashboardPath}</span>
            </div>
          </div>
        </motion.div>

        {/* 
          PANEL 2: DARK AUTHENTICATION PANEL
          Animates horizontally: Right side in Login mode, Left side in Register mode.
          On desktop md: absolute overlay width 50%, translating inversely to the welcome panel.
        */}
        <motion.div
          animate={{
            x: isRegister ? '-100%' : '0%',
          }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 20,
            mass: 0.9,
          }}
          className={`
            bg-slate-950/90 z-10 flex flex-col justify-center p-8 sm:p-12
            relative md:absolute md:top-0 md:bottom-0 md:right-0 md:w-1/2 min-h-[480px] md:min-h-full
          `}
        >
          {/* Animated Form Switcher using AnimatePresence */}
          <AnimatePresence mode="wait" initial={false}>
            {isRegister ? (
              /* REGISTER FORM */
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-4 w-full"
              >
                <div className="text-left mb-2">
                  <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight">
                    Register
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Create your credentials for verified tenant access.
                  </p>
                </div>

                {domainError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] leading-tight">{domainError}</div>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div className="auth-input-underline-box">
                    <input
                      type="text"
                      required
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="auth-input-underline"
                    />
                    <label className="auth-input-floating-label">Username</label>
                    <User className="absolute right-1 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>

                  {/* Email Field */}
                  <div className="auth-input-underline-box">
                    <input
                      type="email"
                      required
                      placeholder=" "
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setDomainError(null);
                      }}
                      className={`auth-input-underline ${shakeEmail ? 'border-red-500' : ''}`}
                    />
                    <label className="auth-input-floating-label">Email</label>
                    {isEducationalEmail(email) ? (
                      <CheckCircle2 className="absolute right-1 top-3.5 w-4 h-4 text-emerald-400" />
                    ) : (
                      <Mail className="absolute right-1 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="auth-input-underline-box">
                    <input
                      type="password"
                      required
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input-underline"
                    />
                    <label className="auth-input-floating-label">Password</label>
                    <Lock className="absolute right-1 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>

                  {/* Register Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-primary-btn flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-emerald-950" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Register</span>
                      )}
                    </button>
                  </div>

                  {/* Switch to Login link */}
                  <div className="text-center text-xs text-stone-400 pt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleToggleMode(false)}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* LOGIN FORM */
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-4 w-full"
              >
                <div className="text-left mb-2">
                  <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight">
                    Login
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Sign in with your verified institutional account.
                  </p>
                </div>

                {domainError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] leading-tight">{domainError}</div>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Email / Username Field */}
                  <div className="auth-input-underline-box">
                    <input
                      type="email"
                      required
                      placeholder=" "
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setDomainError(null);
                      }}
                      className="auth-input-underline"
                    />
                    <label className="auth-input-floating-label">Username / Email</label>
                    <Mail className="absolute right-1 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>

                  {/* Password Field */}
                  <div className="auth-input-underline-box">
                    <input
                      type="password"
                      required
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input-underline"
                    />
                    <label className="auth-input-floating-label">Password</label>
                    <Lock className="absolute right-1 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>

                  {/* Login Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-primary-btn flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-emerald-950" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <span>Login</span>
                      )}
                    </button>
                  </div>

                  {/* Switch to Register link */}
                  <div className="text-center text-xs text-stone-400 pt-1">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleToggleMode(true)}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* ========================================================================= */}
      {/* QUICK ROLE SELECTOR FOR EASY AUTH TESTING */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[880px] mt-6 space-y-4">
        
        {/* Quick-Select Active Sample Accounts */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block mb-2 text-center">
            Quick Select Active System Account Persona:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-emerald-500/60 hover:text-white'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-medium leading-tight">{acc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-between">
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
            className="text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
          >
            Back to Landing Page
          </button>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
