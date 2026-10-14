import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Bot, 
  Users, 
  FileText, 
  Smartphone, 
  History 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { 
  UserGoalsView, 
  UserRewardsView 
} from './user/UserSupplementaryViews';
import { UserDigitalTwinParametricView } from './user/UserDigitalTwinParametricView';

export function UserDashboard() {
  const { activeScreen } = useAuth();
  const [appliances, setAppliances] = useState([
    { id: 1, name: 'Refrigerator (Frost-Free)', watts: 180, hoursPerDay: 24 },
    { id: 2, name: 'Air Conditioner (Split 1.5 Ton)', watts: 1500, hoursPerDay: 6 },
    { id: 3, name: 'LED Lighting Banks', watts: 120, hoursPerDay: 5 },
    { id: 4, name: 'Water Heater (Geyser)', watts: 2000, hoursPerDay: 1.5 },
  ]);

  const [tariff, setTariff] = useState(0.15);
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Appliance form state
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState('');
  const [newHours, setNewHours] = useState('');

  // AI tips
  const [aiTips, setAiTips] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/user/estimate', {
          method: 'POST',
          body: { appliances, tariffPerKwh: tariff },
        });
        if (isMounted) setEstimateData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [appliances, tariff]);

  const handleAddAppliance = (e) => {
    e.preventDefault();
    if (!newName || !newWatts || !newHours) return;

    const updated = [
      ...appliances,
      {
        id: Date.now(),
        name: newName,
        watts: Number(newWatts),
        hoursPerDay: Number(newHours),
      },
    ];
    setAppliances(updated);
    setNewName('');
    setNewWatts('');
    setNewHours('');
    calculateEstimate(updated);
  };

  const handleRemoveAppliance = (id) => {
    const updated = appliances.filter((a) => a.id !== id);
    setAppliances(updated);
    calculateEstimate(updated);
  };

  const handleGetAiTips = async () => {
    try {
      setAiLoading(true);
      const res = await apiRequest('/api/user/ai-savings-tips', {
        method: 'POST',
        body: { appliances, tariffPerKwh: tariff },
      });
      setAiTips(res.tips);
    } catch (err) {
      alert(`AI Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <span>Household Sustainability & Energy Command</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Smart Appliance Scheduler & Tariff Estimator
          </p>
        </div>

        <button
          onClick={handleGetAiTips}
          disabled={aiLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiLoading ? 'Analyzing...' : 'AI Energy Savings Tips'}</span>
        </button>
      </div>

      {/* Screen 1: Overview */}
      {(activeScreen === 'dashboard' || activeScreen === 'user-dashboard') && (
        <>
          {loading && (
            <div className="fluent-card p-4 text-center text-xs text-neutral-400 animate-pulse">
              Recalculating appliance load curves and utility bill estimates...
            </div>
          )}
          <div className="grid grid-cols-4 gap-4">
            <div className="fluent-card p-4">
              <div className="text-xs text-neutral-400 mb-1">Estimated Daily Consumption</div>
              <div className="text-2xl font-bold text-white">
                {estimateData?.dailyKwh} <span className="text-xs font-normal text-neutral-400">kWh/day</span>
              </div>
            </div>

            <div className="fluent-card p-4">
              <div className="text-xs text-neutral-400 mb-1">Estimated Monthly Consumption</div>
              <div className="text-2xl font-bold text-white">
                {estimateData?.monthlyKwh} <span className="text-xs font-normal text-neutral-400">kWh/mo</span>
              </div>
            </div>

            <div className="fluent-card p-4">
              <div className="text-xs text-neutral-400 mb-1">Projected Monthly Bill</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ${estimateData?.estimatedBillUsd}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center justify-between">
                <span>Tariff: ${tariff}/kWh</span>
                <input
                  type="range"
                  min="0.08"
                  max="0.40"
                  step="0.01"
                  value={tariff}
                  onChange={(e) => setTariff(parseFloat(e.target.value))}
                  className="w-16 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="fluent-card p-4">
              <div className="text-xs text-neutral-400 mb-1">Regional Household Benchmark</div>
              <div className="text-lg font-bold text-neutral-300">
                {estimateData?.averageHouseholdBenchmarkKwh} kWh/mo
              </div>
              <div className="text-[10px] text-teal-400 mt-0.5">
                {estimateData?.monthlyKwh < estimateData?.averageHouseholdBenchmarkKwh
                  ? 'Below Regional Average! (Efficient)'
                  : 'Above Regional Average'}
              </div>
            </div>
          </div>

          {/* AI Tips Panel */}
          {aiTips && (
            <div className="fluent-card p-4 border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Household Efficiency Recommendations</span>
              </div>
              <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">{aiTips}</p>
            </div>
          )}

          {/* Main Grid: Appliance List & 7-Day Forecast */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Appliance Inventory */}
            <div className="fluent-card p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Appliance Inventory</h2>

              <div className="space-y-2 mb-4">
                {appliances.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-white/5 text-xs">
                    <div>
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-[10px] text-neutral-400">{app.watts}W · {app.hoursPerDay} hrs/day</div>
                    </div>
                    <button
                      onClick={() => handleRemoveAppliance(app.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Appliance form */}
              <form onSubmit={handleAddAppliance} className="pt-3 border-t border-white/10 space-y-2">
                <input
                  type="text"
                  placeholder="Appliance name (e.g. Microwave)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Wattage (W)"
                    value={newWatts}
                    onChange={(e) => setNewWatts(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Hours/day"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Appliance</span>
                </button>
              </form>
            </div>

            {/* Right: 7-Day Demand Forecast Chart */}
            <div className="col-span-2 fluent-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Modeled 7-Day Electricity Demand Estimate</span>
                  </h2>
                  <p className="text-[11px] text-neutral-400">Calculated from user appliance duty cycle and weekend adjustments</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={estimateData?.sevenDayForecast || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" fontSize={11} />
                    <YAxis stroke="#888" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }}
                      formatter={(val) => [`${val} kWh`, 'Demand Estimate']}
                    />
                    <Bar dataKey="estimatedKwh" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Digital Twin / Parametric Twin / Calculator / Solar */}
      {(activeScreen === 'digital-twin' || activeScreen === 'parametric' || activeScreen === 'calculator' || activeScreen === 'solar') && (
        <UserDigitalTwinParametricView />
      )}

      {/* Screen 3: 30D Forecast & Analytics */}
      {(activeScreen === 'forecast' || activeScreen === 'analytics') && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>30-Day Household Rolling Projection</span>
          </h2>
          <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
            <div className="text-white font-medium">Estimated 30-Day Load: {estimateData?.monthlyKwh} kWh</div>
            <div className="text-emerald-400 font-mono font-bold">Estimated Cost: ${estimateData?.estimatedBillUsd}</div>
            <p className="text-[11px] text-neutral-300">
              Assumes current connected appliance inventory duty cycles and regional standard weather seasonality.
            </p>
          </div>
        </div>
      )}

      {/* Screen 4: MILP Simulator */}
      {activeScreen === 'optimization' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Household Time-of-Use Schedule Optimizer</span>
          </h2>
          <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
            <div className="font-semibold text-white">Off-Peak Shift Heuristic Optimizer</div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Moving high-wattage water heating and air conditioner pre-cooling to off-peak periods (22:00 - 06:00) projects monthly savings of up to $28.50.
            </p>
          </div>
        </div>
      )}

      {/* Screen 5: AI Assistant */}
      {activeScreen === 'assistant' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Smart Home Energy Advisory Assistant</span>
          </h2>
          <p className="text-neutral-300">
            Get personalized smart home schedules, appliance upgrade payback calculations, and energy bill explanations.
          </p>
          <button
            onClick={handleGetAiTips}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
          >
            Generate Fresh Savings Diagnostics
          </button>
        </div>
      )}

      {/* Screen 6: Community Zone */}
      {activeScreen === 'community' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Neighborhood Energy Efficiency Benchmarking</span>
          </h2>
          <div className="p-4 rounded bg-neutral-900 border border-white/5 space-y-2">
            <div className="flex justify-between text-white font-semibold">
              <span>Your Household vs Neighborhood Median</span>
              <span className="text-emerald-400 font-mono">14% More Efficient</span>
            </div>
            <div className="text-[11px] text-neutral-400">Median Neighborhood Load: 890 kWh/mo · Your Load: {estimateData?.monthlyKwh} kWh/mo</div>
          </div>
        </div>
      )}

      {/* Screen 7: Reports */}
      {activeScreen === 'reports' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Household Monthly Environmental Statements</span>
          </h2>
          <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">Monthly Household Carbon & Cost Audit (July 2026)</div>
              <div className="text-neutral-400 text-[11px]">Carbon Footprint: {((estimateData?.monthlyKwh || 750) * 0.42).toFixed(1)} kg CO₂e</div>
            </div>
            <button className="px-3 py-1.5 rounded bg-emerald-600 text-white font-medium cursor-pointer">
              Download Statement
            </button>
          </div>
        </div>
      )}

      {/* Screen 8: Goals */}
      {activeScreen === 'goals' && <UserGoalsView />}

      {/* Screen 9: Devices */}
      {activeScreen === 'devices' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Connected Smart Meter & IoT Appliance Inventory</span>
          </h2>
          <div className="space-y-2">
            {appliances.map(app => (
              <div key={app.id} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{app.name}</div>
                  <div className="text-neutral-400 text-[11px]">{app.watts} Watts · Connected via Zigbee Gateway</div>
                </div>
                <span className="text-emerald-400 font-mono font-bold">{app.hoursPerDay}h/day</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 10: History & CSV */}
      {activeScreen === 'history' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Historical Consumption & Appliance Audit Log</span>
          </h2>
          <p className="text-neutral-300">
            Export continuous duty-cycle measurements and historical energy bill estimates to spreadsheet formats.
          </p>
          <button className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 font-medium cursor-pointer">
            Export Household History (CSV)
          </button>
        </div>
      )}

      {/* Screen 11: Rewards Catalog */}
      {activeScreen === 'rewards' && <UserRewardsView />}
    </div>
  );
}
