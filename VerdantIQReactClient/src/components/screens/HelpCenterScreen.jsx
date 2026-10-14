import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  LifeBuoy
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function HelpCenterScreen({ onBack, onNavigateScreen }) {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [submittedToast, setSubmittedToast] = useState(false);

  const faqs = [
    {
      q: 'How do I toggle between the 8 role states in VerdantIQ?',
      a: 'Click the Windows 11 Start Menu button in the bottom taskbar, select any of the 8 Governance Tier accounts (Platform Admin, MLOps, Audit, Region, Campus Admin, Dept Moderator, Student, Citizen Household), or switch directly from the Landing Page.',
    },
    {
      q: 'How does the Omnibar Command Engine synthesize metrics?',
      a: 'The Omnibar accepts natural language telemetry queries and synthesizes multi-resource energy data, HVAC thermal setpoints, water flow rates, and XGBoost drift anomaly alerts in real time.',
    },
    {
      q: 'What is the Fluid Glass & Mica UI density control?',
      a: 'The Windows 11 Action Center (click the battery/Wi-Fi/volume tray icon on the taskbar) features a live Fluid Glass Density slider (0% to 100%) that dynamically adjusts backdrop blur, saturation, and mica opacity.',
    },
    {
      q: 'How are tenant provisioning requests validated?',
      a: 'Campus & District tenant applications submitted through the Pre-Auth Onboarding Portal are cryptographically geofenced, domain-checked, and reviewed under Regional District Admin governance before Postgres schema activation.',
    },
    {
      q: 'Is VerdantIQ compliant with enterprise ESG standards?',
      a: 'Yes. VerdantIQ calculates Scope 1 (direct combustion), Scope 2 (grid electricity emissions factoring regional grid intensity), and Scope 3 (commute, procurement, waste streams) aligned with GHG Protocol and ISO 50001 standards.',
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;
    setSubmittedToast(true);
    setTicketSubject('');
    setTicketDesc('');
    setTimeout(() => setSubmittedToast(false), 4500);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans p-4 sm:p-8 relative selection:bg-emerald-500 selection:text-black">
      <BackgroundVideo overlayClassName="bg-slate-950/85 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between liquid-glass-panel liquid-shimmer p-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-emerald-400/40 text-white shadow-md overflow-hidden p-1 flex items-center justify-center animate-liquid-pulse">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ Knowledge Base</span>
              <span className="text-[10px] font-mono text-emerald-400">Help Center & Role Governance Support</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateScreen && onNavigateScreen('documentation')}
              className="liquid-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/30 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Docs</span>
            </button>
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {submittedToast && (
          <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2 shadow-2xl animate-liquid-pulse">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Support Ticket <strong>#TCK-9921</strong> logged to dispatch queue. An enterprise administrator will review shortly.</span>
          </div>
        )}

        {/* Hero Banner */}
        <div className="liquid-glass-panel liquid-shimmer rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Platform Support & Onboarding Assistance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Help Center & Technical Reference
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            Browse answers to common operational questions, explore architecture and security standards, or submit a direct ticket to our sustainability engineering response team.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="liquid-glass-panel rounded-2xl p-6 shadow-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((f, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="liquid-glass-panel rounded-xl p-4 border border-white/10 hover:border-emerald-400/40 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-emerald-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && (
                  <p className="text-xs text-neutral-300 mt-2.5 pt-2.5 border-t border-white/10 leading-relaxed">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Submission Card */}
        <div className="liquid-glass-panel liquid-shimmer rounded-2xl p-6 shadow-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Submit Governance Support Ticket
            </h2>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">Subject / Incident Summary</label>
              <input
                type="text"
                required
                placeholder="e.g. Submeter BACnet/IP telemetry sync issue on Engineering Hall..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full bg-neutral-900/90 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Include building ID, meter serials, or relevant error codes..."
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                className="w-full bg-neutral-900/90 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="liquid-btn liquid-shimmer px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterScreen;
