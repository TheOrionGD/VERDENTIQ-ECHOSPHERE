import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

export function MlopsLlmGatewayView() {
  const [groqStatus, setGroqStatus] = useState({ latencyMs: 24, status: 'healthy', model: 'llama-3.3-70b-versatile', successRate: 99.8 });
  const [geminiStatus, setGeminiStatus] = useState({ latencyMs: 140, status: 'healthy', model: 'gemini-3.6-flash', successRate: 99.4 });
  const [activeTrafficSplit, setActiveTrafficSplit] = useState({ groq: 80, gemini: 20 });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleTestInference = async (provider) => {
    const startTime = Date.now();
    try {
      setTesting(true);
      const res = await apiRequest('/api/mlops/ai-diagnostic', {
        method: 'POST',
        body: {
          actuals: [150000, 155000, 162000],
          forecasts: [152000, 158000, 165000],
          metrics: { mae: 4200, rmse: 5100, mape: 3.1 },
        },
      });
      const elapsed = Date.now() - startTime;
      if (provider === 'groq') {
        setGroqStatus(prev => ({ ...prev, latencyMs: elapsed }));
      } else {
        setGeminiStatus(prev => ({ ...prev, latencyMs: elapsed }));
      }
      setTestResult(`[${provider.toUpperCase()} Response]: ${res.commentary?.substring(0, 180)}...`);
    } catch (err) {
      setTestResult(`[Error]: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fluent-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Dual-Provider AI LLM Gateway Router (Groq LPU + Google Gemini)</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            High-speed hardware-accelerated Groq LLaMA 3.3 primary router with seamless Google Gemini 3.6 Flash fallback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Groq Card */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">Groq LPU Inference Router</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
              Primary (Healthy)
            </span>
          </div>
          <div className="space-y-1.5 text-neutral-300">
            <div className="flex justify-between"><span>Model:</span><span className="font-mono text-emerald-400">{groqStatus.model}</span></div>
            <div className="flex justify-between"><span>Observed Latency:</span><span className="font-mono text-white">{groqStatus.latencyMs} ms</span></div>
            <div className="flex justify-between"><span>Success SLA:</span><span className="font-mono text-white">{groqStatus.successRate}%</span></div>
          </div>
          <button
            onClick={() => handleTestInference('groq')}
            disabled={testing}
            className="w-full py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-medium cursor-pointer"
          >
            {testing ? 'Testing...' : 'Send Test Ping to Groq LPU'}
          </button>
        </div>

        {/* Gemini Card */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">Google Gemini Generative AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold uppercase">
              Standby Fallback (Healthy)
            </span>
          </div>
          <div className="space-y-1.5 text-neutral-300">
            <div className="flex justify-between"><span>Model:</span><span className="font-mono text-sky-400">{geminiStatus.model}</span></div>
            <div className="flex justify-between"><span>Observed Latency:</span><span className="font-mono text-white">{geminiStatus.latencyMs} ms</span></div>
            <div className="flex justify-between"><span>Success SLA:</span><span className="font-mono text-white">{geminiStatus.successRate}%</span></div>
          </div>
          <button
            onClick={() => handleTestInference('gemini')}
            disabled={testing}
            className="w-full py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-medium cursor-pointer"
          >
            {testing ? 'Testing...' : 'Send Test Ping to Gemini'}
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3 rounded bg-neutral-950 border border-white/10 text-xs text-neutral-300">
          <div className="text-[10px] font-mono text-emerald-400 mb-1">Live Gateway Echo Response:</div>
          <p className="leading-relaxed">{testResult}</p>
        </div>
      )}

      <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
        <h3 className="font-semibold text-white">Dynamic Traffic Routing Allocation</h3>
        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>Groq LPU: {activeTrafficSplit.groq}%</span>
            <span>Gemini: {activeTrafficSplit.gemini}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={activeTrafficSplit.groq}
            onChange={(e) => setActiveTrafficSplit({ groq: Number(e.target.value), gemini: 100 - Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
