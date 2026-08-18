// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Cpu,
  History,
  Save,
  CheckCircle2,
  Building2,
  Check,
  Zap,
  Home,
  Sliders,
} from 'lucide-react';
import { DigitalTwinDorm,  } from '@/lib/services/userDataService';

export default function StudentDigitalTwinPage() {
  const [versions, setVersions] = useState<DigitalTwinDorm[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>('dummy_id');

  const currentTwin = versions.find((v) => v.id === activeVersionId) || { housingType: 'dorm_suite', roomSizeSqFt: 150, roommates: 1, appliances: [] } as any;
  const [housingType, setHousingType] = useState<DigitalTwinDorm['housingType']>(currentTwin.housingType);
  const [roomSizeSqFt, setRoomSizeSqFt] = useState<number>(currentTwin.roomSizeSqFt);
  const [roommates, setRoommates] = useState<number>(currentTwin.roommates);

  // Dorm/Hostel vs Home Toggle
  const [mode, setMode] = useState<'dorm_hostel' | 'off_campus_home'>('dorm_hostel');

  const availableAppliances = [
    'Mini Fridge (EnergyStar)',
    'Custom Gaming PC (650W PSU)',
    'LED Desk Lamp',
    'Microwave 900W',
    'Portable Fan',
    'Portable AC / Space Heater',
  ];

  const [selectedAppliances, setSelectedAppliances] = useState<string[]>(currentTwin.appliances);
  const [versionNote, setVersionNote] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const toggleAppliance = (appliance: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(appliance) ? prev.filter((a) => a !== appliance) : [...prev, appliance]
    );
  };

  const calculatedMonthlyKwh = Math.max(
    35,
    Math.round(
      (mode === 'dorm_hostel' ? 100 : 250) +
        roomSizeSqFt * 0.12 +
        roommates * 18 +
        (selectedAppliances.includes('Custom Gaming PC (650W PSU)') ? 55 : 0) +
        (selectedAppliances.includes('Mini Fridge (EnergyStar)') ? 25 : 0) +
        (selectedAppliances.includes('Portable AC / Space Heater') ? 75 : 0)
    )
  );

  const calculatedMonthlyCarbonKg = Math.round(calculatedMonthlyKwh * 0.25 * 10) / 10;

  const handleSelectVersion = (ver: DigitalTwinDorm) => {
    setActiveVersionId(ver.id);
    setHousingType(ver.housingType);
    setRoomSizeSqFt(ver.roomSizeSqFt);
    setRoommates(ver.roommates);
    setSelectedAppliances(ver.appliances);
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    const versionNum = `v1.${versions.length + 1}`;
    const newVer: DigitalTwinDorm = {
      id: `dtw_v${Date.now()}`,
      version: versionNum,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      note: versionNote.trim() || `Student ${mode === 'dorm_hostel' ? 'dorm' : 'home'} twin snapshot ${versionNum}`,
      housingType: mode === 'dorm_hostel' ? 'dorm_shared' : 'off_campus_apt',
      roomSizeSqFt,
      roommates,
      appliances: selectedAppliances,
      hasMiniFridge: selectedAppliances.some((a) => a.includes('Fridge')),
      hasGamingPc: selectedAppliances.some((a) => a.includes('Gaming PC')),
      hasAC: selectedAppliances.some((a) => a.includes('AC')),
      estMonthlyKwh: calculatedMonthlyKwh,
      estMonthlyCarbonKg: calculatedMonthlyCarbonKg,
    };

    setVersions([newVer, ...versions]);
    setActiveVersionId(newVer.id);
    setVersionNote('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Lightweight Student Twin</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Student Housing & Dorm Digital Twin
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Parametric energy model for campus dorms, hostel quads, and off-campus student apartments.
            </p>
          </div>

          {/* Dorm/Hostel vs Home Toggle Button Group */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('dorm_hostel');
                setHousingType('dorm_shared');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
                mode === 'dorm_hostel' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Dorm / Hostel Quad</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('off_campus_home');
                setHousingType('off_campus_apt');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
                mode === 'off_campus_home' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Off-Campus Home / Apt</span>
            </button>
          </div>
        </div>

        {/* Calculated Impact Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#064E3B] text-white shadow-md">
          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">
              {mode === 'dorm_hostel' ? 'Est. Monthly Dorm Power' : 'Est. Monthly Apartment Power'}
            </span>
            <div className="text-2xl font-bold font-mono text-white">{calculatedMonthlyKwh} kWh / mo</div>
            <p className="text-[10px] text-emerald-100/70">
              {mode === 'dorm_hostel' ? 'Founders Hall Room 304 node load' : 'Off-campus apartment submeter'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Monthly Room Carbon</span>
            <div className="text-2xl font-bold font-mono text-emerald-300">{calculatedMonthlyCarbonKg} kg CO2e</div>
            <p className="text-[10px] text-emerald-100/70">32% below campus dorm average</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Active Electronics</span>
            <div className="text-xs font-semibold text-white">
              {selectedAppliances.join(' • ') || 'Basic Study Setup'}
            </div>
          </div>
        </div>

        {/* Form & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-700" />
                <span>{mode === 'dorm_hostel' ? 'On-Campus Dorm Setup' : 'Off-Campus Home Setup'}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleSaveVersion} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Housing Category</label>
                    <select
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="dorm_single">Dorm Single Room</option>
                      <option value="dorm_shared">Dorm Shared Suite</option>
                      <option value="hostel_suite">Hostel Quad</option>
                      <option value="off_campus_apt">Off-Campus Apartment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Room Area (sq ft)</label>
                    <input
                      type="number"
                      min={100}
                      max={2000}
                      step={20}
                      value={roomSizeSqFt}
                      onChange={(e) => setRoomSizeSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Roommates / Occupants</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={roommates}
                      onChange={(e) => setRoommates(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                {/* Appliances Checklist */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 block">Dorm / Room Electronics & Plug Loads</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAppliances.map((appliance) => {
                      const isSelected = selectedAppliances.includes(appliance);
                      return (
                        <button
                          type="button"
                          key={appliance}
                          onClick={() => toggleAppliance(appliance)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span className="truncate">{appliance}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save Snapshot */}
                <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-900 block">Save Digital Twin Version</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Added smart plug schedule for gaming rig..."
                      value={versionNote}
                      onChange={(e) => setVersionNote(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                    <Button type="submit" variant="primary" size="sm" className="gap-1.5 whitespace-nowrap cursor-pointer">
                      <Save className="h-4 w-4" />
                      <span>Save Snapshot</span>
                    </Button>
                  </div>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-800 font-medium block">Dorm twin snapshot saved!</span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* History Sidebar */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-700" />
                <span>Version Snapshots</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  onClick={() => handleSelectVersion(ver)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    ver.id === activeVersionId
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant={ver.id === activeVersionId ? 'emerald' : 'stone'} size="xs">{ver.version}</Badge>
                    <span className="text-[10px] font-mono text-stone-400">{ver.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-700 font-medium mb-1">{ver.note}</p>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">{ver.estMonthlyKwh} kWh/mo</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
