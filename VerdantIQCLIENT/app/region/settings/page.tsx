// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RegionalPolicyConfig } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, ShieldCheck, CheckCircle2, Sliders, Cpu, Lock } from 'lucide-react';

export default function RegionalSettingsPage() {
  const [config, setConfig] = useState<RegionalPolicyConfig>(() => ([] as any));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    ([] as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Regional Policy Presets</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional Default-Policy Configuration for New Institutions
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure auto-applied presets, Spring Boot endpoint URLs, and privacy boundaries for newly onboarded campuses.
            </p>
          </div>

          <Button onClick={handleSave} className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs">
            Save Policy Presets
          </Button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Regional policy configuration successfully saved!
          </div>
        )}

        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baseline Presets */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4 text-xs">
            <h3 className="font-editorial text-base font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-800" /> Default Onboarding Baselines
            </h3>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Default Target EUI (kBtu / sq ft)</label>
              <input
                type="number"
                value={config.defaultEUIThreshold}
                onChange={(e) => setConfig({ ...config, defaultEUIThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Default Carbon Cap (gCO2e / kWh)</label>
              <input
                type="number"
                value={config.defaultCarbonCap}
                onChange={(e) => setConfig({ ...config, defaultCarbonCap: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Forecast Audit Interval (Days)</label>
              <input
                type="number"
                value={config.forecastAuditIntervalDays}
                onChange={(e) => setConfig({ ...config, forecastAuditIntervalDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Spring Boot & Privacy Config */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4 text-xs">
            <h3 className="font-editorial text-base font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-800" /> Spring Boot Gateway & Privacy Settings
            </h3>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Spring Boot Provisioning Endpoint</label>
              <input
                type="text"
                value={config.springBootEndpoint}
                onChange={(e) => setConfig({ ...config, springBootEndpoint: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Regional Grid ISO Identifier</label>
              <input
                type="text"
                value={config.regionalGridIsoName}
                onChange={(e) => setConfig({ ...config, regionalGridIsoName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableSpringAutoProvisioning}
                  onChange={(e) => setConfig({ ...config, enableSpringAutoProvisioning: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="font-semibold text-stone-800">Auto-execute Spring Boot provisioning upon request approval</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.privacyRawLogEnforcement}
                  onChange={(e) => setConfig({ ...config, privacyRawLogEnforcement: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="font-semibold text-stone-800">Enforce raw log isolation at local campus tier (Strict Privacy)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
