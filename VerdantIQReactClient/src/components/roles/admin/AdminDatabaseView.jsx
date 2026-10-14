import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Layers, 
  Server
} from 'lucide-react';

export function AdminDatabaseView() {
  const [backupStatus, setBackupStatus] = useState('idle'); // idle | running | completed
  const [restoreTestStatus, setRestoreTestStatus] = useState('idle'); // idle | testing | success
  const [autoScaleThreshold, setAutoScaleThreshold] = useState(80);
  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);
  const [backupScheduleCron, setBackupScheduleCron] = useState('0 2 * * *');
  const [retentionDays, setRetentionDays] = useState(30);

  const collections = [
    { name: 'campus_readings', documents: '14,280', size: '3.4 MB', indexes: 4, status: 'Healthy', engine: 'WiredTiger' },
    { name: 'water_records', documents: '8,420', size: '1.2 MB', indexes: 3, status: 'Healthy', engine: 'WiredTiger' },
    { name: 'waste_records', documents: '7,110', size: '980 KB', indexes: 3, status: 'Healthy', engine: 'WiredTiger' },
    { name: 'audit_logs', documents: '1,240,110', size: '890 MB', indexes: 8, status: 'Healthy (SHA-256 Chained)', engine: 'WiredTiger' },
    { name: 'student_proofs', documents: '3,420', size: '4.8 MB', indexes: 5, status: 'Healthy', engine: 'WiredTiger' },
    { name: 'hvac_schedules', documents: '520', size: '240 KB', indexes: 2, status: 'Healthy', engine: 'WiredTiger' },
    { name: 'user_credentials', documents: '8,950', size: '24 MB', indexes: 5, status: 'Encrypted (Argon2id)', engine: 'WiredTiger' },
  ];

  const minioBuckets = [
    { bucket: 's3-telemetry-raw-logs', objects: '1,840,200', size: '124.8 GB', retention: '90 days', enc: 'AES-256' },
    { bucket: 's3-pdf-audit-exports', objects: '14,200', size: '8.4 GB', retention: '365 days', enc: 'KMS Managed' },
    { bucket: 's3-mlops-model-weights', objects: '420', size: '48.2 GB', retention: 'Indefinite', enc: 'SSE-S3' },
    { bucket: 's3-student-proof-evidence', objects: '38,910', size: '34.6 GB', retention: '180 days', enc: 'AES-256' },
  ];

  const handleRunBackup = () => {
    setBackupStatus('running');
    setTimeout(() => {
      setBackupStatus('completed');
    }, 1200);
  };

  const handleTestRestore = () => {
    setRestoreTestStatus('testing');
    setTimeout(() => {
      setRestoreTestStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-teal-400" />
            <span>MongoDB Atlas Cluster & MinIO Storage Governance</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Snapshot backup orchestrator, S3 bucket storage quotas, auto-scale thresholds & disaster recovery validation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestRestore}
            disabled={restoreTestStatus === 'testing'}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-sky-400 ${restoreTestStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>{restoreTestStatus === 'testing' ? 'Validating Dry-Run...' : 'Test Snapshot Restore'}</span>
          </button>

          <button
            onClick={handleRunBackup}
            disabled={backupStatus === 'running'}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${backupStatus === 'running' ? 'animate-pulse' : ''}`} />
            <span>{backupStatus === 'running' ? 'Creating Snapshot...' : 'Trigger Snapshot Backup'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {backupStatus === 'completed' && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cluster Snapshot created: <strong className="font-mono text-white">SHA256:e8f9...31c0</strong> (Encrypted tarball stored in MinIO cold tier).</span>
          </div>
          <button onClick={() => setBackupStatus('idle')} className="text-emerald-400 hover:text-white underline text-[11px] cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {restoreTestStatus === 'success' && (
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs text-sky-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Dry-run restore test verified: 7 MongoDB collections restored to isolated sandbox without schema checksum faults.</span>
          </div>
          <button onClick={() => setRestoreTestStatus('idle')} className="text-sky-400 hover:text-white underline text-[11px] cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Cluster Capacity</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">4.72 <span className="text-xs font-normal text-neutral-400">GB / 20 GB</span></div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: '23.6%' }} />
          </div>
          <div className="text-[10px] text-teal-300 mt-1">23.6% Atlas Replica Pool Utilized</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>MinIO / S3 Objects</span>
            <HardDrive className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">216.0 <span className="text-xs font-normal text-neutral-400">GB</span></div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '43.2%' }} />
          </div>
          <div className="text-[10px] text-sky-300 mt-1">4 Active Buckets with Retention</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Connection Pool</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">42 <span className="text-xs font-normal text-neutral-400">/ 500</span></div>
          <div className="text-[10px] text-neutral-400 mt-2">Cache hit ratio: 99.4% · Latency 2.1ms</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Auto-Scale Status</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white">{autoScaleEnabled ? 'Dynamic Scale Active' : 'Manual Static'}</div>
          <div className="text-[10px] text-amber-300 mt-2">Threshold: {autoScaleThreshold}% disk trigger</div>
        </div>
      </div>

      {/* Database Collections Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>MongoDB Collections Health & Index Inspection</span>
          </h3>
          <span className="text-xs text-neutral-400">Engine: WiredTiger Document Store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2 px-3">Collection Name</th>
                <th className="py-2 px-3">Document Count</th>
                <th className="py-2 px-3">Storage Size</th>
                <th className="py-2 px-3">B-Tree Indexes</th>
                <th className="py-2 px-3">Storage Engine</th>
                <th className="py-2 px-3">Security & Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {collections.map((col, idx) => (
                <tr key={idx} className="hover:bg-white/5 font-mono text-[11px]">
                  <td className="py-2 px-3 text-white font-semibold">{col.name}</td>
                  <td className="py-2 px-3">{col.documents}</td>
                  <td className="py-2 px-3 text-teal-300">{col.size}</td>
                  <td className="py-2 px-3">{col.indexes} keys</td>
                  <td className="py-2 px-3 text-neutral-400">{col.engine}</td>
                  <td className="py-2 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      {col.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MinIO S3 Buckets & Backup Schedules */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: MinIO S3 Buckets */}
        <div className="fluent-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-sky-400" />
            <span>MinIO / AWS S3 Compatible Object Buckets</span>
          </h3>
          <div className="space-y-2 text-xs">
            {minioBuckets.map((b, i) => (
              <div key={i} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white font-mono text-[11px]">{b.bucket}</div>
                  <div className="text-[10px] text-neutral-400">{b.objects} objects · Enc: {b.enc}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sky-400 font-bold">{b.size}</div>
                  <div className="text-[10px] text-neutral-500">Retention: {b.retention}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Automated Backup Policy & Scaling Controls */}
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Automated Backup Schedules & Auto-Scale Policy</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-neutral-300 mb-1">Backup Cron Expression</label>
              <input
                type="text"
                value={backupScheduleCron}
                onChange={(e) => setBackupScheduleCron(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono"
              />
              <span className="text-[10px] text-neutral-500">Daily at 02:00 UTC (Cluster low-traffic window)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1">Retention Duration (Days)</label>
                <input
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Auto-Scale Trigger ({autoScaleThreshold}%)</label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={autoScaleThreshold}
                  onChange={(e) => setAutoScaleThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-neutral-300">Enable Automated Volume Resizing</span>
              <button
                onClick={() => setAutoScaleEnabled(!autoScaleEnabled)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-colors cursor-pointer ${
                  autoScaleEnabled ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {autoScaleEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
