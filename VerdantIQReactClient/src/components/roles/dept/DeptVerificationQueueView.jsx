import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export function DeptVerificationQueueView() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedItemId, setSelectedItemId] = useState('vr-01');
  const [selectedForBulk, setSelectedForBulk] = useState([]);
  const [reasonCode, setReasonCode] = useState('REASON_GEO_MATCH_VALID');
  const [reviewNotes, setReviewNotes] = useState('');

  const [items, setItems] = useState([
    {
      id: 'vr-01',
      studentName: 'Alex Mercer',
      studentId: 'STD-2041',
      challengeTitle: 'Computer Lab Twilight Workstation Shutdown',
      department: 'Computer Science',
      status: 'pending',
      submittedAt: '2026-10-14 08:30:00',
      slaCountdownMinutes: 48,
      points: 30,
      notes: 'Powered down workstations 301–312 in Science B basement after algorithms seminar.',
      anomalyScore: 0.12, // Low anomaly
      geotagMatch: true,
      ocrConfidence: 94.2,
      geotagCoord: 'Lat 47.6062° N, Long 122.3321° W (Lab Room 302)',
      isDuplicateAlert: false,
    },
    {
      id: 'vr-02',
      studentName: 'Zoe Thorne',
      studentId: 'STD-2104',
      challengeTitle: 'Living Lab Native Tree Arboretum Watering',
      department: 'Environmental Science',
      status: 'pending',
      submittedAt: '2026-10-14 09:15:00',
      slaCountdownMinutes: 110,
      points: 50,
      notes: 'Watered south row western redcedars and logged soil moisture sensor reading.',
      anomalyScore: 0.18,
      geotagMatch: true,
      ocrConfidence: 91.0,
      geotagCoord: 'Lat 47.6080° N, Long 122.3350° W (Campus Quad Wetland)',
      isDuplicateAlert: false,
    },
    {
      id: 'vr-03',
      studentName: 'Jordan Hayes',
      studentId: 'STD-1899',
      challengeTitle: 'Cafeteria Compost Segregation Receipt',
      department: 'Bioengineering',
      status: 'pending',
      submittedAt: '2026-10-14 10:00:00',
      slaCountdownMinutes: 24,
      points: 35,
      notes: 'Submitted dining voucher photo for reusable container return deposit.',
      anomalyScore: 0.44, // Moderate anomaly
      geotagMatch: false,
      ocrConfidence: 71.5,
      geotagCoord: 'Lat 47.5910° N, Long 122.3100° W (Outside Campus Perimeter)',
      isDuplicateAlert: true,
    },
  ]);

  const selectedItem = items.find(i => i.id === selectedItemId) || items[0];

  const handleApprove = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
    setReviewNotes('');
  };

  const handleReject = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
    setReviewNotes('');
  };

  const handleEscalate = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'escalated' } : i));
    setReviewNotes('');
  };

  const handleBulkApproveLowAnomaly = () => {
    const lowAnomalyIds = items.filter(i => i.status === 'pending' && i.anomalyScore < 0.25).map(i => i.id);
    setItems(prev => prev.map(i => lowAnomalyIds.includes(i.id) ? { ...i, status: 'approved' } : i));
    setSelectedForBulk([]);
  };

  const filtered = items.filter(i => {
    if (activeTab === 'all') return true;
    return i.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Department Evidence Triage & Verification Studio</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit student EcoPoint submissions with automated IsolationForest anomaly scoring, OCR checks, and SLA tracking.
          </p>
        </div>

        {/* Quick Bulk Action */}
        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-lg text-xs">
          <span className="text-emerald-300 font-mono">
            Low Anomaly (&lt;0.25): {items.filter(i => i.status === 'pending' && i.anomalyScore < 0.25).length} items
          </span>
          <button
            onClick={handleBulkApproveLowAnomaly}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center space-x-1 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fast-Track Bulk Approve</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Queue, Right Evidence Inspector */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Queue List */}
        <div className="col-span-5 fluent-card p-4 space-y-3">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2.5 text-xs">
            {['pending', 'approved', 'rejected', 'all'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                  activeTab === t ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
            <span>Queue items ({filtered.length})</span>
            {selectedForBulk.length > 0 && (
              <button
                onClick={() => {
                  setItems(prev => prev.map(i => selectedForBulk.includes(i.id) ? { ...i, status: 'approved' } : i));
                  setSelectedForBulk([]);
                }}
                className="text-[10px] text-emerald-400 hover:underline"
              >
                Approve Selected ({selectedForBulk.length})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filtered.map(item => (
              <div
                key={item.id}
                className={`w-full p-3 rounded-lg text-left border transition-all flex items-start space-x-2.5 ${
                  selectedItemId === item.id
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow'
                    : 'bg-neutral-900 border-white/5 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedForBulk.includes(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedForBulk(prev => e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id));
                  }}
                  className="mt-1 rounded border-white/20 text-emerald-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className="flex-1 text-left cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1 text-xs">
                    <span className="font-semibold text-white truncate max-w-[180px]">{item.challengeTitle}</span>
                    <span className="font-mono text-emerald-400 font-bold">+{item.points} Pts</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mb-2">{item.studentName} ({item.studentId})</div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>SLA: {item.slaCountdownMinutes}m</span>
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-semibold ${
                      item.anomalyScore < 0.25 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      Anomaly: {item.anomalyScore}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Evidence Studio */}
        {selectedItem && (
          <div className="col-span-7 fluent-card p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Evidence Inspection Studio</span>
                <h3 className="text-sm font-semibold text-white mt-0.5">{selectedItem.challengeTitle}</h3>
                <div className="text-[11px] text-neutral-400">
                  Submitter: {selectedItem.studentName} ({selectedItem.studentId}) · Department: {selectedItem.department}
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded font-semibold uppercase ${
                selectedItem.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                selectedItem.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {selectedItem.status}
              </span>
            </div>

            {/* Note & Geotag Details */}
            <div className="space-y-2">
              <div className="p-3 rounded bg-neutral-900 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase">Student Observation Note</span>
                <p className="text-neutral-200 italic leading-relaxed">"{selectedItem.notes}"</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-neutral-900 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">Campus Geofence Polygon</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-400">{selectedItem.geotagCoord}</div>
                  <div className="text-[10px] text-neutral-400">{selectedItem.geotagMatch ? '✓ Verified within boundary' : '⚠ Outside boundary'}</div>
                </div>

                <div className="p-3 rounded bg-neutral-900 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span className="font-semibold">OCR Vision Confidence</span>
                  </div>
                  <div className="font-mono text-base font-bold text-white">{selectedItem.ocrConfidence}%</div>
                  <div className="text-[10px] text-neutral-400">Hardware counter & receipt text match</div>
                </div>
              </div>

              {selectedItem.isDuplicateAlert && (
                <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Warning: Hash duplicate detected. A similar image was submitted within the last 48 hours.</span>
                </div>
              )}
            </div>

            {/* Moderator Action Controls */}
            {selectedItem.status === 'pending' && (
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-neutral-400 mb-1 text-[11px]">Audit Reason Code</label>
                    <select
                      value={reasonCode}
                      onChange={(e) => setReasonCode(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white"
                    >
                      <option value="REASON_GEO_MATCH_VALID">REASON_GEO_MATCH_VALID — Verified Geofence & Evidence</option>
                      <option value="REASON_OCR_VERIFIED">REASON_OCR_VERIFIED — Meter/Receipt High Confidence</option>
                      <option value="REASON_INSUFFICIENT_PROOF">REASON_INSUFFICIENT_PROOF — Evidence Blurred / Incomplete</option>
                      <option value="REASON_DUPLICATE">REASON_DUPLICATE — Suspected Re-submission</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 text-[11px]">Reviewer Notes / Feedback to Student</label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide specific constructive feedback or notes regarding proof submission..."
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleReject(selectedItem.id)}
                    className="flex-1 py-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 flex items-center justify-center space-x-1 cursor-pointer font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Proof</span>
                  </button>

                  <button
                    onClick={() => handleEscalate(selectedItem.id)}
                    className="flex-1 py-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center justify-center space-x-1 cursor-pointer font-medium"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Escalate to Dean</span>
                  </button>

                  <button
                    onClick={() => handleApprove(selectedItem.id)}
                    className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-1 cursor-pointer font-medium"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve (+{selectedItem.points} Pts)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
