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
  RotateCcw,
  Plus,
  CheckCircle2,
  Zap,
  Sun,
  Battery,
  Home,
  Users,
  Check,
} from 'lucide-react';
import { DigitalTwinHouse,  } from '@/lib/services/userDataService';

export default function UserDigitalTwinPage() {
  const [versions, setVersions] = useState<DigitalTwinHouse[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>('dummy_id');

  // Form State
  const currentTwin = versions.find((v) => v.id === activeVersionId) || { houseSizeSqFt: 2000, occupants: 4, homeType: 'single_family', solarCapacityKw: 0, batteryCapacityKwh: 0, evCharger: false, heatPump: false, appliances: [] } as any;
  const [houseSizeSqFt, setHouseSizeSqFt] = useState<number>(currentTwin.houseSizeSqFt);
  const [occupants, setOccupants] = useState<number>(currentTwin.occupants);
  const [homeType, setHomeType] = useState<DigitalTwinHouse['homeType']>(currentTwin.homeType);
  const [solarCapacityKw, setSolarCapacityKw] = useState<number>(currentTwin.solarCapacityKw);
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState<number>(currentTwin.batteryCapacityKwh);
  const [evCharger, setEvCharger] = useState<boolean>(currentTwin.evCharger);
  const [heatPump, setHeatPump] = useState<boolean>(currentTwin.heatPump);

  const [versionNote, setVersionNote] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const availableAppliances = [
    'Heat Pump HVAC',
    'Induction Range',
    'EV Charger (Level 2)',
    'Smart Water Heater',
    'EnergyStar Washer/Dryer',
    'Gas Range',
    'Standard Central HVAC',
    'Smart Dishwasher',
  ];

  const [selectedAppliances, setSelectedAppliances] = useState<string[]>(currentTwin.appliances);

  const toggleAppliance = (appliance: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(appliance) ? prev.filter((a) => a !== appliance) : [...prev, appliance]
    );
  };

  // Instant calculated metrics
  const calculatedEmissionsKg = Math.max(
    800,
    Math.round(
      houseSizeSqFt * 1.8 +
        occupants * 250 -
        solarCapacityKw * 380 -
        batteryCapacityKwh * 80 -
        (heatPump ? 900 : 0) -
        (selectedAppliances.includes('Induction Range') ? 300 : 0)
    )
  );

  const calculatedMonthlySavingsUSD = Math.max(
    0,
    Math.round(
      solarCapacityKw * 22 + batteryCapacityKwh * 8 + (heatPump ? 45 : 0) + (evCharger ? 35 : 0)
    )
  );

  const handleSelectVersion = (ver: DigitalTwinHouse) => {
    setActiveVersionId(ver.id);
    setHouseSizeSqFt(ver.houseSizeSqFt);
    setOccupants(ver.occupants);
    setHomeType(ver.homeType);
    setSolarCapacityKw(ver.solarCapacityKw);
    setBatteryCapacityKwh(ver.batteryCapacityKwh);
    setEvCharger(ver.evCharger);
    setHeatPump(ver.heatPump);
    setSelectedAppliances(ver.appliances);
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    const versionNum = `v${(versions.length + 1).toFixed(1)}`;
    const newVer: DigitalTwinHouse = {
      id: `tw_v${Date.now()}`,
      version: versionNum,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      note: versionNote.trim() || `User customized configuration ${versionNum}`,
      houseSizeSqFt,
      occupants,
      homeType,
      appliances: selectedAppliances,
      solarCapacityKw,
      batteryCapacityKwh,
      evCharger,
      heatPump,
      estAnnualEmissionsKg: calculatedEmissionsKg,
      estMonthlySavingsUSD: calculatedMonthlySavingsUSD,
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
              <Badge variant="emerald">Parametric Building Twin</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Household Digital Twin Builder
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Simulate building thermodynamics, renewable capacity and appliance loads with instant version history.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-stone-600 bg-stone-100 p-2.5 rounded-xl border border-stone-200">
            <span>Active Version:</span>
            <Badge variant="stone">{currentTwin.version}</Badge>
          </div>
        </div>

        {/* Calculated Impact Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#064E3B] text-white shadow-md">
          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Est. Annual Emissions</span>
            <div className="text-2xl font-bold font-mono text-white">{calculatedEmissionsKg.toLocaleString()} kg CO2e</div>
            <p className="text-[10px] text-emerald-100/70">Down from 4,210 kg baseline</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Est. Monthly Savings</span>
            <div className="text-2xl font-bold font-mono text-emerald-300">${calculatedMonthlySavingsUSD} / mo</div>
            <p className="text-[10px] text-emerald-100/70">Grid offset & off-peak arbitrage</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Solar + Battery Status</span>
            <div className="text-lg font-bold text-white flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-300" />
              <span>{solarCapacityKw} kW PV</span>
              <span className="text-emerald-300">/ {batteryCapacityKwh} kWh</span>
            </div>
            <p className="text-[10px] text-emerald-100/70">Self-consumption ratio: ~78%</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Thermal Systems</span>
            <div className="text-sm font-semibold text-white">
              {heatPump ? 'Variable Speed Heat Pump' : 'Standard Resistance/Gas'}
            </div>
            <p className="text-[10px] text-emerald-100/70">{evCharger ? 'Level 2 Smart EV Charger Enabled' : 'No EV Charger Installed'}</p>
          </div>
        </div>

        {/* Twin Builder & Version History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Twin Form (2 cols) */}
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Home className="h-4 w-4 text-emerald-700" />
                <span>Building Parameters & Equipment Configuration</span>
              </CardTitle>
              <CardDescription>Adjust structure and appliance specifications to simulate energy performance</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleSaveVersion} className="space-y-6">
                {/* Physical Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      House Size (sq ft)
                    </label>
                    <input
                      type="number"
                      min={400}
                      max={10000}
                      step={50}
                      value={houseSizeSqFt}
                      onChange={(e) => setHouseSizeSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Occupant Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={occupants}
                      onChange={(e) => setOccupants(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Home Structure Type
                    </label>
                    <select
                      value={homeType}
                      onChange={(e) => setHomeType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="single_family">Single Family Home</option>
                      <option value="apartment">Apartment / Unit</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="condo">Condominium</option>
                    </select>
                  </div>
                </div>

                {/* Solar & Battery Sliders */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <span className="text-xs font-bold text-stone-900 block">
                    Solar PV & Energy Storage Specs
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Solar PV Array Capacity</span>
                        <span className="font-mono text-emerald-800 font-bold">{solarCapacityKw} kW</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={15}
                        step={0.5}
                        value={solarCapacityKw}
                        onChange={(e) => setSolarCapacityKw(Number(e.target.value))}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Battery Storage Capacity</span>
                        <span className="font-mono text-emerald-800 font-bold">{batteryCapacityKwh} kWh</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        step={1}
                        value={batteryCapacityKwh}
                        onChange={(e) => setBatteryCapacityKwh(Number(e.target.value))}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Major Efficiency Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100/80 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heatPump}
                      onChange={(e) => setHeatPump(e.target.checked)}
                      className="rounded accent-emerald-700 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Variable Speed Heat Pump HVAC</span>
                      <span className="text-[11px] text-stone-500">Replaces gas heating with ultra-efficient electric pump</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100/80 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={evCharger}
                      onChange={(e) => setEvCharger(e.target.checked)}
                      className="rounded accent-emerald-700 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Level 2 EV Smart Charger</span>
                      <span className="text-[11px] text-stone-500">Allows automated overnight off-peak charging schedules</span>
                    </div>
                  </label>
                </div>

                {/* Appliance Checklist */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 block">
                    Select Active Appliances & Major Loads
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

                {/* Save Version Input Bar */}
                <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-900 block">
                    Save New Version Snapshot
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Added 6.5kW Solar PV + Battery upgrade..."
                      value={versionNote}
                      onChange={(e) => setVersionNote(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                    <Button type="submit" variant="primary" size="sm" className="gap-1.5 whitespace-nowrap">
                      <Save className="h-4 w-4" />
                      <span>Save Version</span>
                    </Button>
                  </div>
                  {saveSuccess && (
                    <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span>Digital twin snapshot saved to version history!</span>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Version History Sidebar (1 col) */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-700" />
                <span>Digital Twin Version History</span>
              </CardTitle>
              <CardDescription>Select a historical version to restore parameters</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {versions.map((ver) => {
                const isActive = ver.id === activeVersionId;
                return (
                  <div
                    key={ver.id}
                    onClick={() => handleSelectVersion(ver)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Badge variant={isActive ? 'emerald' : 'stone'} size="xs">
                          {ver.version}
                        </Badge>
                        {isActive && <span className="text-[10px] text-emerald-700 font-bold">(Active)</span>}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">{ver.timestamp}</span>
                    </div>

                    <p className="text-xs text-stone-700 mb-2 font-medium">{ver.note}</p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-2 border-t border-stone-200/60">
                      <span>{ver.houseSizeSqFt} sq ft • {ver.solarCapacityKw} kW Solar</span>
                      <span className="font-bold text-emerald-800">${ver.estMonthlySavingsUSD}/mo saved</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
