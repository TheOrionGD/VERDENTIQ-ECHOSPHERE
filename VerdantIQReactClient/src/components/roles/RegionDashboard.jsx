import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  BarChart2, 
  FileText, 
  Globe, 
  Settings 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { 
  RegionInstitutionsStreamView, 
  RegionSupportTicketsView, 
  RegionStudentsDemographicsView 
} from './region/RegionSupplementaryViews';
import { RegionBenchmarkView } from './region/RegionBenchmarkView';

export function RegionDashboard() {
  const { activeScreen } = useAuth();
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/region/benchmarks');
        setBenchmarks(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBenchmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
        Loading Regional Campus Benchmarks...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Regional District Authority & Benchmarks</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Cross-Campus Governance
          </p>
        </div>
      </div>

      {/* Screen 1: Overview */}
      {(activeScreen === 'dashboard') && (
        <>
          {/* Normalized Chart: kWh per Student */}
          <div className="fluent-card p-5">
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Normalized Efficiency: Monthly Electricity Consumption per Enrolled Student</span>
            </h2>
            <p className="text-[11px] text-neutral-400 mb-4">
              Fair comparison across diverse institutional sizes (kWh / student)
            </p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="code" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }}
                    formatter={(val) => [`${val} kWh/student`, 'Normalized Intensity']}
                  />
                  <Bar dataKey="kwhPerStudent" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Comparison Table */}
          <div className="fluent-card p-5">
            <h2 className="text-sm font-semibold text-white mb-3">District Institutions Normalized Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px]">
                    <th className="py-2.5 px-3">Campus Name</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Latest Recorded (kWh)</th>
                    <th className="py-2.5 px-3">kWh / Student</th>
                    <th className="py-2.5 px-3">Water / Student (m³)</th>
                    <th className="py-2.5 px-3">Grid Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {benchmarks.map((b) => (
                    <tr key={b.institutionId} className="hover:bg-white/5">
                      <td className="py-2.5 px-3 font-medium text-white">{b.name}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{b.code}</td>
                      <td className="py-2.5 px-3">{b.totalKwhConsumed?.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-white font-bold">{b.kwhPerStudent}</td>
                      <td className="py-2.5 px-3 font-mono text-sky-400">{b.waterPerStudentM3}</td>
                      <td className="py-2.5 px-3 font-mono">{b.gridFactor} kg/kWh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Institutions Stream */}
      {activeScreen === 'institutions' && <RegionInstitutionsStreamView />}

      {/* Screen 3: Benchmarking */}
      {activeScreen === 'benchmark' && <RegionBenchmarkView />}

      {/* Screen 4: Reports */}
      {activeScreen === 'reports' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>District Aggregated Environmental Reports</span>
          </h2>
          <p className="text-neutral-300">
            Publish consolidated multi-campus sustainability scorecards to state and district oversight bodies.
          </p>
          <button className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer">
            Generate District ESG Aggregation Pack
          </button>
        </div>
      )}

      {/* Screen 5: Tenant Requests */}
      {activeScreen === 'tenant-requests' && (
        <div className="fluent-card p-5 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-white">District Campus Enrollment Applications</h2>
          <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">South Sound Community College</div>
              <div className="text-[11px] text-neutral-400">Application to join Pacific Northwest Regional Grid Benchmarking Roster.</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">Pending</span>
          </div>
        </div>
      )}

      {/* Screen 6: Domains */}
      {activeScreen === 'domains' && (
        <div className="fluent-card p-5 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Regional Campus Domain Allocation Registry</span>
          </h2>
          <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between">
            <span className="font-mono text-emerald-400">cascadia.edu</span>
            <span className="text-neutral-300">Cascadia Polytechnic · Primary Regional DNS</span>
          </div>
        </div>
      )}

      {/* Screen 7: Analytics */}
      {activeScreen === 'analytics' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Aggregated Resource Flow Analytics</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">Total District Electricity</div>
              <div className="text-xl font-bold text-white mt-1">297,500 kWh</div>
            </div>
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">Total Water Consumed</div>
              <div className="text-xl font-bold text-sky-400 mt-1">14,200 m³</div>
            </div>
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">Avg Waste Diversion Rate</div>
              <div className="text-xl font-bold text-teal-400 mt-1">58.4%</div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 8: Settings */}
      {activeScreen === 'settings' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Regional Environmental Target & Compliance Policies</span>
          </h2>
          <div className="space-y-2">
            <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">District Mandate: Mandatory Monthly Energy Reporting</div>
                <div className="text-[11px] text-neutral-400">Flag institutions missing utility readings after 30 days.</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Screen 9: Students */}
      {activeScreen === 'students' && <RegionStudentsDemographicsView />}

      {/* Screen 10: Support Tickets */}
      {activeScreen === 'support-tickets' && <RegionSupportTicketsView />}
    </div>
  );
}
