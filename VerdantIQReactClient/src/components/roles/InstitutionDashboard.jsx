import React, { useState, useEffect } from 'react';
import {
  Building2,
  Zap,
  Droplet,
  Recycle,
  Leaf,
  TreePine,
  Bike,
  Sparkles,
  PlusCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { 
  InstitutionDepartmentsView, 
  InstitutionGeofenceView, 
  InstitutionVerifyView, 
  InstitutionSettingsView,
  InstitutionIotView 
} from './institution/InstitutionSupplementaryViews';
import { InstitutionAnalyticsView } from './institution/InstitutionAnalyticsView';
import { InstitutionStudentsView } from './institution/InstitutionStudentsView';
import { InstitutionChallengesView } from './institution/InstitutionChallengesView';
import { InstitutionReportsView } from './institution/InstitutionReportsView';
import { InstitutionDomainsView } from './institution/InstitutionDomainsView';

export function InstitutionDashboard() {
  const { activeScreen, setActiveScreen } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bill Intake Form state
  const [period, setPeriod] = useState('2026-05');
  const [intakeCategory, setIntakeCategory] = useState('electricity');
  const [intakeValue, setIntakeValue] = useState('');
  const [costValue, setCostValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Advice
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/institution/comprehensive-overview?institutionId=inst-verdia-central');
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/institution/comprehensive-overview?institutionId=inst-verdia-central');
        if (isMounted) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleRecordIntake = async (e) => {
    e.preventDefault();
    if (!intakeValue || !costValue) return;

    try {
      setIsSubmitting(true);
      if (intakeCategory === 'electricity') {
        await apiRequest('/api/institution/readings', {
          method: 'POST',
          body: {
            institutionId: 'inst-verdia-central',
            period,
            kwhConsumed: Number(intakeValue),
            totalCost: Number(costValue),
          },
        });
      } else if (intakeCategory === 'water') {
        await apiRequest('/api/institution/water', {
          method: 'POST',
          body: {
            institutionId: 'inst-verdia-central',
            period,
            volumeCubicM: Number(intakeValue),
            cost: Number(costValue),
          },
        });
      } else if (intakeCategory === 'waste') {
        await apiRequest('/api/institution/waste', {
          method: 'POST',
          body: {
            institutionId: 'inst-verdia-central',
            period,
            organicKg: Number(intakeValue) * 0.4,
            recyclableKg: Number(intakeValue) * 0.35,
            generalKg: Number(intakeValue) * 0.25,
          },
        });
      }

      setIntakeValue('');
      setCostValue('');
      await fetchOverview();
    } catch (err) {
      alert(`Error saving record: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAiPlan = async () => {
    try {
      setAiLoading(true);
      const electricity = data?.modules?.electricity?.readings?.slice(-1)[0] || {};
      const water = data?.modules?.water?.records?.slice(-1)[0] || {};
      const waste = data?.modules?.waste?.records?.slice(-1)[0] || {};

      const res = await apiRequest('/api/institution/ai-action-plan', {
        method: 'POST',
        body: {
          kwhConsumed: electricity.kwhConsumed || 164000,
          totalCost: electricity.totalCost || 19680,
          scope2EmissionsKg: electricity.scope2EmissionsKg || 68880,
          regionalGridFactor: 0.42,
          waterConsumedM3: water.volumeCubicM || 8500,
          wasteDivertedRatePct: waste.diversionRatePct || 62,
        },
      });
      setAiAdvice(res.actionPlan);
    } catch (err) {
      alert(`AI Plan Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
        Loading Campus Sustainability Suite...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center space-x-2">
        <AlertCircle className="w-5 h-5" />
        <span>Failed to load: {error}</span>
      </div>
    );
  }

  const { institution, modules = {} } = data || {};
  const { electricity = {}, water = {}, waste = {}, carbon = {}, biodiversity = {}, mobility = {} } = modules;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>{institution?.name || 'Verdia Central University'}</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Feature Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Multi-Resource Sustainability Command
          </p>
        </div>

        <button
          onClick={handleGenerateAiPlan}
          disabled={aiLoading}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{aiLoading ? 'Analyzing...' : 'AI Multi-Resource Plan'}</span>
        </button>
      </div>

      {/* Screen 1: Dashboard Overview */}
      {(activeScreen === 'institution-dashboard' || activeScreen === 'dashboard') && (
        <>
          <div className="grid grid-cols-6 gap-3">
            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-emerald-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Electricity</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-white">{electricity.totalKwh?.toLocaleString()} kWh</div>
            </div>

            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-sky-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Water Volume</span>
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-bold text-white">{water.totalConsumedM3?.toLocaleString()} m³</div>
            </div>

            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-teal-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Diversion Rate</span>
                <Recycle className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-lg font-bold text-white">{waste.diversionRatePct}%</div>
            </div>

            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-emerald-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Net Carbon</span>
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {carbon?.netEmissionsKg ? `${Math.round(carbon.netEmissionsKg / 1000)} t CO₂e` : `${Math.round((electricity.totalKwh || 0) * 0.42 / 1000)} t CO₂e`}
              </div>
            </div>

            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-green-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Native Trees</span>
                <TreePine className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div className="text-lg font-bold text-white">{biodiversity.totalTreesPlanted || 120}</div>
            </div>

            <div onClick={() => setActiveScreen('analytics')} className="fluent-card p-3.5 cursor-pointer hover:border-purple-500">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Clean Commute</span>
                <Bike className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-white">{mobility.latestSurvey?.sustainableCommuteRatePct || 92}%</div>
            </div>
          </div>

          <div className="fluent-card p-5">
            <h2 className="text-sm font-semibold text-white mb-2">12-Month Campus Total Electricity Load Profile</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={electricity.readings || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="period" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="kwhConsumed" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Analytics Screen */}
      {activeScreen === 'analytics' && <InstitutionAnalyticsView />}

      {/* Screen 3: Departments */}
      {activeScreen === 'departments' && <InstitutionDepartmentsView />}

      {/* Screen 4: Domains */}
      {activeScreen === 'domains' && <InstitutionDomainsView />}

      {/* Screen 5: Geofence */}
      {activeScreen === 'geofence' && <InstitutionGeofenceView />}

      {/* Screen 6: Students */}
      {activeScreen === 'students' && <InstitutionStudentsView />}

      {/* Screen 7: Challenges */}
      {activeScreen === 'challenges' && <InstitutionChallengesView />}

      {/* Screen 8: Verify / Student Approvals */}
      {(activeScreen === 'verify' || activeScreen === 'verification') && <InstitutionVerifyView />}

      {/* Screen 9: Reports */}
      {activeScreen === 'reports' && <InstitutionReportsView />}

      {/* Screen 10: Settings */}
      {activeScreen === 'settings' && <InstitutionSettingsView />}

      {/* Screen 11: IoT Telemetry Sub-Meters */}
      {activeScreen === 'iot' && <InstitutionIotView />}

      {/* Screen 2: Electricity Screen */}
      {activeScreen === 'electricity' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Campus Total Electricity Readings & Billed Cost</span>
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={electricity.readings || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="period" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }} />
                <Area type="monotone" dataKey="kwhConsumed" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2 px-3">Period</th>
                <th className="py-2 px-3">Consumption (kWh)</th>
                <th className="py-2 px-3">Billed Cost ($)</th>
                <th className="py-2 px-3">Scope 2 Emissions (kg CO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {electricity.readings?.map((r, i) => (
                <tr key={i}>
                  <td className="py-2 px-3 font-mono">{r.period}</td>
                  <td className="py-2 px-3">{r.kwhConsumed.toLocaleString()}</td>
                  <td className="py-2 px-3 font-mono">${r.totalCost.toLocaleString()}</td>
                  <td className="py-2 px-3 text-emerald-400 font-mono">{r.scope2EmissionsKg.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Screen 3: Water Screen */}
      {activeScreen === 'water' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Droplet className="w-4 h-4 text-sky-400" />
            <span>Water Conservation, Harvesting & Reuse</span>
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={water.records || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="period" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }} />
                <Bar dataKey="volumeCubicM" name="Municipal Supply (m³)" fill="#38bdf8" />
                <Bar dataKey="rainwaterHarvestedM3" name="Rainwater Harvested (m³)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Screen 4: Waste Screen */}
      {activeScreen === 'waste' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Recycle className="w-4 h-4 text-teal-400" />
            <span>Waste Segregation & Diversion Rate Records</span>
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waste.records || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="period" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }} />
                <Bar dataKey="divertedKg" name="Diverted / Recycled (kg)" fill="#10b981" />
                <Bar dataKey="generalKg" name="Landfill General (kg)" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Screen 5: Carbon Screen */}
      {activeScreen === 'carbon' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Greenhouse Gas Inventory (Scope 1, 2, and 3)</span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded bg-neutral-900 border border-white/5">
              <div className="text-xs text-neutral-400 mb-1">Scope 1 (Direct Fuel & Backup)</div>
              <div className="text-xl font-bold text-white">18.4 t CO₂e</div>
            </div>
            <div className="p-4 rounded bg-neutral-900 border border-white/5">
              <div className="text-xs text-neutral-400 mb-1">Scope 2 (Purchased Electricity)</div>
              <div className="text-xl font-bold text-emerald-400">{Math.round(electricity.totalKwh * 0.42 / 1000)} t CO₂e</div>
            </div>
            <div className="p-4 rounded bg-neutral-900 border border-white/5">
              <div className="text-xs text-neutral-400 mb-1">Scope 3 (Commuter Travel Survey)</div>
              <div className="text-xl font-bold text-sky-400">42.1 t CO₂e</div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 6: Biodiversity Screen */}
      {activeScreen === 'biodiversity' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <TreePine className="w-4 h-4 text-green-400" />
            <span>Campus Living Lab & Native Tree Inventory</span>
          </h2>
          <div className="space-y-3">
            {biodiversity.records?.map((b, i) => (
              <div key={i} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-white">{b.speciesName} ({b.commonName})</div>
                  <div className="text-[11px] text-neutral-400">{b.campusZone} · Planted: {b.plantingDate}</div>
                  <div className="text-[11px] text-neutral-300 mt-1 italic">"{b.notes}"</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-mono font-bold">{b.survivalCount} / {b.quantityPlanted} Surviving</div>
                  <div className="text-[10px] text-neutral-400 uppercase">{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 7: Mobility Screen */}
      {activeScreen === 'mobility' && (
        <div className="fluent-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Bike className="w-4 h-4 text-purple-400" />
            <span>Campus Commuter Mode Share & Clean Transport</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded bg-neutral-900 border border-white/5 space-y-2 text-xs">
              <div className="font-semibold text-white">Survey Results ({mobility.latestSurvey?.surveyPeriod})</div>
              <div>Sample Size: <span className="font-mono text-emerald-400">{mobility.latestSurvey?.sampleSize} respondents</span></div>
              <div>Sustainable Commute Rate: <span className="font-mono text-teal-400 font-bold">{mobility.latestSurvey?.sustainableCommuteRatePct}%</span></div>
              <div>Bicycle Rack Utilization: <span className="font-mono text-white">{mobility.latestSurvey?.bicycleRackOccupancyPct}%</span></div>
              <div>Dedicated EV Ports: <span className="font-mono text-white">{mobility.latestSurvey?.evChargingPorts} stations</span></div>
            </div>
            <div className="p-4 rounded bg-neutral-900 border border-white/5 space-y-1 text-xs">
              <div className="font-semibold text-white mb-2">Mode Split Breakdown</div>
              <div className="flex justify-between text-neutral-300"><span>Public Transit</span><span>38%</span></div>
              <div className="flex justify-between text-neutral-300"><span>Walking</span><span>26%</span></div>
              <div className="flex justify-between text-neutral-300"><span>Bicycle</span><span>17%</span></div>
              <div className="flex justify-between text-neutral-300"><span>Carpool</span><span>11%</span></div>
              <div className="flex justify-between text-neutral-400"><span>Solo Driving</span><span>8%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 8: Intake Form */}
      {activeScreen === 'intake' && (
        <div className="fluent-card p-6 max-w-lg mx-auto">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Official Environmental Data Intake</span>
          </h2>
          <p className="text-xs text-neutral-400 mb-4">
            Upload new utility billing numbers and contractor manifests into MongoDB with SHA-256 audit chaining.
          </p>

          <form onSubmit={handleRecordIntake} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">Resource Category</label>
              <select
                value={intakeCategory}
                onChange={(e) => setIntakeCategory(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
              >
                <option value="electricity">Electricity (kWh)</option>
                <option value="water">Water (m³)</option>
                <option value="waste">Waste (kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Billing / Record Period (YYYY-MM)</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Quantity / Volume</label>
              <input
                type="number"
                value={intakeValue}
                onChange={(e) => setIntakeValue(e.target.value)}
                placeholder="e.g. 175000"
                className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Billed Cost ($ USD)</label>
              <input
                type="number"
                value={costValue}
                onChange={(e) => setCostValue(e.target.value)}
                placeholder="e.g. 21000"
                className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
            >
              {isSubmitting ? 'Recording to MongoDB...' : 'Save & Verify Record'}
            </button>
          </form>
        </div>
      )}

      {/* Default Safety Fallback: Render Overview and Navigation Hub if activeScreen is not matched */}
      {![
        'institution-dashboard', 'dashboard', 'analytics', 'departments', 'domains',
        'geofence', 'students', 'challenges', 'verify', 'verification', 'reports',
        'settings', 'iot', 'electricity', 'water', 'waste', 'carbon', 'biodiversity',
        'mobility', 'intake'
      ].includes(activeScreen) && (
        <div className="fluent-card p-6 space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
            <Eye className="w-4 h-4" />
            <span>Active Campus Sustainability Module: {activeScreen}</span>
          </div>
          <p className="text-neutral-300">
            Select any campus resource accounting module or operational department from the ribbon above or taskbar below.
          </p>
          <div className="grid grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => setActiveScreen('institution-dashboard')}
              className="p-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-left text-white cursor-pointer"
            >
              <div className="font-semibold mb-1">Campus Overview</div>
              <div className="text-[10px] text-neutral-400">Total campus load & ESG metrics</div>
            </button>
            <button
              onClick={() => setActiveScreen('electricity')}
              className="p-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-left text-white cursor-pointer"
            >
              <div className="font-semibold mb-1">Electricity Grid</div>
              <div className="text-[10px] text-neutral-400">Monthly billing & Scope 2 CO₂e</div>
            </button>
            <button
              onClick={() => setActiveScreen('water')}
              className="p-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-left text-white cursor-pointer"
            >
              <div className="font-semibold mb-1">Water Storage</div>
              <div className="text-[10px] text-neutral-400">Municipal & rainwater reuse</div>
            </button>
            <button
              onClick={() => setActiveScreen('carbon')}
              className="p-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-left text-white cursor-pointer"
            >
              <div className="font-semibold mb-1">Scope 1–3 Carbon</div>
              <div className="text-[10px] text-neutral-400">Verified emissions accounting</div>
            </button>
          </div>
        </div>
      )}

      {/* AI Advisory Panel (if generated) */}
      {aiAdvice && (
        <div className="fluent-card p-4 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Executive Sustainability Recommendations (gemini-3.6-flash / Groq)</span>
          </div>
          <div className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
            {aiAdvice}
          </div>
        </div>
      )}
    </div>
  );
}
