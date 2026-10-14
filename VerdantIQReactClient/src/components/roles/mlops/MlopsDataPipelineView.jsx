import React, { useState } from 'react';
import { Workflow, Play } from 'lucide-react';

export function MlopsDataPipelineView() {
  const [stages, setStages] = useState([
    { id: 'stage_1', name: 'Raw Utility Intake Normalizer', type: 'Ingestion & Unit Standardizer', status: 'completed', recordsProcessed: 1420, runtimeMs: 38 },
    { id: 'stage_2', name: 'Outlier & Anomaly Filter', type: 'IQR Statistical Cleanser', status: 'completed', recordsProcessed: 1412, runtimeMs: 24 },
    { id: 'stage_3', name: 'Regional Emission Factor Mapper', type: 'Factor Correlation Matrix', status: 'completed', recordsProcessed: 1412, runtimeMs: 19 },
    { id: 'stage_4', name: 'Holt-Winters Level/Trend Matrix', type: 'Time-Series Feature Pipeline', status: 'idle', recordsProcessed: 0, runtimeMs: 0 },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleRunPipeline = () => {
    setIsRunning(true);
    setTimeout(() => {
      setStages(prev =>
        prev.map(s => ({
          ...s,
          status: 'completed',
          recordsProcessed: 1420,
          runtimeMs: Math.floor(Math.random() * 30 + 15),
        }))
      );
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-emerald-400" />
            <span>ETL Data Pipeline & Feature Store Synchronization</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Ingestion, deduplication, and mathematical transformation of campus utility readings into modeling tensors.
          </p>
        </div>
        <button
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isRunning ? 'Executing Pipeline...' : 'Trigger Full Pipeline'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="p-3.5 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-mono text-emerald-400 font-bold text-[11px]">
                {idx + 1}
              </span>
              <div>
                <div className="font-semibold text-white">{stage.name}</div>
                <div className="text-[11px] text-neutral-400">{stage.type}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-right">
              <div>
                <div className="font-mono text-emerald-400 font-semibold">{stage.recordsProcessed} docs</div>
                <div className="text-[10px] text-neutral-500">{stage.runtimeMs} ms</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                stage.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {stage.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
