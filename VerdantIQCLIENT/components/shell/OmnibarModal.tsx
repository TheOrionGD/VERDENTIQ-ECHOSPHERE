'use client';

import React, { useState } from 'react';
import { useAuth, ViewMode } from '@/context/AuthContext';
import { OmnibarQueryResponse } from '@/lib/services/assistantService';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Sparkles,
  Command,
  X,
  ArrowRight,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface OmnibarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OmnibarModal: React.FC<OmnibarModalProps> = ({ isOpen, onClose }) => {
  const { viewMode } = useAuth();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<OmnibarQueryResponse | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = [] as any;
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (presetText: string) => {
    setQuery(presetText);
    setIsLoading(true);
    Promise.resolve([] as any).then((res) => {
      setResponse(res);
      setIsLoading(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-stone-200/80 bg-stone-50/70">
          <Sparkles className="h-5 w-5 text-emerald-700 flex-shrink-0 animate-pulse" />
          <input
            type="text"
            placeholder="Ask VerdantIQ Omnibar... (e.g. 'Analyze Life Sciences B HVAC anomaly')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none text-stone-900 placeholder-stone-400 focus:outline-none font-sans"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-stone-400 bg-stone-200/60 px-2 py-0.5 rounded">
            <Command className="h-3 w-3" /> K
          </kbd>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            <Send className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Content Panel */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
          {!response && !isLoading && (
            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Suggested Omnibar Commands
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetClick('Analyze Life Sciences B HVAC anomaly')}
                  className="p-3 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-stone-800 group-hover:text-emerald-900">HVAC Anomaly</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Diagnose Chiller Unit #3 spike</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('Compare Scope 2 emissions vs Q2 target')}
                  className="p-3 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-stone-800 group-hover:text-emerald-900">Scope 2 Carbon</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Audit Q2 emission ceiling</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('Check ML Ops model latency & drift status')}
                  className="p-3 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-stone-800 group-hover:text-emerald-900">ML Telemetry</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Model drift & latency report</div>
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Bot className="h-8 w-8 text-emerald-700 animate-bounce" />
              <p className="text-xs font-medium text-stone-600">
                VerdantIQ AI Engine synthesizing environmental spatial data...
              </p>
            </div>
          )}

          {response && !isLoading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <Badge variant="emerald" dot>{response.intent}</Badge>
                <span className="text-[10px] font-mono text-stone-400">Query ID: #OMNI-2026-X8</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/5 border border-emerald-800/20 text-stone-800">
                <p className="font-medium leading-relaxed">{response.summary}</p>
              </div>

              {response.dataMetrics && (
                <div className="grid grid-cols-3 gap-3">
                  {response.dataMetrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                      <div className="text-[10px] font-medium text-stone-500">{m.label}</div>
                      <div className="text-sm font-bold text-stone-900 mt-0.5">{m.value}</div>
                      <div className="text-[10px] font-semibold text-emerald-800 mt-0.5">{m.delta}</div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  Recommended System Actions
                </span>
                <ul className="space-y-2">
                  {response.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const taskText = `VerdantIQ: ${response.intent} - ${response.query}`;
                    navigator.clipboard.writeText(taskText);
                    window.open('https://tasks.google.com', '_blank', 'noopener,noreferrer');
                  }}
                  className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs"
                >
                  <CheckSquare className="h-3.5 w-3.5 mr-1 text-blue-600" />
                  Google Tasks Reminder
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    router.push('/assistant');
                  }}
                >
                  Open Full Assistant Page <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
