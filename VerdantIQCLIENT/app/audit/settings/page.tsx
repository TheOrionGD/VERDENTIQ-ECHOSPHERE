'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuditSettingsPage() {
  const [epsilon, setEpsilon] = useState<number>(0.5);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">Privacy & Compliance Policy</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Differential Privacy & Retention Settings
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tune Laplace noise parameters ($\epsilon$), set data retention horizons, and select compliance frameworks.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Audit Policy
          </Button>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Differential Privacy Epsilon parameter updated to ε = {epsilon}.
          </div>
        )}

        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4 text-xs">
          <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex justify-between font-mono font-bold text-stone-800">
              <span>Differential Privacy Loss Limit ($\epsilon$)</span>
              <span className="text-emerald-800 text-sm">$\epsilon$ = {epsilon}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <p className="text-[11px] text-stone-500">
              Lower $\epsilon$ values inject higher Gaussian/Laplace noise for maximum mathematical privacy protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Telemetry Data Retention Horizon</label>
              <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <option>7 Years (ISO 50001 Standard)</option>
                <option>10 Years (Academic Longitudinal Study)</option>
                <option>3 Years (Minimal Legal Retention)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Target Compliance Framework</label>
              <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <option>GHG Protocol Scope 1, 2 & 3 + FERPA</option>
                <option>ISO 50001 Energy Management Standard</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
