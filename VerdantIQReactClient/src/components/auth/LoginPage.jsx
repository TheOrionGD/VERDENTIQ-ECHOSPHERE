import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import { ROLE_HIERARCHY_ORDER, ROLE_CONFIGS } from '../../lib/services/authService';
import { useAuth } from '../../lib/useAuth';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function LoginPage({ onBackToLanding, onLoginSuccess }) {
  const { switchRole, setUserName } = useAuth();
  const [selectedRole, setSelectedRole] = useState('institution');
  const [email, setEmail] = useState('lead.admin@verdiacentral.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Campus Lead Administrator');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      switchRole(selectedRole);
      setUserName(name || ROLE_CONFIGS[selectedRole].label);
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 600);
  };

  const handleRolePillClick = (roleKey) => {
    setSelectedRole(roleKey);
    if (roleKey === 'admin') {
      setEmail('platform.admin@verdantiq.org');
      setName('Platform Chief Administrator');
    } else if (roleKey === 'institution') {
      setEmail('lead.admin@verdiacentral.edu');
      setName('Campus Lead Administrator');
    } else if (roleKey === 'student') {
      setEmail('alex.mercer@student.verdia.edu');
      setName('Alex Mercer');
    } else if (roleKey === 'dept') {
      setEmail('moderator.engineering@verdiacentral.edu');
      setName('Prof. Katherine Hall');
    } else if (roleKey === 'audit') {
      setEmail('auditor.compliance@ecocert.org');
      setName('Dr. Marcus Vance');
    } else if (roleKey === 'mlops') {
      setEmail('mlops.lead@verdantiq.org');
      setName('Elena Rostova');
    } else if (roleKey === 'region') {
      setEmail('district.director@regionalgrid.gov');
      setName('Director Robert Sterling');
    } else {
      setEmail('citizen.household@gmail.com');
      setName('Jordan Taylor');
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 py-12 relative select-none">
      {/* Background Video */}
      <BackgroundVideo overlayClassName="bg-neutral-950/75 backdrop-blur-[2px]" />
      {/* Background glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)',
        }}
      />

      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Landing Page</span>
      </button>

      <div className="relative z-10 max-w-lg w-full liquid-glass-panel liquid-shimmer p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900/90 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 overflow-hidden p-2 flex items-center justify-center animate-liquid-pulse">
            <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Sign In to VerdantIQ Ecosphere
          </h2>
          <p className="text-xs text-neutral-400">
            Select a verified role tier or enter authorized credentials
          </p>
        </div>

        {/* Role Quick Selector Pills */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-300 mb-2">
            Target System Role (Tier 1 - 8):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ROLE_HIERARCHY_ORDER.map((roleKey) => {
              const conf = ROLE_CONFIGS[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRolePillClick(roleKey)}
                  className={`p-2 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-600/30 border border-emerald-400/50 scale-[1.03]'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-[11px] truncate">{conf.label.split(' ')[0]}</div>
                  <div className="text-[9px] opacity-75">T{conf.hierarchyLevel}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">Institutional / User Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[11px] text-neutral-300">
              <span className="font-semibold text-white">Active Permissions:</span>
              <span className="text-emerald-400 font-mono">Verified Token</span>
            </div>
            <div className="text-[10px] text-neutral-400 leading-normal">
              {ROLE_CONFIGS[selectedRole].description}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="liquid-btn liquid-shimmer w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-semibold transition-all flex items-center justify-center space-x-2 shadow-xl shadow-emerald-600/30 border border-emerald-400/40 cursor-pointer"
          >
            <span>{isLoading ? 'Verifying Credentials...' : `Enter as ${ROLE_CONFIGS[selectedRole].label}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
