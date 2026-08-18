'use client';

import React, { useState } from 'react';
import { InstitutionRecord } from '@/lib/services/regionService';
import { MapPin, ShieldCheck, AlertTriangle, Layers, Info, ArrowUpRight, Zap, Building } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Props {
  institutions: InstitutionRecord[];
  onSelectInstitution?: (inst: InstitutionRecord) => void;
}

export const RegionalChoroplethMap: React.FC<Props> = ({ institutions, onSelectInstitution }) => {
  const [selectedMetric, setSelectedMetric] = useState<'eui' | 'carbon' | 'accuracy'>('eui');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [hoveredInst, setHoveredInst] = useState<InstitutionRecord | null>(null);

  // SVG District Regions
  const districts = [
    {
      id: 'District 1 (Bay Area North)',
      name: 'District 1: Bay Area North',
      path: 'M 40,60 L 180,40 L 220,160 L 80,180 Z',
      color: 'fill-emerald-100/80 stroke-emerald-400',
      avgEui: 116.7,
      status: 'optimal',
    },
    {
      id: 'District 2 (Silicon Corridor)',
      name: 'District 2: Silicon Corridor',
      path: 'M 180,40 L 340,30 L 380,170 L 220,160 Z',
      color: 'fill-amber-100/80 stroke-amber-400',
      avgEui: 142.8,
      status: 'warning',
    },
    {
      id: 'District 3 (Northwest Coastal)',
      name: 'District 3: Northwest Coastal',
      path: 'M 40,180 L 220,160 L 200,320 L 40,300 Z',
      color: 'fill-emerald-100/80 stroke-emerald-300',
      avgEui: 98.6,
      status: 'optimal',
    },
    {
      id: 'District 4 (Central Sierra)',
      name: 'District 4: Central Sierra',
      path: 'M 220,160 L 380,170 L 360,320 L 200,320 Z',
      color: 'fill-rose-100/80 stroke-rose-400',
      avgEui: 158.2,
      status: 'needs_support',
    },
  ];

  const getPinColor = (inst: InstitutionRecord) => {
    if (inst.status === 'deactivated') return 'bg-stone-400 border-stone-600 text-stone-100';
    if (selectedMetric === 'eui') {
      if (inst.currentEUI <= inst.targetEUI) return 'bg-emerald-600 border-emerald-200 text-white shadow-emerald-500/30';
      if (inst.currentEUI <= inst.targetEUI * 1.2) return 'bg-amber-500 border-amber-200 text-white shadow-amber-500/30';
      return 'bg-rose-600 border-rose-200 text-white shadow-rose-500/30';
    } else if (selectedMetric === 'carbon') {
      if (inst.carbonIntensity <= inst.targetCarbonIntensity) return 'bg-emerald-600 border-emerald-200 text-white';
      return 'bg-rose-600 border-rose-200 text-white';
    } else {
      if (inst.forecastAccuracyPct >= 90) return 'bg-emerald-600 border-emerald-200 text-white';
      if (inst.forecastAccuracyPct >= 82) return 'bg-amber-500 border-amber-200 text-white';
      return 'bg-rose-600 border-rose-200 text-white';
    }
  };

  const filteredInstitutions = selectedDistrict
    ? institutions.filter((i) => i.regionDistrict === selectedDistrict)
    : institutions;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-800" />
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Regional Performance Choropleth Map
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Geographic performance distribution across partner academic districts. Click district or institution pin for deep-dive.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSelectedMetric('eui')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'eui' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Energy EUI
          </button>
          <button
            onClick={() => setSelectedMetric('carbon')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'carbon' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Carbon Intensity
          </button>
          <button
            onClick={() => setSelectedMetric('accuracy')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              selectedMetric === 'accuracy' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Forecast Accuracy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Map Canvas */}
        <div className="lg:col-span-2 relative bg-stone-900/95 rounded-xl border border-stone-800 p-4 min-h-[340px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Map Overlay Header */}
          <div className="relative z-10 flex items-center justify-between text-xs text-stone-300">
            <span className="font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              West Coast ISO District Geo-Fence
            </span>
            {selectedDistrict && (
              <button
                onClick={() => setSelectedDistrict(null)}
                className="text-stone-400 hover:text-white underline text-xs"
              >
                Reset District Filter
              </button>
            )}
          </div>

          {/* Interactive SVG Choropleth */}
          <div className="relative z-10 my-2 flex items-center justify-center">
            <svg viewBox="0 0 420 350" className="w-full max-w-[480px] h-auto drop-shadow-lg">
              {/* Region Polygons */}
              {districts.map((d) => (
                <g key={d.id}>
                  <path
                    d={d.path}
                    className={`transition-all duration-300 cursor-pointer ${d.color} ${
                      selectedDistrict === d.id ? 'stroke-2 stroke-emerald-300 fill-emerald-200/90' : 'hover:opacity-90'
                    }`}
                    onClick={() => setSelectedDistrict(selectedDistrict === d.id ? null : d.id)}
                  />
                  <text
                    x={
                      d.id.includes('1')
                        ? 100
                        : d.id.includes('2')
                        ? 270
                        : d.id.includes('3')
                        ? 110
                        : 270
                    }
                    y={
                      d.id.includes('1')
                        ? 100
                        : d.id.includes('2')
                        ? 90
                        : d.id.includes('3')
                        ? 240
                        : 240
                    }
                    fill="#374151"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none select-none text-stone-800"
                  >
                    {d.name.split(':')[0]}
                  </text>
                </g>
              ))}

              {/* Institution Pins */}
              {filteredInstitutions.map((inst, index) => {
                // Approximate SVG positioning mapping
                const x = 50 + ((inst.lng - -122.8) / (-121.2 - -122.8)) * 320 + (index % 2) * 15;
                const y = 300 - ((inst.lat - 37.0) / (48.0 - 37.0)) * 240 - index * 10;
                const pinClass = getPinColor(inst);

                return (
                  <g
                    key={inst.id}
                    transform={`translate(${Math.max(40, Math.min(380, x))}, ${Math.max(50, Math.min(300, y))})`}
                    className="cursor-pointer group"
                    onClick={() => onSelectInstitution?.(inst)}
                    onMouseEnter={() => setHoveredInst(inst)}
                    onMouseLeave={() => setHoveredInst(null)}
                  >
                    <circle r="12" className={`${pinClass} border-2 shadow-lg transition-transform group-hover:scale-125`} />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {inst.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover Tooltip card overlay */}
          {hoveredInst && (
            <div className="relative z-20 bg-stone-900/95 border border-emerald-500/40 text-stone-100 rounded-xl p-3 text-xs shadow-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{hoveredInst.name}</span>
                <Badge variant={hoveredInst.status === 'needs_support' ? 'amber' : 'emerald'}>
                  {hoveredInst.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-300 pt-1">
                <div>
                  <span className="text-stone-400 block">EUI</span>
                  <strong>{hoveredInst.currentEUI}</strong> / {hoveredInst.targetEUI}
                </div>
                <div>
                  <span className="text-stone-400 block">Carbon</span>
                  <strong>{hoveredInst.carbonIntensity}</strong> gCO2
                </div>
                <div>
                  <span className="text-stone-400 block">Accuracy</span>
                  <strong>{hoveredInst.forecastAccuracyPct}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="relative z-10 pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Target Met
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Slight Variance
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Needs Support
              </span>
            </div>
            <span className="text-stone-500 italic">5 Registered Regional Campuses</span>
          </div>
        </div>

        {/* Sidebar District & Institution Breakdown */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-xs text-stone-800 uppercase tracking-wider mb-2">
              District Benchmarks Summary
            </h4>
            <div className="space-y-2">
              {districts.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(selectedDistrict === d.id ? null : d.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedDistrict === d.id
                      ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-medium text-stone-900 mb-1">
                    <span>{d.name}</span>
                    <Badge variant={d.status === 'optimal' ? 'emerald' : d.status === 'warning' ? 'amber' : 'coral'}>
                      Avg {d.avgEui} EUI
                    </Badge>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center justify-between">
                    <span>
                      {institutions.filter((i) => i.regionDistrict === d.id).length} Institutions Onboarded
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-stone-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl text-xs space-y-1.5 border border-emerald-800">
            <div className="flex items-center gap-1.5 font-bold text-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Aggregation Privacy Boundary Active</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              Raw member activity logs and individual student telemetry are quarantined at local institution nodes. Region calculations process MongoDB aggregate pipelines only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
