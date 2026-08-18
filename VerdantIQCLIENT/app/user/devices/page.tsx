'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Smartphone,
  Plus,
  Zap,
  Activity,
  CheckCircle2,
  Power,
  X,
  Radio,
} from 'lucide-react';
import { LinkedDevice } from '@/lib/services/userDataService';

export default function UserDevicesPage() {
  const [devices, setDevices] = useState<LinkedDevice[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New device form state
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<LinkedDevice['type']>('smart_plug');
  const [deviceLocation, setDeviceLocation] = useState('');

  const handleToggleStatus = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === 'online' ? 'eco_mode' : d.status === 'eco_mode' ? 'standby' : 'online',
            }
          : d
      )
    );
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName) return;
    const newDev: LinkedDevice = {
      id: `dev_${Date.now()}`,
      name: deviceName,
      type: deviceType,
      location: deviceLocation || 'Main Living Area',
      status: 'online',
      currentPowerWatts: 150,
      dailyKwh: 1.2,
      healthPercent: 100,
      lastSync: 'Just now',
    };
    setDevices([...devices, newDev]);
    setDeviceName('');
    setDeviceLocation('');
    setIsAddModalOpen(false);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Statutory Compliant Logging</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Meter Bill Logging & Smart Meter Registries
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Legal Compliance Framework: Direct physical or IoT manipulation of utility energy meters & smart meters is legally prohibited. Data is logged via monthly official bill slips or official government DISCOM dashboards.
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="sm"
            className="gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Pair New Device</span>
          </Button>
        </div>

        {/* Statutory Meter Compliance Guidance Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <CheckCircle2 className="h-4 w-4 text-amber-700" />
            <span>Statutory & Regulatory Notice: Physical & IoT Meter Non-Interference</span>
          </div>
          <p className="text-[11px] text-stone-700 leading-relaxed">
            In accordance with utility power regulations, individual persons (including authorized personnel) <strong>cannot physically touch, extract, or manipulate energy meters or smart meters</strong>. Data ingestion in this platform operates strictly through compliant channels:
          </p>
          <ul className="list-disc list-inside text-[11px] text-stone-700 space-y-1 pl-1">
            <li><strong>Official Utility Energy Bill Slips:</strong> Monthly bill slip uploads or manual OCR data entry at the billing cycle end.</li>
            <li><strong>Government Smart Meter App Manual Logging:</strong> Manual logging of current kWh readings exported from official Indian government DISCOM apps/dashboards.</li>
            <li><strong>Permitted Secondary Appliances:</strong> Consumer-owned submeters, smart plugs, solar inverters, and EV chargers.</li>
          </ul>
        </div>

        {/* Linked Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((dev) => (
            <Card key={dev.id} className="border border-stone-200 bg-white/90 shadow-xs">
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-bold text-stone-900">{dev.name}</CardTitle>
                    <span className="text-[11px] text-stone-500 font-mono">{dev.location}</span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(dev.id)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      dev.status === 'online'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : dev.status === 'eco_mode'
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-stone-100 border-stone-300 text-stone-500'
                    }`}
                    title="Toggle Device Mode"
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400">Current Load</span>
                    <div className="font-bold text-emerald-800">{dev.currentPowerWatts} W</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400">Daily kWh</span>
                    <div className="font-bold text-stone-900">{dev.dailyKwh} kWh</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-100">
                  <span>Health: {dev.healthPercent}%</span>
                  <span>Sync: {dev.lastSync}</span>
                  <Badge variant={dev.status === 'online' ? 'emerald' : 'amber'} size="xs">
                    {dev.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Device Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-700" />
                  <span>Pair New IoT Telemetry Node</span>
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddDevice} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Device Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Living Room Smart Plug"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Device Category</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="smart_plug">Smart Plug Meter</option>
                    <option value="thermostat">Smart Thermostat</option>
                    <option value="ev_charger">EV Charger</option>
                    <option value="solar_inverter">Solar Inverter</option>
                    <option value="heat_pump">Heat Pump Controller</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Installation Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Home Office / Garage"
                    value={deviceLocation}
                    onChange={(e) => setDeviceLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Confirm Pairing
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
