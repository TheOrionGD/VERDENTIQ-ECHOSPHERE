'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import { Leaf, Check, ArrowRight, ArrowLeft, Building2, Shield, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function OnboardingPage() {
  const { role, user, switchRole, roleConfig } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<RoleType>(role);
  const [department, setDepartment] = useState('Environmental Research Wing B');
  const [priority, setPriority] = useState('Scope 2 Carbon Optimization');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      switchRole(selectedRole);
      toast.success('Onboarding Complete!', `Welcome to your ${ROLE_CONFIGS[selectedRole].label} workspace.`);
      router.push(ROLE_CONFIGS[selectedRole].dashboardPath);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex items-center justify-center p-4 bg-dark-grid-pattern relative">
      <div className="w-full max-w-2xl bg-stone-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-900 text-stone-50">
              <Leaf className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-editorial text-xl font-bold text-white">
                VerdantIQ Onboarding Stepper
              </h1>
              <p className="text-xs text-stone-400">
                Configuring workspace permissions for {user.name}
              </p>
            </div>
          </div>
          <Badge variant="emerald">Step {step} of 4</Badge>
        </div>

        {/* Stepper Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-emerald-500' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Role Confirmation */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-editorial text-lg font-bold text-white">
              1. Confirm Your Platform Persona
            </h2>
            <p className="text-xs text-stone-400">
              Select the operational role state that matches your institutional duties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((rKey) => {
                const cfg = ROLE_CONFIGS[rKey];
                const isSelected = rKey === selectedRole;

                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => setSelectedRole(rKey)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950 border-emerald-500 text-white'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{cfg.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-stone-400 line-clamp-2">{cfg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Department & Institution */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-editorial text-lg font-bold text-white">
              2. Assign Institution & Department Zone
            </h2>
            <p className="text-xs text-stone-400">
              Specify the physical campus facility or administrative board.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={user.institution || 'Pacific State University'}
                  disabled
                  className="w-full h-10 px-3 bg-stone-950/50 border border-stone-800 rounded-xl text-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Department / Facility Unit
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Environmental Priorities */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="font-editorial text-lg font-bold text-white">
              3. Set Primary Environmental Focus Area
            </h2>
            <p className="text-xs text-stone-400">
              Choose the primary optimization metric for your role dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Scope 2 Carbon Optimization',
                'HVAC Anomaly Detection',
                'Renewable Microgrid Storage',
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    priority === p
                      ? 'bg-emerald-950 border-emerald-500 text-white'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400'
                  }`}
                >
                  <Target className="h-5 w-5 text-emerald-400 mb-2" />
                  <div className="font-bold text-xs text-white">{p}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Ready Confirmation */}
        {step === 4 && (
          <div className="space-y-4 text-center py-4 animate-in fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/60 border border-emerald-500/50 mx-auto text-emerald-400">
              <Sparkles className="h-8 w-8 animate-bounce" />
            </div>

            <h2 className="font-editorial text-2xl font-bold text-white">
              Workspace Environment Ready!
            </h2>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-400">Selected Role:</span>
                <strong className="text-emerald-400">{ROLE_CONFIGS[selectedRole].label}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Facility:</span>
                <strong className="text-stone-200">{department}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Focus Area:</span>
                <strong className="text-stone-200">{priority}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="text-stone-400 hover:text-stone-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold"
          >
            {step === 4 ? 'Launch Workspace' : 'Continue'} <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
