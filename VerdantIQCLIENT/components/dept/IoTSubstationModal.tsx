'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Zap, Radio, RefreshCw, X, ShieldCheck, Cpu, Sliders, CheckCircle2 } from 'lucide-react';
import { SubstationTelemetry, FeederReading } from '@/app/api/dept/substation/route';

interface IoTSubstationModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: SubstationTelemetry | null;
  onRefresh: () => void;
}

export const IoTSubstationModal: React.FC<IoTSubstationModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onRefresh,
}) => {
  const [selectedFeeder, setSelectedFeeder] = useState<FeederReading | null>(null);
  const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  if (!isOpen || !telemetry) return null;

  const handleDispatchCommand = async (feederId: string, cmd: string, targetVal?: number) => {
    setIsSendingCommand(true);
    setCommandFeedback(null);
    try {
      const res = await fetch('/api/dept/substation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: feederId,
          command: cmd,
          targetValue: targetVal,
          reason: 'Manual Department Moderator Dispatch',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommandFeedback(`Command "${cmd}" sent to ${feederId} (${data.protocol || 'BACnet'}). Latency: ${data.execution_latency_ms || 24}ms.`);
        onRefresh();
      }
    } catch (err: any) {
      setCommandFeedback(`Error: ${err.message}`);
    } finally {
      setIsSendingCommand(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold font-editorial">
                Substation IoT Telemetry &amp; Actuator Control
              </h2>
              <p className="text-[11px] text-stone-300 font-mono">
                {telemetry.substation_id} &bull; {telemetry.substation_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700 text-xs gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Poll IoT Meters</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-emerald-800 block font-bold">
                Total Substation Draw
              </span>
              <div className="text-2xl font-black text-emerald-950 font-mono">
                {telemetry.total_active_draw_kw} kW
              </div>
              <span className="text-[10px] text-emerald-700 font-mono">
                Baseline: {telemetry.baseline_expected_kw} kW ({telemetry.variance_pct}% variance)
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-stone-500 block font-bold">
                Connected IoT Devices
              </span>
              <div className="text-2xl font-black text-stone-900 font-mono">
                {telemetry.connected_iot_devices_count} Devices
              </div>
              <span className="text-[10px] text-stone-500 font-mono">
                Smart meters, BACnet breakers, CT clamps
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-[10px] uppercase font-mono text-stone-500 block font-bold">
                Telemetry Link Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-stone-900">
                  {telemetry.connected_service === 'FASTAPI_ML_GATEWAY' ? 'Live ML-Gateway :8000' : 'Edge Micro-Broker'}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono block mt-1">
                Poll: {new Date(telemetry.last_poll_timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {commandFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{commandFeedback}</span>
            </div>
          )}

          {/* Connected Feeders Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
              Live Substation Feeder Sub-Meters
            </h3>
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 font-mono text-[10px] text-stone-500 uppercase">
                  <tr>
                    <th className="p-3">Feeder ID</th>
                    <th className="p-3">Load Name</th>
                    <th className="p-3">Protocol</th>
                    <th className="p-3 text-right">Active kW</th>
                    <th className="p-3 text-right">V / A</th>
                    <th className="p-3 text-right">Eco Setback</th>
                    <th className="p-3 text-center">IoT Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {telemetry.feeders.map((f) => (
                    <tr key={f.feeder_id} className="hover:bg-stone-50/70">
                      <td className="p-3 font-bold text-stone-900">{f.feeder_id}</td>
                      <td className="p-3 font-sans text-stone-700 font-medium">{f.feeder_name}</td>
                      <td className="p-3">
                        <Badge variant="stone" size="xs">
                          {f.meter_protocol}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-900">
                        {f.current_load_kw} kW
                      </td>
                      <td className="p-3 text-right text-stone-500 text-[11px]">
                        {f.voltage_v}V / {f.current_a}A
                      </td>
                      <td className="p-3 text-right text-emerald-700 font-bold">
                        {f.eco_setback_pct}%
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isSendingCommand}
                            onClick={() => handleDispatchCommand(f.feeder_id, 'ENABLE_ECO_MODE', 24.0)}
                            className="h-6 px-2 text-[10px] border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                          >
                            Eco Setback
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isSendingCommand}
                            onClick={() => handleDispatchCommand(f.feeder_id, 'RESET')}
                            className="h-6 px-1.5 text-[10px] text-stone-500 hover:text-stone-800"
                          >
                            Reset
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

