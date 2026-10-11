'use client';

import React, { useState } from 'react';
import { InstitutionRecord } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { GitCompare, CheckCircle2, AlertTriangle, ArrowUpDown } from 'lucide-react';

interface Props {
  institutions: InstitutionRecord[];
}

export const InstitutionComparison: React.FC<Props> = ({ institutions }) => {
  const activeInsts = institutions.filter((i) => i.status !== 'deactivated');
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    activeInsts.slice(0, 3).map((i) => i.id)
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedInsts = activeInsts.filter((i) => selectedIds.includes(i.id));

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-emerald-800" />
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Side-by-Side Institution Comparison Matrix
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Select up to 4 institutions to benchmark EUI, forecast MAPE, student count, and compliance targets side-by-side.
          </p>
        </div>

        {/* Institution selection pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {activeInsts.map((inst) => {
            const isSelected = selectedIds.includes(inst.id);
            return (
              <button
                key={inst.id}
                onClick={() => toggleSelect(inst.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#064E3B] text-white border-emerald-800 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {inst.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-700 font-bold">
              <th className="p-3 w-48">Metric / Dimension</th>
              {selectedInsts.map((inst) => (
                <th key={inst.id} className="p-3">
                  <div className="font-bold text-stone-900 text-sm">{inst.name}</div>
                  <div className="text-[11px] font-mono text-stone-500 font-normal">{inst.domain}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">District Region</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3 font-medium text-stone-700">
                  {inst.regionDistrict}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Status & Support Flag</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3">
                  <Badge variant={inst.status === 'needs_support' ? 'amber' : 'emerald'}>
                    {inst.status === 'needs_support' ? 'Needs Support' : 'Optimal'}
                  </Badge>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Current EUI (kBtu / sqft)</td>
              {selectedInsts.map((inst) => {
                const diff = inst.currentEUI - inst.targetEUI;
                return (
                  <td key={inst.id} className="p-3">
                    <span className="font-bold text-sm text-stone-900">{inst.currentEUI}</span>
                    <span className="text-[11px] text-stone-500 ml-1">/ Target {inst.targetEUI}</span>
                    <span className={`block text-[10px] font-medium ${diff <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {diff <= 0 ? `Met (-${Math.abs(diff).toFixed(1)})` : `Exceeds (+${diff.toFixed(1)})`}
                    </span>
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Carbon Intensity (gCO2e)</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3">
                  <span className="font-bold text-sm text-stone-900">{inst.carbonIntensity}</span>
                  <span className="text-[11px] text-stone-500 ml-1">gCO2e/kWh</span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Forecast Accuracy MAPE</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3">
                  <span className="font-bold text-sm text-stone-900">{inst.forecastAccuracyPct}%</span>
                  <span className="text-[11px] text-stone-500 ml-1">({inst.forecastErrorMapePct}% error)</span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Student Population</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3 font-medium text-stone-800">
                  {inst.studentCount.toLocaleString()} Students
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-stone-600 bg-stone-50/40">Compliance Alignment</td>
              {selectedInsts.map((inst) => (
                <td key={inst.id} className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          inst.complianceRate >= 90
                            ? 'bg-emerald-600'
                            : inst.complianceRate >= 80
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${inst.complianceRate}%` }}
                      />
                    </div>
                    <span className="font-bold text-stone-900">{inst.complianceRate}%</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
