'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  Database,
  HardDrive,
  RefreshCw,
  Download,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Clock,
  Sliders,
  RotateCcw,
  Layers,
  FileCode,
} from 'lucide-react';

export default function AdminDatabasePage() {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [restoreTestStatus, setRestoreTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [pendingDbAction, setPendingDbAction] = useState<'backup' | 'restore' | null>(null);
  const [autoScaleThreshold, setAutoScaleThreshold] = useState<number>(80);
  const [autoScaleEnabled, setAutoScaleEnabled] = useState<boolean>(true);
  const [backupScheduleCron, setBackupScheduleCron] = useState<string>('0 2 * * *');
  const [retentionDays, setRetentionDays] = useState<number>(30);

  const collections = [
    { name: 'telemetry_readings', documents: '14,280,490', size: '3.4 GB', indexes: 6, status: 'Healthy' },
    { name: 'milp_optimization_runs', documents: '89,420', size: '420 MB', indexes: 4, status: 'Healthy' },
    { name: 'audit_event_logs', documents: '1,240,110', size: '890 MB', indexes: 8, status: 'Healthy' },
    { name: 'tenant_profiles', documents: '1,420', size: '18 MB', indexes: 3, status: 'Healthy' },
    { name: 'user_credentials', documents: '8,950', size: '24 MB', indexes: 5, status: 'Encrypted' },
  ];

  const minioBuckets = [
    { bucket: 's3-telemetry-raw-logs', objects: '1,840,200', size: '124.8 GB', retention: '90 days' },
    { bucket: 's3-pdf-audit-exports', objects: '14,200', size: '8.4 GB', retention: '365 days' },
    { bucket: 's3-[#064E3B]-model-weights', objects: '420', size: '48.2 GB', retention: 'Indefinite' },
  ];

  const handleRunBackup = () => {
    setBackupStatus('running');
    setTimeout(() => setBackupStatus('completed'), 1400);
  };

  const handleTestRestore = () => {
    setRestoreTestStatus('testing');
    setTimeout(() => setRestoreTestStatus('success'), 1600);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Storage & Database Governance</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              MongoDB, MinIO/S3 & Firebase Oversight
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Storage capacity monitor, MinIO/S3 auto-scaling thresholds, backup cron schedules & Firebase security rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPendingDbAction('restore')} disabled={restoreTestStatus === 'testing'}>
              <RotateCcw className={`h-3.5 w-3.5 mr-1.5 ${restoreTestStatus === 'testing' ? 'animate-spin' : ''}`} />
              {restoreTestStatus === 'testing' ? 'Testing Restore...' : 'Test Snapshot Restore'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setPendingDbAction('backup')} disabled={backupStatus === 'running'}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {backupStatus === 'running' ? 'Creating Snapshot...' : 'Trigger Snapshot Backup'}
            </Button>
          </div>
        </div>

        {backupStatus === 'completed' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Snapshot successfully created: SHA256-a94f82d1c (181.4 GB encrypted)
            </span>
            <Button variant="ghost" size="sm" onClick={() => setBackupStatus('idle')} className="text-emerald-800 text-xs">
              Dismiss
            </Button>
          </div>
        )}

        {restoreTestStatus === 'success' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-blue-700" /> Dry-run restore test verified successfully: 0 record corruptions detected across 5 MongoDB collections.
            </span>
            <Button variant="ghost" size="sm" onClick={() => setRestoreTestStatus('idle')} className="text-blue-800 text-xs">
              Dismiss
            </Button>
          </div>
        )}

        {/* Global Storage Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="MongoDB Cluster Capacity"
            value={4.72}
            target={20.0}
            unit="GB utilized"
            trend="neutral"
            changePercentage={1.2}
            status="optimal"
            subtitle="MongoDB Atlas Replica Set"
          />
          <StatGauge
            title="MinIO S3 Object Storage"
            value={181.4}
            target={500.0}
            unit="GB stored"
            trend="up"
            changePercentage={4.5}
            status="optimal"
            subtitle="Auto-scale volume threshold 80%"
          />
          <StatGauge
            title="Database Connection Pool"
            value={42}
            target={500}
            unit="active connections"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Pool cache hit ratio 99.4%"
          />
        </div>

        {/* Storage Capacity Monitor & Auto-scale Config */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-[#064E3B]" />
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Storage Auto-Scale & Dynamic Disk Volume Thresholds
              </h3>
            </div>
            <Badge variant={autoScaleEnabled ? 'emerald' : 'stone'}>
              {autoScaleEnabled ? 'AUTO-SCALE ACTIVE' : 'MANUAL DISK ALLOCATION'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Auto-Expand Disk Trigger Threshold</span>
                <span className="font-mono text-emerald-800 font-bold">{autoScaleThreshold}% Disk Capacity</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={autoScaleThreshold}
                onChange={(e) => setAutoScaleThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <p className="text-[11px] text-stone-500 font-mono">
                When storage reaches {autoScaleThreshold}%, MinIO object store provisions +100 GB persistent volume automatically.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="font-semibold text-stone-800 block">Backup Automated Schedule & Retention</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 font-mono uppercase block mb-1">Cron Expression</label>
                  <input
                    type="text"
                    value={backupScheduleCron}
                    onChange={(e) => setBackupScheduleCron(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-mono uppercase block mb-1">Retention (Days)</label>
                  <input
                    type="number"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
              <span className="text-[10px] text-emerald-800 font-mono font-semibold block">
                Next automated snapshot: Today at 02:00 UTC ({retentionDays}d lifecycle rule)
              </span>
            </div>
          </div>
        </Card>

        {/* MinIO S3 Buckets Overview */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-3">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            MinIO / S3 Object Storage Buckets
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Bucket Identifier</th>
                  <th className="py-2.5 px-3">Total Objects</th>
                  <th className="py-2.5 px-3">Storage Size</th>
                  <th className="py-2.5 px-3">Lifecycle Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {minioBuckets.map((b) => (
                  <tr key={b.bucket} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">{b.bucket}</td>
                    <td className="py-3 px-3 text-stone-700">{b.objects}</td>
                    <td className="py-3 px-3 font-mono text-emerald-800 font-semibold">{b.size}</td>
                    <td className="py-3 px-3 text-stone-600">{b.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Firebase Security Rules & Config Oversight */}
        <Card className="p-5 bg-orange-50/40 border-orange-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-orange-200 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Firebase Firestore & Auth Configuration Oversight
              </h3>
            </div>
            <Badge variant="amber">Firestore Rules Validated</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-2">
              <span className="font-mono font-bold text-stone-900 block">Project ID: verdantiq-cloud-prod</span>
              <p className="text-stone-600">
                Auth Domain: <code className="font-mono text-emerald-800">verdantiq-cloud-prod.firebaseapp.com</code>
              </p>
              <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Google OAuth & Email/Password Providers Active</span>
              </div>
            </div>

            <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-orange-400 font-bold border-b border-stone-800 pb-1">
                <span>firestore.rules Validator</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <p className="text-stone-400 text-[10px]">
                rules_version = &apos;2&apos;;<br />
                match /databases/{`{database}`}/documents {'{'}<br />
                &nbsp;&nbsp;match /audit_logs/{`{id}`} {'{'} allow read: if request.auth.token.role == &apos;admin&apos;; {'}'}<br />
                {'}'}
              </p>
            </div>
          </div>
        </Card>

        {/* Primary MongoDB Collections */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Primary MongoDB Operational Collections
            </h3>
            <Badge variant="stone">5 Collections Active</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Collection Name</th>
                  <th className="py-2.5 px-3">Document Count</th>
                  <th className="py-2.5 px-3">Storage Size</th>
                  <th className="py-2.5 px-3">Active Indexes</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {collections.map((col) => (
                  <tr key={col.name} className="hover:bg-stone-50/80">
                    <td className="py-3 px-3 font-mono font-semibold text-stone-900">{col.name}</td>
                    <td className="py-3 px-3 text-stone-700">{col.documents}</td>
                    <td className="py-3 px-3 font-mono text-stone-800">{col.size}</td>
                    <td className="py-3 px-3 text-stone-600">{col.indexes} indexes</td>
                    <td className="py-3 px-3">
                      <Badge variant="emerald">{col.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Confirmation Dialog for Database Snapshot / Restore Actions */}
        <ConfirmationDialog
          isOpen={Boolean(pendingDbAction)}
          onClose={() => setPendingDbAction(null)}
          onConfirm={() => {
            if (pendingDbAction === 'backup') {
              handleRunBackup();
            } else if (pendingDbAction === 'restore') {
              handleTestRestore();
            }
            setPendingDbAction(null);
          }}
          title={
            pendingDbAction === 'backup'
              ? 'Trigger On-Demand Cluster Snapshot Backup?'
              : 'Run Dry-Run Snapshot Restore Test?'
          }
          description={
            pendingDbAction === 'backup' ? (
              <div className="space-y-2">
                <p>
                  You are about to initiate an immediate encrypted cluster snapshot across all 5 active MongoDB collections and MinIO S3 buckets.
                </p>
                <p className="text-[11px] opacity-80">
                  This operation may increase temporary I/O utilization on primary database nodes during block serialization.
                </p>
              </div>
            ) : pendingDbAction === 'restore' ? (
              <div className="space-y-2">
                <p>
                  You are about to run a dry-run snapshot restore verification in an isolated container instance.
                </p>
                <p className="text-[11px] opacity-80">
                  This tests cryptographic checksums and document integrity across 14M+ telemetry records.
                </p>
              </div>
            ) : ''
          }
          confirmText={pendingDbAction === 'backup' ? 'Trigger Backup' : 'Run Restore Test'}
          cancelText="Cancel"
          variant="info"
        />
      </div>
    </AppShell>
  );
}
