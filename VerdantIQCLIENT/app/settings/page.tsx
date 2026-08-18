'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Settings, Bell, Palette, Key, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { viewMode, setViewMode } = useAuth();
  const toast = useToast();

  const [sseInterval, setSseInterval] = useState('8');
  const [apiKeyMock, setApiKeyMock] = useState('viq_live_9921_x884a2_emerald');

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-stone-200 pb-4">
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            Platform Settings & Service Options
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage mock service interfaces, SSE notification polling, and UI density defaults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-700" />
                <span>Primary View Density</span>
              </CardTitle>
              <CardDescription>
                Primary app shell layout mode configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950 text-white border border-emerald-600 font-bold flex items-center justify-between">
                <span>Executive Desktop View</span>
                <Badge variant="emerald" dot>Active Default</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-700" />
                <span>Mock SSE Telemetry Stream</span>
              </CardTitle>
              <CardDescription>
                Control fake real-time alert event frequency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-500 font-medium">Event Stream Interval (seconds)</label>
                <select
                  value={sseInterval}
                  onChange={(e) => {
                    setSseInterval(e.target.value);
                    toast.success('SSE Interval Updated', `New events fake-appended every ${e.target.value}s`);
                  }}
                  className="w-full h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                >
                  <option value="4">4 seconds (Fast)</option>
                  <option value="8">8 seconds (Default)</option>
                  <option value="15">15 seconds (Relaxed)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-700" />
                <span>Service Layer Mock Interface Configuration</span>
              </CardTitle>
              <CardDescription>
                All data in VerdantIQ is currently abstracted behind `/lib/services/*.ts` for seamless backend pluggability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-900 text-stone-200 font-mono text-[11px] space-y-1">
                <div>import &#123; authService &#125; from &quot;@/lib/services/authService&quot;;</div>
                <div>import &#123; metricsService &#125; from &quot;@/lib/services/metricsService&quot;;</div>
                <div>import &#123; notificationsService &#125; from &quot;@/lib/services/notificationsService&quot;;</div>
                <div>import &#123; assistantService &#125; from &quot;@/lib/services/assistantService&quot;;</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="emerald" dot>Ready for Real API Injection</Badge>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast.success('Service Configuration Verified', 'Service layer mock contracts valid.')}
                >
                  Verify Service Abstraction
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
