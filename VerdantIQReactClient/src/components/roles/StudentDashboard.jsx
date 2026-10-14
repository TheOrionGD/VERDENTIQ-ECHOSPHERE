import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  Trophy, 
  UploadCloud, 
  Leaf, 
  TrendingUp, 
  SlidersHorizontal, 
  Gift, 
  History 
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { 
  StudentRegisterView, 
  StudentDormTwinView, 
  StudentAiAssistantView, 
  StudentAcademicProjectsView,
  StudentAnalyticsView,
  StudentSettingsView
} from './student/StudentSupplementaryViews';
import { StudentChallengesListView } from './student/StudentChallengesListView';

export function StudentDashboard() {
  const { activeScreen } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Challenge submission dialog state
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadStudentData() {
      try {
        setLoading(true);
        const [challengesRes, leaderboardRes] = await Promise.all([
          apiRequest('/api/student/challenges'),
          apiRequest('/api/student/leaderboard'),
        ]);

        if (isMounted) {
          setChallenges(challengesRes.activeChallenges || []);
          setMySubmissions(challengesRes.mySubmissions || []);
          setTotalPoints(challengesRes.totalEarnedPoints || 0);
          setLeaderboard(leaderboardRes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadStudentData();
    return () => { isMounted = false; };
  }, []);

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!selectedChallenge || !studentNotes) return;

    try {
      setIsSubmitting(true);
      await apiRequest('/api/student/proofs', {
        method: 'POST',
        body: {
          challengeId: selectedChallenge._id,
          challengeTitle: selectedChallenge.title,
          studentNotes,
          points: selectedChallenge.points,
        },
      });
      setSelectedChallenge(null);
      setStudentNotes('');
      await fetchStudentData();
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Student Eco-Challenge & Rewards Hub</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Verified Proof Submissions & Campus Leaderboards
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-neutral-400">Total Verified Points</div>
            <div className="text-base font-bold text-white font-mono">{totalPoints} EcoPoints</div>
          </div>
        </div>
      </div>

      {/* Screen 1: Domain Register / Campus Email Link */}
      {(activeScreen === 'register' || activeScreen === 'domain-verification') && <StudentRegisterView />}

      {/* Screen 2: Overview / Eco-Profile */}
      {(activeScreen === 'dashboard' || activeScreen === 'student-dashboard' || activeScreen === 'my-institution') && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {loading && (
              <div className="fluent-card p-4 text-center text-xs text-neutral-400 animate-pulse">
                Syncing campus challenges and student leaderboard...
              </div>
            )}
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Available Campus Eco-Challenges</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {challenges.map((c) => (
                <div key={c._id || c.id} className="fluent-card p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-white leading-snug">{c.title}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        +{c.points} Pts
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mb-3">{c.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(c)}
                    className="w-full py-1.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Submit Proof Evidence</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="fluent-card p-4 mt-6">
              <h3 className="text-xs font-semibold text-white mb-3">My Submission History</h3>
              <div className="space-y-2">
                {mySubmissions.map((sub, idx) => (
                  <div key={sub._id || sub.id || `${sub.challengeTitle}-${idx}`} className="flex items-center justify-between p-2.5 rounded bg-neutral-900 border border-white/5 text-xs">
                    <div>
                      <div className="font-medium text-white">{sub.challengeTitle}</div>
                      <div className="text-[11px] text-neutral-400 italic">"{sub.notes}"</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fluent-card p-5">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Campus Leaderboard</span>
            </h2>

            <div className="space-y-3">
              {leaderboard.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-2.5 rounded bg-neutral-900/60 border border-white/5 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      item.rank === 1 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-[10px] text-neutral-400">{item.department}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-emerald-400">{item.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screen 3: Dorm Twin */}
      {activeScreen === 'digital-twin' && <StudentDormTwinView />}

      {/* Screen 4: Forecast */}
      {activeScreen === 'forecast' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Campus Student Load Forecast & Peak Shaving Hours</span>
          </h2>
          <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
            <div className="text-white font-medium">Campus Peak Grid Demand Window: 18:00 - 22:00</div>
            <p className="text-[11px] text-neutral-300">
              Shifting laundry cycles and heavy battery charging away from evening hours cuts campus peak power tariffs by up to 22%.
            </p>
          </div>
        </div>
      )}

      {/* Screen 5: Simulator */}
      {activeScreen === 'optimization' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Student Dormitory Energy Simulator</span>
          </h2>
          <p className="text-neutral-300">
            Simulate the impact of natural daylighting vs LED fixtures on your floor's overall energy footprint.
          </p>
        </div>
      )}

      {/* Screen 6: AI Assistant */}
      {activeScreen === 'assistant' && <StudentAiAssistantView />}

      {/* Screen 7: Challenges / Active Quests */}
      {(activeScreen === 'challenges' || activeScreen === 'challenges-list' || activeScreen === 'actions') && <StudentChallengesListView />}

      {/* Screen 8: Cohort Leaderboard / Campus Ranks */}
      {(activeScreen === 'community' || activeScreen === 'leaderboard') && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white">Cohort Sustainability Leaderboard</h2>
          <div className="space-y-2">
            {leaderboard.map(item => (
              <div key={item.rank} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-bold font-mono text-emerald-400">#{item.rank}</span>
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-neutral-400 text-[11px]">{item.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold">{item.points} pts</div>
                  <div className="text-[10px] text-neutral-500">{item.badges?.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 9: Research Projects */}
      {activeScreen === 'academic-projects' && <StudentAcademicProjectsView />}

      {/* Screen 10: Campus Rewards & Badges */}
      {(activeScreen === 'rewards' || activeScreen === 'badges') && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>Campus Rewards & Certified Digital Badges</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Campus Dining Eco-Voucher</div>
              <div className="text-neutral-400">Redeem 200 EcoPoints for $10 voucher at campus farm-to-table co-op.</div>
              <div className="text-emerald-400 font-mono font-bold pt-1">200 EcoPoints</div>
            </div>
            <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Bicycle Service Free Tune-Up</div>
              <div className="text-neutral-400">Campus Bike Co-op voucher for chain lubrication and brake check.</div>
              <div className="text-emerald-400 font-mono font-bold pt-1">150 EcoPoints</div>
            </div>
            <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Living Lab Certificate of Commendation</div>
              <div className="text-neutral-400">Official digital sustainability transcript credential.</div>
              <div className="text-emerald-400 font-mono font-bold pt-1">500 EcoPoints</div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 11: Activity Log & History */}
      {(activeScreen === 'history' || activeScreen === 'activity-history') && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>My Complete Environmental Action Log & Proof Ledger</span>
          </h2>
          <div className="space-y-2">
            {mySubmissions.map((s, i) => (
              <div key={i} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{s.challengeTitle}</div>
                  <div className="text-neutral-400 text-[11px]">"{s.notes}"</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                    s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>{s.status}</span>
                  <div className="text-emerald-400 font-mono font-bold text-[11px] mt-0.5">+{s.points} Pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen: Analytics / Personal Impact */}
      {activeScreen === 'analytics' && <StudentAnalyticsView />}

      {/* Screen: Settings */}
      {activeScreen === 'settings' && <StudentSettingsView />}

      {/* Proof Submission Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full shadow-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Submit Evidence: {selectedChallenge.title}
            </h3>

            <form onSubmit={handleSubmitProof} className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Observation / Action Notes</label>
                <textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Describe your actions (e.g. Shut down workstations in room 302, unhooked phantom chargers)..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Moderator Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
