import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Upload, 
  FileText, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

export function StudentChallengesListView() {
  const [scopeFilter, setScopeFilter] = useState('all');
  const [activeEvidenceChallenge, setActiveEvidenceChallenge] = useState(null);
  const [evidenceType, setEvidenceType] = useState('ocr_receipt');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [challenges, setChallenges] = useState([
    {
      id: 's-chal-1',
      title: 'Inter-Dorm Twilight Shutdown Sprint',
      scope: 'campus',
      category: 'Energy Conservation',
      description: 'Power down room AC and phantom desktop chargers between 18:00 and 22:00 to reduce dorm peak grid tariffs.',
      rewardPoints: 40,
      progress: 68,
      joined: true,
    },
    {
      id: 's-chal-2',
      title: 'Plant-Based Cafeteria Meal Choice Receipt OCR',
      scope: 'campus',
      category: 'Dietary Footprint',
      description: 'Scan student dining hall receipts showing meatless or local farm-to-table lunch choices.',
      rewardPoints: 30,
      progress: 45,
      joined: false,
    },
    {
      id: 's-chal-3',
      title: 'Computer Science Lab GPU Cluster Sleep Mode',
      scope: 'class',
      category: 'Green Computing',
      description: 'Run automated hibernation script on unattended lab Linux workstations after 20:00.',
      rewardPoints: 50,
      progress: 82,
      joined: true,
    },
    {
      id: 's-chal-4',
      title: 'Campus Arboretum Native Flora Moisture Log',
      scope: 'class',
      category: 'Biodiversity',
      description: 'Geotag photo observations of student tree saplings in the south campus watershed.',
      rewardPoints: 35,
      progress: 30,
      joined: false,
    },
  ]);

  const toggleJoin = (id) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined } : c));
  };

  const handleUploadEvidence = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setActiveEvidenceChallenge(null);
        setEvidenceNote('');
      }, 1400);
    }, 1100);
  };

  const filtered = challenges.filter(c => {
    if (scopeFilter === 'campus') return c.scope === 'campus';
    if (scopeFilter === 'class') return c.scope === 'class';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Campus & Class-Scoped Eco-Challenge Sprints</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Participate in inter-dorm competitions, departmental green sprints, and verify evidence via shared OCR / Geotag pipeline.
          </p>
        </div>

        {/* Scope Filter */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-white/10 text-xs">
          {['all', 'campus', 'class'].map(tab => (
            <button
              key={tab}
              onClick={() => setScopeFilter(tab)}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                scopeFilter === tab ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Sprints' : `${tab}-Wide`}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="fluent-card p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                    item.scope === 'campus' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {item.scope === 'campus' ? 'Campus-Wide Sprint' : 'Class / Dept Scoped'}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-1.5">{item.title}</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  item.joined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {item.joined ? 'Enrolled' : 'Open'}
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-3">{item.description}</p>

              <div className="p-3 rounded-lg bg-neutral-900 border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-neutral-300">
                  <span>Sprint Cohort Progress</span>
                  <span className="font-mono text-emerald-400">{item.progress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>+{item.rewardPoints} EcoPoints</span>
              </span>

              <div className="flex items-center space-x-2">
                {item.joined && (
                  <button
                    onClick={() => setActiveEvidenceChallenge(item)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs border border-emerald-500/30 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>OCR / Photo</span>
                  </button>
                )}

                <button
                  onClick={() => toggleJoin(item.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                    item.joined
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {item.joined ? 'Enrolled' : 'Join Sprint'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Evidence OCR / Geotag Modal */}
      {activeEvidenceChallenge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full border border-white/10 space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Submit Verification Evidence: {activeEvidenceChallenge.title}</span>
            </h3>

            <form onSubmit={handleUploadEvidence} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1">Evidence Pipeline Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEvidenceType('ocr_receipt')}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-center space-x-1.5 cursor-pointer ${
                      evidenceType === 'ocr_receipt'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-neutral-900 border-white/5 text-neutral-400'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt OCR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceType('geotag_photo')}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-center space-x-1.5 cursor-pointer ${
                      evidenceType === 'geotag_photo'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-neutral-900 border-white/5 text-neutral-400'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Geotagged Photo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Attach Image / Receipt File</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-neutral-800 file:text-neutral-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Observation Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Scanned plant-based meal receipt or shut down workstation 304..."
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              {uploadSuccess ? (
                <div className="p-3 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center font-bold">
                  ✓ Evidence Verified via Pipeline! +{activeEvidenceChallenge.rewardPoints} EcoPoints Staged.
                </div>
              ) : (
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveEvidenceChallenge(null)}
                    className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Verifying OCR...' : 'Submit Evidence'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
