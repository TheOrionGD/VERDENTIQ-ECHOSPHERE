import React, { useState } from 'react';
import { Cpu, Bot, GraduationCap, UserCheck, Sparkles } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

export function StudentRegisterView() {
  const [eduDomain, setEduDomain] = useState('alex.mercer@verdia.edu');
  const [verified, setVerified] = useState(true);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs max-w-lg mx-auto">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <UserCheck className="w-4 h-4 text-emerald-400" />
        <span>Educational Institution Domain Verification</span>
      </h2>
      <p className="text-neutral-300">
        Student accounts require validation against authorized campus educational domains to participate in challenge leaderboards and earn certified EcoPoints.
      </p>
      <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-3">
        <div className="flex justify-between items-center">
          <input
            type="email"
            value={eduDomain}
            onChange={(e) => setEduDomain(e.target.value)}
            className="font-mono text-white bg-black/40 px-2 py-1 rounded border border-white/10 w-2/3 text-xs"
          />
          <button
            onClick={() => setVerified(!verified)}
            className={`text-[10px] px-2 py-1 rounded font-semibold uppercase transition cursor-pointer ${
              verified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {verified ? 'Domain Verified' : 'Re-verify Domain'}
          </button>
        </div>
        <div className="text-[11px] text-neutral-400">Tenant: Verdia Central University · Cohort: 2026 Engineering</div>
      </div>
    </div>
  );
}

export function StudentDormTwinView() {
  const [acHours, setAcHours] = useState(5);
  const [laptopHours, setLaptopHours] = useState(8);
  const [fridgeWatts, setFridgeWatts] = useState(90);

  const estimatedDormKwh = ((1200 * acHours + 65 * laptopHours + fridgeWatts * 24) / 1000).toFixed(2);
  const estimatedCo2Kg = (estimatedDormKwh * 0.42).toFixed(2);

  return (
    <div className="fluent-card p-5 space-y-5 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Dormitory Digital Twin & Personal Resource Simulator</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Interactive physics-based model of dormitory room plug-loads and microclimate energy impact.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-neutral-400">Daily Room Footprint</div>
          <div className="text-base font-bold text-emerald-400 font-mono">{estimatedDormKwh} kWh/day</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between text-neutral-300">
            <span>Dorm AC / Space Heater:</span>
            <span className="font-mono text-emerald-400">{acHours} hrs/day</span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            value={acHours}
            onChange={(e) => setAcHours(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between text-neutral-300">
            <span>Study Laptop & Monitor:</span>
            <span className="font-mono text-emerald-400">{laptopHours} hrs/day</span>
          </div>
          <input
            type="range"
            min="1"
            max="18"
            value={laptopHours}
            onChange={(e) => setLaptopHours(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between text-neutral-300">
            <span>Mini-Fridge Idle Draw:</span>
            <span className="font-mono text-emerald-400">{fridgeWatts} W</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={fridgeWatts}
            onChange={(e) => setFridgeWatts(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="p-3.5 rounded bg-neutral-950 border border-white/5 text-[11px] text-neutral-300 flex justify-between items-center">
        <span>Estimated Scope 2 Emissions from personal room plug load:</span>
        <span className="font-mono text-teal-400 font-bold">{estimatedCo2Kg} kg CO₂e / day</span>
      </div>
    </div>
  );
}

export function StudentAiAssistantView() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await apiRequest('/api/student/ai-assistant', {
        method: 'POST',
        body: { query },
      });
      setResponse(res.answer || res.reply || 'EcoAssistant: Switching off laboratory monitors when unattended saves approximately 14 kWh monthly per workstation.');
    } catch (err) {
      console.warn('Student AI Assistant fallback triggered:', err.message);
      setResponse(`EcoAssistant Guidance: Consider submitting evidence for the "Computer Lab Twilight Shutdown" challenge to earn +30 EcoPoints while helping campus hit its 15% reduction quota!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>VerdantIQ Student EcoAssistant (AI Sustainability Mentor)</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Ask questions about campus sustainability policies, carbon reduction tips, and research projects.
          </p>
        </div>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. How can our dormitory floor reduce peak evening cooling load?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white placeholder-neutral-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {response && (
        <div className="p-3.5 rounded bg-neutral-950 border border-emerald-500/20 text-neutral-200 leading-relaxed space-y-1">
          <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>AI EcoMentor Advice:</span>
          </div>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export function StudentAcademicProjectsView() {
  const [projects] = useState([
    { title: 'Campus Solar Canopy Micro-Grid Modeling', advisor: 'Prof. Martha Chen', status: 'In Review', pointsGranted: 150 },
    { title: 'Rainwater Harvesting Flow Rate IoT Sensor Mesh', advisor: 'Dr. Alan Vance', status: 'Published', pointsGranted: 200 },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <GraduationCap className="w-4 h-4 text-emerald-400" />
        <span>Student Sustainability Research & Capstone Living Lab Projects</span>
      </h2>
      <div className="space-y-2.5">
        {projects.map((p, i) => (
          <div key={i} className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{p.title}</div>
              <div className="text-[11px] text-neutral-400">Faculty Advisor: {p.advisor}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">{p.status}</span>
              <div className="text-emerald-400 font-mono text-[10px] mt-1">+{p.pointsGranted} EcoPoints</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentAnalyticsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>My Personal Carbon Impact & Historical Eco-Savings</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Avoided Campus Scope 2 CO₂e</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">48.2 kg</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Computed across 14 verified actions</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Total EcoPoints Accumulated</div>
          <div className="text-xl font-bold text-teal-400 mt-1 font-mono">230 pts</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Top 5% of Engineering cohort</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Dorm Peak Energy Reductions</div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">18.5 kWh</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Off-peak shift compliance</div>
        </div>
      </div>
    </div>
  );
}

export function StudentSettingsView() {
  const [notifyProof, setNotifyProof] = useState(true);
  const [notifyLeaderboard, setNotifyLeaderboard] = useState(true);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs max-w-lg">
      <h2 className="text-sm font-semibold text-white">Student Eco-Profile & Notification Preferences</h2>
      <div className="space-y-3">
        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Proof Moderation Alerts</div>
            <div className="text-[11px] text-neutral-400">Notify when department approves your challenge submission</div>
          </div>
          <input
            type="checkbox"
            checked={notifyProof}
            onChange={(e) => setNotifyProof(e.target.checked)}
            className="accent-emerald-500 cursor-pointer w-4 h-4"
          />
        </div>

        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Weekly Cohort Leaderboard Highlights</div>
            <div className="text-[11px] text-neutral-400">Receive rank shift summaries every Monday morning</div>
          </div>
          <input
            type="checkbox"
            checked={notifyLeaderboard}
            onChange={(e) => setNotifyLeaderboard(e.target.checked)}
            className="accent-emerald-500 cursor-pointer w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
}

