import React, { useState } from 'react';
import { Radio } from 'lucide-react';

export function MlopsFallbackConsoleView() {
  const [fallbacks, setFallbacks] = useState([
    { service: 'Electricity Load Forecasting', primary: 'Holt-Winters Pure JS', fallback: 'Moving 3-Month Trailing Mean', trigger: 'History < 3 observations or NaN', active: true },
    { service: 'Generative Recommendations', primary: 'Groq LPU (LLaMA 3.3)', fallback: 'Google Gemini 3.6 Flash', trigger: 'Timeout > 3500ms or 429 Rate Limit', active: true },
    { service: 'HVAC Thermal Solver', primary: 'Pareto Multi-Objective Optimizer', fallback: 'Rule-Based ASHRAE Comfort Bounds', trigger: 'Matrix Non-Convergence', active: true },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>High-Availability Fallback & Circuit Breaker Console</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Automated degradation paths ensuring uninterrupted campus operations if primary solvers or upstream APIs become unavailable.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {fallbacks.map((fb) => (
          <div key={fb.service} className="p-3.5 rounded-lg bg-neutral-900 border border-white/5 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">{fb.service}</span>
              <button
                onClick={() => setFallbacks(prev => prev.map(item => item.service === fb.service ? { ...item, active: !item.active } : item))}
                className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold transition cursor-pointer ${
                  fb.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {fb.active ? 'ARMED & ACTIVE' : 'DISABLED'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded">
              <div><span className="text-neutral-500">Primary Route: </span><span className="text-emerald-400 font-medium">{fb.primary}</span></div>
              <div><span className="text-neutral-500">Failover Path: </span><span className="text-sky-400 font-medium">{fb.fallback}</span></div>
              <div className="col-span-2 text-neutral-300"><span className="text-neutral-500">Trigger Threshold: </span>{fb.trigger}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
