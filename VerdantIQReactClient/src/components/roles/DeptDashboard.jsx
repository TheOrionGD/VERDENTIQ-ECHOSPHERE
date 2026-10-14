import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  FileText, 
  Settings, 
  Globe, 
  BarChart3 
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { 
  DeptEscalationsView, 
  DeptMembersView, 
  DeptStudentsView, 
  DeptChallengeTemplatesView,
  DeptLeaderboardView,
  DeptHistoryView 
} from './dept/DeptSupplementaryViews';
import { DeptVerificationQueueView } from './dept/DeptVerificationQueueView';

export function DeptDashboard() {
  const { activeScreen } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [aiLoading, setAiLoading] = useState(null);

  const fetchDeptData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/dept/overview');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/dept/overview');
        if (isMounted) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleReviewProof = async (proofId, status, notes = '') => {
    try {
      await apiRequest(`/api/dept/proofs/${proofId}/review`, {
        method: 'POST',
        body: { status, moderatorNotes: notes },
      });
      await fetchDeptData();
    } catch (err) {
      alert(`Review error: ${err.message}`);
    }
  };

  const handleAiAssistance = async (proof) => {
    try {
      setAiLoading(proof._id);
      const res = await apiRequest('/api/dept/ai-proof-assistant', {
        method: 'POST',
        body: {
          challengeTitle: proof.challengeTitle,
          studentNotes: proof.notes,
        },
      });
      setAiSuggestions(prev => ({ ...prev, [proof._id]: res.aiRecommendation }));
    } catch (err) {
      alert(`AI Error: ${err.message}`);
    } finally {
      setAiLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
        Loading Department & Lab Operations...
      </div>
    );
  }

  const { schedules = [], observations = [], pendingProofs = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Department Moderator Command Surface</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Local Facility Schedules & EcoPoint Verification
          </p>
        </div>
      </div>

      {/* Screen 1: Overview */}
      {(activeScreen === 'dashboard') && (
        <div className="grid grid-cols-2 gap-6">
          {/* Student Proof Review Queue */}
          <div className="fluent-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Student EcoPoint Verification Queue ({pendingProofs.length})</span>
              </h2>
            </div>

            {pendingProofs.length === 0 ? (
              <div className="text-xs text-neutral-400 p-4 text-center">
                All submitted student challenge proofs have been verified.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProofs.map((proof) => (
                  <div key={proof._id} className="p-3.5 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">{proof.challengeTitle}</div>
                        <div className="text-[11px] text-neutral-400">
                          {proof.studentName} ({proof.studentId}) · {proof.points} EcoPoints
                        </div>
                      </div>
                      <button
                        onClick={() => handleAiAssistance(proof)}
                        disabled={aiLoading === proof._id}
                        className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiLoading === proof._id ? 'Analyzing...' : 'AI Review Helper'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 italic bg-black/30 p-2 rounded">
                      "{proof.notes}"
                    </p>

                    {/* AI Recommendation display */}
                    {aiSuggestions[proof._id] && (
                      <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-500/20 whitespace-pre-line">
                        {aiSuggestions[proof._id]}
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleReviewProof(proof._id, 'rejected', 'Evidence insufficient')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs border border-red-500/30 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleReviewProof(proof._id, 'approved', 'Verified by department moderator')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Grant {proof.points} Pts</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lab & Facility Operating Schedules */}
          <div className="space-y-6">
            <div className="fluent-card p-5">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Department Lab & HVAC Schedules</span>
              </h2>

              <div className="space-y-2">
                {schedules.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-neutral-900 border border-white/5 text-xs">
                    <div>
                      <div className="font-medium text-white">{s.facilityName}</div>
                      <div className="text-[11px] text-neutral-400">{s.dayOfWeek} · {s.startHour} - {s.endHour}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-400 font-semibold">{s.setpointTempC}°C</div>
                      <div className="text-[10px] text-neutral-400 uppercase">{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waste / Maintenance Observations */}
            <div className="fluent-card p-5">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Energy-Waste & Maintenance Observations</span>
              </h2>

              <div className="space-y-2">
                {observations.map((obs, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-neutral-900 border border-white/5 text-xs">
                    <div className="flex justify-between font-medium text-white mb-1">
                      <span>{obs.facilityName}</span>
                      <span className="text-amber-400 font-semibold text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {obs.severity}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px]">{obs.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Verification Queue */}
      {(activeScreen === 'verify' || activeScreen === 'verification-queue') && <DeptVerificationQueueView />}

      {/* Screen 3: Escalations */}
      {activeScreen === 'escalate' && <DeptEscalationsView />}

      {/* Screen 4: Member Roster */}
      {activeScreen === 'members' && <DeptMembersView />}

      {/* Screen 5: Student Directory */}
      {activeScreen === 'students' && <DeptStudentsView />}

      {/* Screen 6: Domain Onboarding */}
      {activeScreen === 'onboarding-requests' && (
        <div className="fluent-card p-5 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Department Subdomain Onboarding Requests</span>
          </h2>
          <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white font-mono">cs.verdia.edu</div>
              <div className="text-[11px] text-neutral-400">Requesting sub-tenant routing for Computer Science Lab workstations.</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">Provisioned</span>
          </div>
        </div>
      )}

      {/* Screen 7: Challenge Templates / Challenges */}
      {(activeScreen === 'templates' || activeScreen === 'challenges') && <DeptChallengeTemplatesView />}

      {/* Screen: Leaderboard */}
      {activeScreen === 'leaderboard' && <DeptLeaderboardView />}

      {/* Screen: History / Audit Log */}
      {(activeScreen === 'history' || activeScreen === 'audit-log') && <DeptHistoryView />}

      {/* Screen 8: Analytics & Baselines */}
      {activeScreen === 'analytics' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Department Operations & Schedule Compliance Baselines</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">HVAC Schedule Compliance</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">98.4%</div>
            </div>
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">Nightly Twilight Shutdowns</div>
              <div className="text-xl font-bold text-white mt-1">28 / 30 Days</div>
            </div>
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400">Verified EcoActions (Q2)</div>
              <div className="text-xl font-bold text-teal-400 mt-1">142 Actions</div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 9: Reports & Export */}
      {activeScreen === 'reports' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Department Sustainability Activity & Equipment Reports</span>
          </h2>
          <p className="text-neutral-300">
            Export facility operational hours, waste triage logs, and student challenge verifications.
          </p>
          <button className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer">
            Export Department Activity Summary (CSV)
          </button>
        </div>
      )}

      {/* Screen 10: Settings & Geofence */}
      {activeScreen === 'settings' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Department Operating Policies & Laboratory Bounds</span>
          </h2>
          <div className="space-y-2">
            <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">Default HVAC Off-Hour Setpoint</div>
                <div className="text-[11px] text-neutral-400">Maintain 24°C in summer / 19°C in winter when unoccupied</div>
              </div>
              <span className="font-mono text-emerald-400 font-bold">ASHRAE Standard</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
