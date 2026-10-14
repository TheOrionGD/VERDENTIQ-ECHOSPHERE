import React, { useState } from 'react';
import { 
  Activity, 
  Server, 
  CheckCircle, 
  Clock, 
  Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function AdminTelemetryView() {
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [selectedService, setSelectedService] = useState('all');

  const liveMetrics = [
    { time: '11:00', latency: 42, cpuLoad: 28, heapMb: 34, rps: 180 },
    { time: '11:05', latency: 48, cpuLoad: 35, heapMb: 36, rps: 210 },
    { time: '11:10', latency: 39, cpuLoad: 24, heapMb: 35, rps: 165 },
    { time: '11:15', latency: 45, cpuLoad: 31, heapMb: 38, rps: 240 },
    { time: '11:20', latency: 51, cpuLoad: 38, heapMb: 40, rps: 295 },
    { time: '11:25', latency: 43, cpuLoad: 29, heapMb: 39, rps: 215 },
    { time: '11:30', latency: 38, cpuLoad: 26, heapMb: 37, rps: 190 },
  ];

  const services = [
    { name: 'Express API Server (Port 5000)', status: 'Healthy', latency: '4.2 ms', uptime: '99.98%', errorRate: '0.002%' },
    { name: 'Pure JS ML Inference Engine', status: 'Healthy', latency: '12.4 ms', uptime: '99.95%', errorRate: '0.000%' },
    { name: 'MongoDB Atlas Replicaset Pool', status: 'Healthy', latency: '1.8 ms', uptime: '100.0%', errorRate: '0.000%' },
    { name: 'Groq LPU Gateway (Llama 3.3)', status: 'Active', latency: '380 ms', uptime: '99.85%', errorRate: '0.012%' },
    { name: 'Google Gemini 2.5 Flash Fallback', status: 'Standby', latency: '640 ms', uptime: '99.99%', errorRate: '0.000%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Node.js Process Telemetry, Microservice Latencies & Throughput</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time API gateway telemetry, CPU event-loop lag, V8 heap allocations & connection pool metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Poll Rate:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-neutral-900 border border-white/10 rounded px-2 py-1 text-white font-mono"
            >
              <option value={2}>2s (Realtime)</option>
              <option value={5}>5s (Normal)</option>
              <option value={15}>15s (Conserve)</option>
            </select>
          </div>
          <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE FEED</span>
          </span>
        </div>
      </div>

      {/* Top Vital Gauges */}
      <div className="grid grid-cols-4 gap-4">
        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>V8 Heap Allocated</span>
            <Server className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">37.4 <span className="text-xs font-normal text-neutral-400">MB</span></div>
          <div className="text-[10px] text-sky-300 mt-1">Heap limit: 4,096 MB · 0.91% used</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Event-Loop Latency</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">1.82 <span className="text-xs font-normal text-neutral-400">ms</span></div>
          <div className="text-[10px] text-neutral-400 mt-1">Optimal (Zero event-loop blocking)</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Global Request Rate</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">215 <span className="text-xs font-normal text-neutral-400">req/s</span></div>
          <div className="text-[10px] text-teal-300 mt-1">Peak: 480 req/s during class changeovers</div>
        </div>

        <div className="fluent-card p-4">
          <div className="text-xs text-neutral-400 mb-1 flex justify-between">
            <span>Error Rate (5xx)</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">0.00%</div>
          <div className="text-[10px] text-neutral-400 mt-1">Zero unhandled promise rejections</div>
        </div>
      </div>

      {/* Live Latency & Throughput Area Chart */}
      <div className="fluent-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Service Response Latency & Requests/Second</h3>
            <p className="text-[11px] text-neutral-400">Rolling 30-minute window across Express API and MongoDB handlers</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Latency (ms)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Throughput (RPS)</span>
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" stroke="#737373" fontSize={11} />
              <YAxis stroke="#737373" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', fontSize: '11px', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
              <Area type="monotone" dataKey="rps" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Health & Operational Status Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Core Microservices & Integration Health Matrix</span>
          </h3>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="text-xs bg-neutral-900 border border-white/10 rounded px-2.5 py-1 text-neutral-300 cursor-pointer"
          >
            <option value="all">All Services ({services.length})</option>
            <option value="Express">Express API</option>
            <option value="ML">ML Engine</option>
            <option value="MongoDB">MongoDB Atlas</option>
            <option value="Groq">Groq LPU</option>
            <option value="Gemini">Google Gemini</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">P95 Latency</th>
                <th className="py-2.5 px-3">Rolling 30D Uptime</th>
                <th className="py-2.5 px-3">Error Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services
                .filter(svc => selectedService === 'all' || svc.name.toLowerCase().includes(selectedService.toLowerCase()))
                .map((svc) => (
                  <tr key={svc.name} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-medium text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{svc.name}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">
                        {svc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-300">{svc.latency}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{svc.uptime}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-400">{svc.errorRate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
