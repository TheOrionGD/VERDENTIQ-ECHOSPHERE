import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function MlopsAlertsView() {
  const [alerts, setAlerts] = useState([
    {
      id: 'drift_01',
      model: 'Holt-Winters v2.4',
      metric: 'MAE Variance Spike',
      threshold: '5,000 kWh',
      observed: '6,840 kWh',
      severity: 'warning',
      timestamp: '2026-08-01 10:14',
      reason: 'Sudden temperature anomaly in Pacific Central campus created cooling demand out of seasonal bounds.',
      status: 'active',
    },
    {
      id: 'drift_02',
      model: 'HVAC Pareto Solver v3.1',
      metric: 'Comfort Degradation',
      threshold: '< 50/100',
      observed: '44/100',
      severity: 'critical',
      timestamp: '2026-07-29 16:42',
      reason: 'Aggressive curtailment parameter candidate penalized building thermal comfort.',
      status: 'acknowledged',
    },
  ]);

  const handleAcknowledge = (id) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
  };

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Model Concept & Feature Drift Detection Alerts</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Automated divergence monitors tracking statistical distance between training baselines and real-time inference observations.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {alert.severity}
                </span>
                <span className="font-semibold text-white">{alert.model}: {alert.metric}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                alert.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {alert.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded">
              <div><span className="text-neutral-500">Threshold: </span><span className="font-mono text-white">{alert.threshold}</span></div>
              <div><span className="text-neutral-500">Observed: </span><span className="font-mono text-amber-400 font-bold">{alert.observed}</span></div>
              <div><span className="text-neutral-500">Logged: </span><span className="font-mono text-neutral-400">{alert.timestamp}</span></div>
              <div className="col-span-3 text-neutral-300 pt-1">"{alert.reason}"</div>
            </div>

            {alert.status !== 'resolved' && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                >
                  Resolve Alert & Retune Baseline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
