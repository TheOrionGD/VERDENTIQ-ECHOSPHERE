'use client';

import React, { useState } from 'react';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Terminal, ChevronRight, Activity, Zap, Layers, Navigation, Shield } from 'lucide-react';

export const VoiceCommandWidget: React.FC = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    lastCommand,
    feedbackMessage,
    speechSynthesisEnabled,
    isVoiceOverlayOpen,
    setIsVoiceOverlayOpen,
    startListening,
    stopListening,
    toggleListening,
    toggleSpeechSynthesis,
    executeVoiceCommand,
    voiceLogs,
  } = useVoiceCommand();

  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'control' | 'cheatsheet' | 'logs'>('control');

  if (!isVoiceOverlayOpen && !isListening) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeVoiceCommand(inputVal);
    setInputVal('');
  };

  const SAMPLE_COMMANDS = [
    { label: 'Go to Dashboard', cmd: 'go to dashboard', icon: Navigation, category: 'Navigation' },
    { label: 'Dark Mode', cmd: 'turn on dark mode', icon: Zap, category: 'Appearance' },
    { label: 'Switch to Admin View', cmd: 'switch role to admin', icon: Shield, category: 'System Role' },
    { label: 'Switch to MLOps View', cmd: 'switch role to mlops', icon: Layers, category: 'System Role' },
    { label: 'Open AI Assistant', cmd: 'open ai', icon: Sparkles, category: 'AI Assistant' },
    { label: 'Open Spotlight Search', cmd: 'open spotlight', icon: Terminal, category: 'System Tools' },
    { label: 'Go to MLOps Platform', cmd: 'go to mlops', icon: Navigation, category: 'Navigation' },
    { label: 'Go to Audit Governance', cmd: 'go to audit', icon: Navigation, category: 'Navigation' },
    { label: 'Ask Gemini about Carbon Target', cmd: 'ask what is our annual campus carbon footprint', icon: Sparkles, category: 'AI Assistant' },
  ];

  return (
    <div className="fixed bottom-16 sm:bottom-6 inset-x-2 sm:inset-x-auto sm:right-6 z-50 w-auto sm:w-96 max-w-[calc(100vw-1rem)] max-h-[80vh] overflow-y-auto rounded-2xl macos-liquid-glass p-3.5 sm:p-4 shadow-2xl border border-white/60 dark:border-white/10 text-stone-900 dark:text-stone-100 animate-in slide-in-from-bottom-5 duration-300 font-sf select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="flex items-center gap-2.5">
          <div
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-4 ring-rose-500/20 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            <Mic className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs">System Voice Intelligence</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold border border-emerald-500/20">
                Option+V
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              {isListening ? 'Listening active • Speak your command' : 'Voice command listener standby'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleSpeechSynthesis}
            title={speechSynthesisEnabled ? 'Speech audio response enabled' : 'Speech audio response muted'}
            className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {speechSynthesisEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4 opacity-50" />}
          </button>
          <button
            onClick={() => setIsVoiceOverlayOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 my-3 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-xl text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('control')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            activeTab === 'control'
              ? 'bg-white dark:bg-stone-900 shadow-xs font-semibold text-stone-900 dark:text-stone-100'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Mic & Live Wave
        </button>
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            activeTab === 'cheatsheet'
              ? 'bg-white dark:bg-stone-900 shadow-xs font-semibold text-stone-900 dark:text-stone-100'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Commands
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-stone-900 shadow-xs font-semibold text-stone-900 dark:text-stone-100'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          History ({voiceLogs.length})
        </button>
      </div>

      {/* Tab Content 1: Control & Waveform */}
      {activeTab === 'control' && (
        <div className="space-y-3">
          {/* Animated Waveform Visualizer */}
          <div className="relative p-4 rounded-xl bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center min-h-[110px] overflow-hidden">
            {isListening ? (
              <div className="flex items-center justify-center gap-1.5 my-2">
                {[40, 75, 50, 90, 60, 100, 45, 80, 55, 70, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse"
                    style={{
                      height: `${Math.max(12, Math.min(48, (h * (i % 2 === 0 ? 1.2 : 0.8))))}px`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 my-2 text-stone-500">
                <Activity className="h-6 w-6 opacity-40" />
                <span className="text-[11px] font-mono">Microphone Standby</span>
              </div>
            )}

            {/* Live Transcript Display */}
            <div className="w-full text-center mt-1 px-2">
              {interimTranscript ? (
                <p className="text-xs font-mono text-emerald-400 animate-pulse truncate">
                  &quot;{interimTranscript}&quot;
                </p>
              ) : feedbackMessage ? (
                <p className="text-xs font-medium text-stone-300 leading-tight">
                  {feedbackMessage}
                </p>
              ) : (
                <p className="text-[11px] text-stone-500">
                  Click the toggle button or speak aloud
                </p>
              )}
            </div>
          </div>

          {/* Action toggle button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`flex-1 py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" /> Stop Voice Mic
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Start Voice Mic
                </>
              )}
            </button>
          </div>

          {/* Fallback Text Input Form */}
          <form onSubmit={handleManualSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Or type voice command manually (e.g. 'dark mode')..."
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-2 p-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 2: Cheatsheet */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          <p className="text-[11px] text-stone-500">Click any voice preset to execute immediately:</p>
          <div className="grid grid-cols-1 gap-1.5">
            {SAMPLE_COMMANDS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => executeVoiceCommand(item.cmd)}
                  className="w-full p-2 rounded-xl bg-white/40 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-stone-900 dark:text-stone-100">{item.label}</div>
                      <div className="text-[10px] font-mono text-stone-400">&quot;{item.cmd}&quot;</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200/40 dark:bg-stone-800/40 text-stone-500 font-mono">
                    {item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: History Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {voiceLogs.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-xs">No voice command history logged yet.</div>
          ) : (
            <div className="space-y-1.5">
              {voiceLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-white/40 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 text-xs flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                    <span>{log.timestamp}</span>
                    <span className="text-emerald-500 font-semibold">{log.action}</span>
                  </div>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">&quot;{log.text}&quot;</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
