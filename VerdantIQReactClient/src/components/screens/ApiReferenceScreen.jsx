import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  ArrowLeft, 
  Copy,
  Check
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function ApiReferenceScreen({ onBack }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      desc: 'Verify server runtime uptime, memory health, and MongoDB connection status.',
      payload: null,
      response: '{\n  "status": "healthy",\n  "timestamp": "2026-10-14T14:45:00Z",\n  "services": { "db": "connected", "telemetry": "streaming" }\n}'
    },
    {
      method: 'GET',
      path: '/api/notifications',
      desc: 'Fetch user notifications, system alerts, and real-time anomaly broadcasts.',
      payload: null,
      response: '[\n  {\n    "id": "notif-001",\n    "title": "HVAC Setpoint Optimized",\n    "priority": "high",\n    "timestamp": "10 mins ago"\n  }\n]'
    },
    {
      method: 'POST',
      path: '/api/assistant/synthesize',
      desc: 'Synthesize multi-resource telemetry data using advanced ML environmental models.',
      payload: '{\n  "query": "Show peak electricity demand in Science Hall",\n  "role": "institution"\n}',
      response: '{\n  "summary": "Peak demand observed at 14:00 (420 kW) - battery peak shaving activated.",\n  "confidence": 0.94\n}'
    },
    {
      method: 'GET',
      path: '/api/institutions',
      desc: 'List registered campus institutions across regional governance districts.',
      payload: null,
      response: '[\n  {\n    "code": "AU-ENG",\n    "name": "Verdia Central Campus",\n    "district": "Bay Area North",\n    "eui": 142.5\n  }\n]'
    },
    {
      method: 'POST',
      path: '/api/tenant-privacy/check',
      desc: 'Enforce schema-level privacy boundaries and verify cryptographic authorization claims.',
      payload: '{\n  "tenantId": "tenant_verdia_edu",\n  "action": "read:audit_ledger"\n}',
      response: '{\n  "allowed": true,\n  "schema": "tenant_verdia_edu",\n  "digest": "sha256-verified"\n}'
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans p-4 sm:p-8 relative selection:bg-emerald-500 selection:text-black">
      <BackgroundVideo overlayClassName="bg-slate-950/85 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between liquid-glass-panel liquid-shimmer p-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-emerald-400/40 text-white shadow-md overflow-hidden p-1 flex items-center justify-center animate-liquid-pulse">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ REST API Reference</span>
              <span className="text-[10px] font-mono text-emerald-400">Microservice Endpoints & Telemetry Ingestion</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="liquid-glass-panel liquid-shimmer rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>OpenAPI 3.1 & REST Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Production API Specifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Integration endpoints for BACnet IoT gateways, Spring Boot tenant provisioning, and cryptographic token verification. All responses return standardized JSON with HTTP Strict Transport Security.
          </p>
        </div>

        {/* API Endpoints List */}
        <div className="space-y-4">
          {endpoints.map((ep, idx) => (
            <div 
              key={idx}
              className="liquid-glass-panel rounded-2xl p-5 border border-white/15 space-y-3 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 font-mono">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    ep.method === 'GET' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-sm font-bold text-white">{ep.path}</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>200 OK • Active</span>
                </div>
              </div>

              <p className="text-xs text-neutral-300">
                {ep.desc}
              </p>

              {/* Sample Response Box */}
              <div className="relative mt-2">
                <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-t-xl border-x border-t border-white/10 text-[10px] font-mono text-neutral-400">
                  <span>Sample JSON Response</span>
                  <button
                    onClick={() => handleCopy(ep.response, idx)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-neutral-950/90 text-emerald-300 font-mono text-xs rounded-b-xl border border-white/10 overflow-x-auto">
                  {ep.response}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApiReferenceScreen;
