'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Radio, Bell, Plus, CheckCircle2, Megaphone, Trash2, Eye, ShieldAlert } from 'lucide-react';

interface Broadcast {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  targetRoles: string;
  active: boolean;
  createdAt: string;
}

export default function AdminBroadcastsPage() {
  const { triggerLivePushAlert } = useAuth();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    {
      id: 'bc_101',
      title: 'Scheduled Maintenance: Groq LPU Cluster Upgrade',
      message: 'Groq inference route will undergo a 15-minute scheduled window at 02:00 UTC. Gemini fallback is active.',
      severity: 'warning',
      targetRoles: 'All Roles',
      active: true,
      createdAt: '2026-08-01 07:00',
    },
    {
      id: 'bc_102',
      title: 'Campus Sustainability Challenge Q3 Launch',
      message: 'New dormitory energy reduction challenges are live across Pacific State University campuses.',
      severity: 'info',
      targetRoles: 'Students & Dept Moderators',
      active: true,
      createdAt: '2026-07-31 12:00',
    },
  ]);

  const [titleInput, setTitleInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [severityInput, setSeverityInput] = useState<'info' | 'warning' | 'critical'>('info');
  const [targetRoleInput, setTargetRoleInput] = useState('All Platform Roles');
  const [previewBc, setPreviewBc] = useState<Broadcast | null>(null);
  const [broadcastToDelete, setBroadcastToDelete] = useState<Broadcast | null>(null);

  const handleCreateBroadcast = async () => {
    if (titleInput.trim() && msgInput.trim()) {
      const newBc: Broadcast = {
        id: `bc_${Date.now()}`,
        title: titleInput.trim(),
        message: msgInput.trim(),
        severity: severityInput,
        targetRoles: targetRoleInput,
        active: true,
        createdAt: 'Just now',
      };
      setBroadcasts([newBc, ...broadcasts]);

      // Broadcast live via push SSE channel
      await triggerLivePushAlert({
        title: titleInput.trim(),
        description: msgInput.trim(),
        severity: severityInput,
        location: targetRoleInput,
        source: 'Admin-System-Broadcast',
      });

      setTitleInput('');
      setMsgInput('');
      setPreviewBc(null);
    }
  };

  const handleDelete = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">System Communications</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Global Banner Broadcast Manager
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Publish real-time global notifications, maintenance warnings, and emergency banners across all user dashboards.
            </p>
          </div>
        </div>

        {/* Live Banner Preview Box if Selected */}
        {previewBc && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-md animate-in fade-in ${
              previewBc.severity === 'critical'
                ? 'bg-rose-900 text-white border-rose-700'
                : previewBc.severity === 'warning'
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-[#064E3B] text-white border-emerald-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 shrink-0" />
              <div>
                <strong className="font-bold block text-sm">{previewBc.title}</strong>
                <p className="opacity-90 leading-relaxed">{previewBc.message}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewBc(null)}
              className="text-xs opacity-80 hover:opacity-100"
            >
              Close Preview
            </Button>
          </div>
        )}

        {/* Create Broadcast Form */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Publish New System Broadcast
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Broadcast Title</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Network Maintenance Window"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Target Audience Scope</label>
                <select
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="All Platform Roles">All Platform Roles</option>
                  <option value="Students & Dept Moderators">Students & Dept Moderators</option>
                  <option value="Institution & Regional Admins">Institution & Regional Admins</option>
                  <option value="MLOps & Audit Admins">MLOps & Audit Admins</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Announcement Message Body</label>
              <textarea
                rows={2}
                placeholder="Detailed explanation displayed in top banner modal..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-700">Severity Level:</span>
                <select
                  value={severityInput}
                  onChange={(e) => setSeverityInput(e.target.value as any)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="info">Info (Green)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="critical">Critical (Coral Red)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreviewBc({
                      id: 'preview',
                      title: titleInput || 'Sample Broadcast Title',
                      message: msgInput || 'Sample notification content...',
                      severity: severityInput,
                      targetRoles: targetRoleInput,
                      active: true,
                      createdAt: 'Preview',
                    })
                  }
                  className="text-xs"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> Live Preview
                </Button>
                <Button variant="primary" size="sm" onClick={handleCreateBroadcast}>
                  <Megaphone className="h-3.5 w-3.5 mr-1.5" /> Broadcast Now
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Broadcasts List */}
        <div className="space-y-3">
          <h3 className="font-editorial text-base font-bold text-stone-900">
            Active System Broadcast Banners ({broadcasts.length})
          </h3>

          {broadcasts.map((bc) => (
            <Card key={bc.id} className="p-4 bg-white/95 border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={bc.severity === 'critical' ? 'coral' : bc.severity === 'warning' ? 'amber' : 'emerald'}>
                    {bc.severity.toUpperCase()}
                  </Badge>
                  <h4 className="font-semibold text-xs text-stone-900">{bc.title}</h4>
                </div>

                <button
                  onClick={() => setBroadcastToDelete(bc)}
                  className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete system broadcast"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                {bc.message}
              </p>

              <div className="flex justify-between text-[10px] text-stone-400 font-mono pt-1">
                <span>Target: {bc.targetRoles}</span>
                <span>Published: {bc.createdAt}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog for Deleting System Broadcast */}
        <ConfirmationDialog
          isOpen={Boolean(broadcastToDelete)}
          onClose={() => setBroadcastToDelete(null)}
          onConfirm={() => {
            if (broadcastToDelete) {
              handleDelete(broadcastToDelete.id);
              setBroadcastToDelete(null);
            }
          }}
          title="Delete System Broadcast?"
          description={
            broadcastToDelete ? (
              <div className="space-y-2">
                <p>
                  You are about to unpublish and permanently delete the global banner notification{' '}
                  <strong className="text-rose-950 dark:text-rose-100 font-bold">&quot;{broadcastToDelete.title}&quot;</strong>.
                </p>
                <div className="p-2.5 bg-rose-100/60 dark:bg-rose-950/60 rounded-xl font-mono text-[11px] text-rose-900 dark:text-rose-200">
                  Target Audience: {broadcastToDelete.targetRoles}
                </div>
                <p className="text-[11px] opacity-80">
                  This banner will immediately vanish from all online user dashboards.
                </p>
              </div>
            ) : ''
          }
          confirmText="Delete Broadcast"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AppShell>
  );
}
