import React, { useState } from 'react';
import { Cpu, Target, Gift } from 'lucide-react';

export function UserDigitalTwinView() {
  const [ambientTemp, setAmbientTemp] = useState(28);
  const [insulationLevel, setInsulationLevel] = useState('Standard Double-Glazed');

  const simulatedCoolingLoadKwh = ((ambientTemp - 22) * 1.8).toFixed(1);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Household Digital Twin & Envelope Thermal Simulator</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Simulates HVAC heat gain, window glazing thermal resistance, and internal heat loads.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-neutral-400">Simulated Cooling Penalty</div>
          <div className="text-base font-bold text-amber-400 font-mono">+{simulatedCoolingLoadKwh} kWh/day</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between text-neutral-300">
            <span>Outdoor Ambient Temperature (°C):</span>
            <span className="font-mono text-emerald-400">{ambientTemp}°C</span>
          </div>
          <input
            type="range"
            min="18"
            max="42"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
          <div className="text-neutral-300">Envelope Glazing & Insulation:</div>
          <select
            value={insulationLevel}
            onChange={(e) => setInsulationLevel(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded p-1.5 text-white"
          >
            <option>Single Pane (High Thermal Leak)</option>
            <option>Standard Double-Glazed</option>
            <option>Low-E Argon Triple Glazed (Ultra-Efficient)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function UserGoalsView() {
  const [goals] = useState([
    { title: 'Reduce Monthly Electricity Draw by 15%', progress: 68, target: '720 kWh/mo', deadline: '2026-12-31' },
    { title: 'Eliminate Phantom Standby Appliance Draw', progress: 100, target: 'Smart Plugs Armed', deadline: 'Completed' },
    { title: 'Shift Laundry to Off-Peak (22:00 - 06:00)', progress: 85, target: '4/5 Loads Off-Peak', deadline: '2026-08-31' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Target className="w-4 h-4 text-emerald-400" />
        <span>Personal Sustainability Targets & Goal Tracking</span>
      </h2>
      <div className="space-y-3">
        {goals.map((g, i) => (
          <div key={i} className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">{g.title}</span>
              <span className="font-mono text-emerald-400 font-bold">{g.progress}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${g.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>Target: {g.target}</span>
              <span>Deadline: {g.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserRewardsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Gift className="w-4 h-4 text-emerald-400" />
        <span>Household Green Rewards Catalog</span>
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
          <div className="font-semibold text-white">Smart Thermostat Rebate Coupon</div>
          <div className="text-neutral-400">Receive $35 off ENERGY STAR certified thermostat.</div>
          <div className="text-emerald-400 font-mono font-bold pt-1">Available to Claim</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
          <div className="font-semibold text-white">Community Clean Energy Champion Badge</div>
          <div className="text-neutral-400">Awarded for 3 consecutive months below regional median load.</div>
          <div className="text-teal-400 font-mono font-bold pt-1">Unlocked</div>
        </div>
      </div>
    </div>
  );
}
