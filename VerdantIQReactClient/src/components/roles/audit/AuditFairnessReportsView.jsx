import React, { useState } from 'react';
import { Scale } from 'lucide-react';

export function AuditFairnessReportsView() {
  const [reports] = useState([
    {
      id: 'FAIR-2026-Q2',
      title: 'Student Challenge EcoPoint Reward Distribution Parity',
      metrics: 'Demographic parity ratio = 0.96 across all STEM & Humanities departments',
      status: 'Compliant',
      evaluatedDate: '2026-07-28',
      summary: 'Points verification rate shows no statistically significant variance across student majors or residency dorms.',
    },
    {
      id: 'FAIR-2026-Q1',
      title: 'Campus Solar Energy Allocation Equity Assessment',
      metrics: 'Gini coefficient on campus energy reduction rewards = 0.18',
      status: 'Compliant',
      evaluatedDate: '2026-04-15',
      summary: 'Energy conservation incentives were evenly distributed among all dormitories and athletic facilities.',
    },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Algorithmic Fairness, Bias & Parity Audit Reports</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Automated audits testing EcoPoint awards, student leaderboards, and resource allocations for equity.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map(r => (
          <div key={r.id} className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{r.title}</span>
                <span className="text-neutral-500 font-mono ml-2">({r.id})</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold uppercase">
                {r.status}
              </span>
            </div>
            <div className="p-2.5 rounded bg-neutral-950 text-[11px] text-neutral-300 space-y-1">
              <div><span className="text-neutral-500">Evaluated Statistical Metric: </span><span className="text-emerald-400 font-mono">{r.metrics}</span></div>
              <div className="text-neutral-400">"{r.summary}"</div>
              <div className="text-[10px] text-neutral-500 font-mono pt-1">Audit Evaluated: {r.evaluatedDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
