// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LabeledDataBatch } from '@/lib/services/mlopsService';
import {
  Workflow,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Activity,
  AlertCircle,
  Database,
  Layers,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export default function MlopsDataPipelinePage() {
  const [rerunning, setRerunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>('node-3');
  const [labeledBatches, setLabeledBatches] = useState<LabeledDataBatch[]>(
    ([] as any)
  );

  const pipelineNodes = [
    {
      id: 'node-1',
      name: '1. IoT Sensor Telemetry Stream',
      type: 'Kafka Ingestion',
      latency: '4ms',
      throughput: '1,420 msgs/s',
      records: '12.4M rows/day',
      schema: 'JSON (Temp, Humidity, Solar, CO2)',
      qualityScore: '99.8%',
    },
    {
      id: 'node-2',
      name: '2. Isolation Forest Outlier Filtering',
      type: 'PyTorch Anomaly Detection',
      latency: '12ms',
      throughput: '1,420 msgs/s',
      records: '320 anomalous records flagged',
      schema: 'Feature Tensors',
      qualityScore: '98.5%',
    },
    {
      id: 'node-3',
      name: '3. Escalation Label Integration',
      type: 'Human-in-the-Loop Labeled Data',
      latency: 'Instant',
      throughput: '2,690 labeled rows',
      records: 'Escalation resolutions & override feedback',
      schema: 'Parquet Feature Table',
      qualityScore: '97.4%',
    },
    {
      id: 'node-4',
      name: '4. Feature Store Pre-Processing',
      type: 'Feast / Parquet Aggregation',
      latency: '8ms',
      throughput: '380 jobs/s',
      records: '24-hour sliding window vectors',
      schema: 'Normalized Tensors',
      qualityScore: '100%',
    },
    {
      id: 'node-5',
      name: '5. Retrain Artifact Staging',
      type: 'PyTorch / MILP Model Artifact',
      latency: '42ms',
      throughput: 'Candidate Model v2.5',
      records: 'Weights & Biases Checkpoint',
      schema: 'PyTorch JIT Model',
      qualityScore: '100%',
    },
  ];

  const handleRerun = () => {
    setRerunning(true);
    setTimeout(() => setRerunning(false), 1500);
  };

  const handleUpdateBatch = (id: string, status: 'APPROVED' | 'REJECTED') => {
    ([] as any);
    setLabeledBatches([...([] as any)]);
  };

  const selectedNodeObj = pipelineNodes.find((n) => n.id === selectedNode) || pipelineNodes[0];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Workflow className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Inference Data Pipelines</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Training Data Lineage & Pipeline Health Monitoring
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Inspect dataset provenance DAGs, approve labeled escalation resolutions for retraining, and monitor real-time streaming ETL throughput.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleRerun} disabled={rerunning}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${rerunning ? 'animate-spin' : ''}`} />
            {rerunning ? 'Re-evaluating DAG...' : 'Rerun Pipeline DAG Checks'}
          </Button>
        </div>

        {/* Pipeline Lineage DAG Interactive Node Visualizer */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                End-to-End Dataset Lineage DAG
              </h3>
              <p className="text-[11px] text-stone-500">
                Click any pipeline node to inspect data provenance, schema specs, and quality telemetry.
              </p>
            </div>
            <Badge variant="emerald">ALL STAGES OPTIMAL</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {pipelineNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                  selectedNode === node.id
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 line-clamp-1">{node.name}</span>
                  <Badge variant="emerald">OK</Badge>
                </div>
                <p className="text-[10px] text-stone-500 font-mono">{node.type}</p>
                <div className="pt-2 border-t border-stone-200/80 text-[10px] font-mono text-stone-600 space-y-0.5">
                  <div>Latency: <strong>{node.latency}</strong></div>
                  <div>Rate: {node.throughput}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Node Lineage Detail Viewer */}
          {selectedNodeObj && (
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-stone-900 text-sm">{selectedNodeObj.name} Provenance Spec</span>
                <Badge variant="emerald">Quality Score: {selectedNodeObj.qualityScore}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Records Sampled</span>
                  <span className="font-bold text-stone-900">{selectedNodeObj.records}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Data Schema Format</span>
                  <span className="font-bold text-emerald-800">{selectedNodeObj.schema}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Processing Engine</span>
                  <span className="font-bold text-stone-900">{selectedNodeObj.type}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Labeled Data Approval Queue for Retraining */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Labeled Escalation Resolutions Approval Queue
              </h3>
              <p className="text-[11px] text-stone-500">
                Human-in-the-loop review of user escalation feedback prior to merging into retraining feature store.
              </p>
            </div>
            <Badge variant="amber">
              {labeledBatches.filter((b) => b.status === 'PENDING_APPROVAL').length} Pending Approval
            </Badge>
          </div>

          <div className="space-y-3">
            {labeledBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{batch.id}</span>
                    <span className="font-semibold text-stone-800">{batch.source}</span>
                    <Badge variant={batch.status === 'APPROVED' ? 'emerald' : batch.status === 'REJECTED' ? 'coral' : 'amber'}>
                      {batch.status}
                    </Badge>
                  </div>
                  <p className="text-stone-500 font-mono text-[11px]">
                    {batch.recordCount} Records • Label Type: {batch.labelType} • Collected: {batch.dateCollected}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-stone-400 block">Quality Score</span>
                    <strong className="text-emerald-800">{batch.qualityScore}%</strong>
                  </div>

                  {batch.status === 'PENDING_APPROVAL' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateBatch(batch.id, 'REJECTED')}
                        className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateBatch(batch.id, 'APPROVED')}
                        className="text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve for Retrain
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
