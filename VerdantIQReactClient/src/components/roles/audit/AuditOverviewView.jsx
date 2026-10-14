import React, { useState } from 'react';
import { Eye } from 'lucide-react';

export function AuditOverviewView() {
  const [anonymizedMetrics] = useState([
    { cohortId: 'COHORT-PACIFIC-WEST', studentSample: 4500, avgKwhReductionPct: 14.2, verifiedActions: 1820, privacyNoiseApplied: 'Laplace (ε=0.5)' },
    { cohortId: 'COHORT-CASCADIA-NORTH', studentSample: 2900, avgKwhReductionPct: 18.6, verifiedActions: 1140, privacyNoiseApplied: 'Laplace (ε=0.5)' },
    { cohortId: 'COHORT-DESERT-BASIN', studentSample: 3100, avgKwhReductionPct: 9.8, verifiedActions: 890, privacyNoiseApplied: 'Laplace (ε=0.5)' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Anonymized Research Overview & Differentially Private Cohorts</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Exportable peer-reviewed benchmarks with k-anonymity (k=50) and Laplace differential privacy.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-neutral-300">
          <thead className="border-b border-white/10 text-neutral-400">
            <tr>
              <th className="py-2.5 px-3">Anonymized Cohort ID</th>
              <th className="py-2.5 px-3">Sample Count (n)</th>
              <th className="py-2.5 px-3">Avg Reduction (%)</th>
              <th className="py-2.5 px-3">Verified EcoActions</th>
              <th className="py-2.5 px-3">Privacy Guarantee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {anonymizedMetrics.map(m => (
              <tr key={m.cohortId} className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-mono text-emerald-400 font-medium">{m.cohortId}</td>
                <td className="py-2.5 px-3">{m.studentSample.toLocaleString()} students</td>
                <td className="py-2.5 px-3 font-mono font-bold text-white">{m.avgKwhReductionPct}%</td>
                <td className="py-2.5 px-3 font-mono">{m.verifiedActions.toLocaleString()}</td>
                <td className="py-2.5 px-3 font-mono text-teal-400">{m.privacyNoiseApplied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
