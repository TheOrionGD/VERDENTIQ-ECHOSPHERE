import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';

export function InstitutionReportsView() {
  const [incMilp, setIncMilp] = useState(true);
  const [incScope2, setIncScope2] = useState(true);
  const [incWaterWaste, setIncWaterWaste] = useState(true);
  const [incStudentEco, setIncStudentEco] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const schedules = [
    { id: 'REP-01', title: 'Monthly Executive ESG & Utility Statement', cadence: 'Monthly (1st of month)', recipients: 'Board of Trustees & Facilities Dean', format: 'PDF + SHA-256', status: 'Active' },
    { id: 'REP-02', title: 'Quarterly Scope 1-3 GHG Protocol Compliance', cadence: 'Quarterly', recipients: 'Regional Environmental Protection Board', format: 'PDF + CSV Package', status: 'Active' },
    { id: 'REP-03', title: 'Student Living Lab Challenge & Proof Ledger', cadence: 'Bi-Weekly', recipients: 'Campus Sustainability Committee', format: 'Interactive Dashboard Export', status: 'Active' },
  ];

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedReport({
        id: `REP-EXEC-${Date.now().toString().slice(-6)}`,
        title: 'Verdia Central University — Executive ESG & Net-Zero Carbon Statement',
        timestamp: new Date().toLocaleString(),
        totalKwh: '164,000 kWh',
        scope2Carbon: '68,880 kg CO₂e',
        waterHarvested: '8,500 m³',
        wasteDiversion: '62.4%',
        studentPoints: '12,840 EcoPoints',
        shaChecksum: 'SHA256:8b41...90fe (Certified)',
        status: 'Generated & Signed'
      });
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Scheduled Executive Reports & ESG Statement Generator</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pulls verified MongoDB collections, MILP optimization logs, and Scope 2 accounting into board-ready certified statements.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <FileText className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Compiling Certified Statement...' : 'Compile Executive ESG Report'}</span>
        </button>
      </div>

      {/* Generated Report Banner */}
      {generatedReport && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">{generatedReport.title}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
              {generatedReport.status}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
              <div className="text-[10px] text-neutral-400">Total Billed Electricity</div>
              <div className="font-mono text-white font-bold">{generatedReport.totalKwh}</div>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
              <div className="text-[10px] text-neutral-400">Scope 2 Emissions</div>
              <div className="font-mono text-teal-400 font-bold">{generatedReport.scope2Carbon}</div>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
              <div className="text-[10px] text-neutral-400">Waste Diversion Rate</div>
              <div className="font-mono text-emerald-400 font-bold">{generatedReport.wasteDiversion}</div>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-white/5">
              <div className="text-[10px] text-neutral-400">Student Proof Actions</div>
              <div className="font-mono text-white font-bold">{generatedReport.studentPoints}</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-1 font-mono">
            <span>Audit Checksum: {generatedReport.shaChecksum}</span>
            <button
              onClick={() => alert('Downloading signed report PDF...')}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Parameter Customization Console */}
      <div className="fluent-card p-5 space-y-3 text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>ESG Report Composition Modules</span>
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <label className="p-3 bg-neutral-900 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
            <span className="text-neutral-300">MILP Dispatch Schedule</span>
            <input
              type="checkbox"
              checked={incMilp}
              onChange={(e) => setIncMilp(e.target.checked)}
              className="accent-emerald-500"
            />
          </label>

          <label className="p-3 bg-neutral-900 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
            <span className="text-neutral-300">Scope 2 Grid Reconcile</span>
            <input
              type="checkbox"
              checked={incScope2}
              onChange={(e) => setIncScope2(e.target.checked)}
              className="accent-emerald-500"
            />
          </label>

          <label className="p-3 bg-neutral-900 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
            <span className="text-neutral-300">Water & Waste Balance</span>
            <input
              type="checkbox"
              checked={incWaterWaste}
              onChange={(e) => setIncWaterWaste(e.target.checked)}
              className="accent-emerald-500"
            />
          </label>

          <label className="p-3 bg-neutral-900 rounded-lg border border-white/5 flex items-center justify-between cursor-pointer">
            <span className="text-neutral-300">Student Proof Audit Chain</span>
            <input
              type="checkbox"
              checked={incStudentEco}
              onChange={(e) => setIncStudentEco(e.target.checked)}
              className="accent-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* Automated Schedules Table */}
      <div className="fluent-card p-5 space-y-3 text-xs">
        <h3 className="text-sm font-semibold text-white">Automated Board Publication Schedules</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Report Title</th>
                <th className="py-2.5 px-3">Cadence</th>
                <th className="py-2.5 px-3">Designated Recipients</th>
                <th className="py-2.5 px-3">Output Format</th>
                <th className="py-2.5 px-3">Schedule Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{s.title}</td>
                  <td className="py-2.5 px-3 text-teal-400">{s.cadence}</td>
                  <td className="py-2.5 px-3 font-sans text-neutral-300">{s.recipients}</td>
                  <td className="py-2.5 px-3 text-neutral-400">{s.format}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
