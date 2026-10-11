'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import { ShieldAlert, Lock, ArrowRight, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function AccessDeniedPage() {
  const { role, roleConfig, switchRole } = useAuth();
  const toast = useToast();

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Banner */}
        <Card className="p-6 bg-rose-950/20 border-rose-800/40 text-stone-900">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-900 text-rose-100 flex-shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="coral">403 Access Restricted</Badge>
                <span className="text-xs font-mono text-stone-500">HTTP Status 403 Forbidden</span>
              </div>
              <h1 className="font-editorial text-2xl font-bold text-stone-900">
                Insufficient Role Elevation Matrix
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                You are currently logged in as <strong className="text-stone-900">{roleConfig.label}</strong>. Certain operational administrative modules require Platform Admin or ML Ops elevation.
              </p>
            </div>
          </div>
        </Card>

        {/* Permission Matrix Table */}
        <Card className="p-5 space-y-4">
          <h2 className="font-editorial text-lg font-bold text-stone-900">
            Role Permission Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <th className="py-2.5 px-3">Role Persona</th>
                  <th className="py-2.5 px-3">Dashboard Route</th>
                  <th className="py-2.5 px-3">HVAC Controls</th>
                  <th className="py-2.5 px-3">ML Telemetry</th>
                  <th className="py-2.5 px-3">Auditor Verification</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(Object.keys(ROLE_CONFIGS) as RoleType[]).map((rKey) => {
                  const cfg = ROLE_CONFIGS[rKey];
                  const isCurrent = rKey === role;

                  return (
                    <tr key={rKey} className={isCurrent ? 'bg-emerald-50/50 font-medium' : ''}>
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span>{cfg.label}</span>
                        {isCurrent && <Badge variant="emerald">Active</Badge>}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500">{cfg.dashboardPath}</td>
                      <td className="py-2.5 px-3">
                        {['dept', 'institution', 'admin'].includes(rKey) ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-stone-300" />
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {['mlops', 'admin'].includes(rKey) ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-stone-300" />
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {['audit', 'region', 'institution'].includes(rKey) ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <X className="h-4 w-4 text-stone-300" />
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <Button
                          variant={isCurrent ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            switchRole(rKey);
                            toast.success('Role Switched', `Active role is now ${cfg.label}`);
                          }}
                        >
                          {isCurrent ? 'Active' : 'Switch Role'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
