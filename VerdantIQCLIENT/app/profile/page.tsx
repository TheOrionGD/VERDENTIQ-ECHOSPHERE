'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { User, Mail, Shield, Building, GraduationCap, Calendar, Key, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { user, roleConfig, role } = useAuth();
  const toast = useToast();

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Banner Card */}
        <Card className="p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 border-emerald-800/40 text-stone-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-700 text-stone-950 flex items-center justify-center font-editorial text-2xl font-bold shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-editorial text-2xl font-bold text-white flex items-center gap-2">
                  <span>{user.name}</span>
                  {user.isVerifiedStudent && (
                    <Badge variant="emerald" dot>Verified Academic</Badge>
                  )}
                </h1>
                <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <Badge variant={roleConfig.badgeColor} dot className="px-3 py-1 text-xs">
              {roleConfig.label}
            </Badge>
          </div>
        </Card>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-700" />
                <span>Identity & Role Permissions</span>
              </CardTitle>
              <CardDescription>
                Simulated role state configuration and platform capability bounds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Active Role ID:</span>
                <code className="font-mono text-stone-900 font-bold">{roleConfig.id}</code>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Dashboard Route:</span>
                <code className="font-mono text-emerald-800 font-bold">{roleConfig.dashboardPath}</code>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  Granted Role Permissions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roleConfig.permissions.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-700" />
                <span>Institutional Affiliation</span>
              </CardTitle>
              <CardDescription>
                Campus facility assignment and verified organizational domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Institution:</span>
                <span className="font-semibold text-stone-900">{user.institution || 'VerdantIQ Platform Network'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Department Unit:</span>
                <span className="font-semibold text-stone-900">{user.department || 'Central Operational Services'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Account Created:</span>
                <span className="text-stone-700 font-mono">{user.createdAt}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => toast.success('Profile Credentials Saved', 'Identity state synchronized.')}
              >
                Update Profile Info
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
