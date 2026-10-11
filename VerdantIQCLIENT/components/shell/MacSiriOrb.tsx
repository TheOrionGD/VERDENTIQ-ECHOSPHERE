'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMacTheme } from '@/context/MacThemeContext';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import { Bot, Sparkles, X, ArrowRight, Mic, Send, MicOff } from 'lucide-react';

export const MacSiriOrb: React.FC = () => {
  const router = useRouter();
  const { isSiriOpen, setIsSiriOpen } = useMacTheme();
  const { isListening, toggleListening, interimTranscript, transcript } = useVoiceCommand();
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (interimTranscript) {
      setPrompt(interimTranscript);
    } else if (transcript) {
      setPrompt(transcript);
    }
  }, [interimTranscript, transcript]);

  if (!isSiriOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setIsSiriOpen(false);
      router.push(`/assistant?prompt=${encodeURIComponent(prompt)}`);
      setPrompt('');
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 inset-x-2 sm:inset-x-auto sm:right-6 z-50 w-auto sm:w-80 rounded-2xl macos-liquid-glass p-3.5 sm:p-4 shadow-2xl border border-white/60 dark:border-white/10 text-stone-900 dark:text-stone-100 animate-in slide-in-from-bottom-3 duration-200 font-sf select-none">
      {/* AI Assistant Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="flex items-center gap-2">
          {/* Animated Liquid Orb */}
          <div className="relative h-6 w-6 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 animate-pulse shadow-md">
            <div className="h-full w-full rounded-full bg-black/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <span className="font-bold text-xs">VerdantIQ AI Assistant</span>
        </div>
        <button
          onClick={() => setIsSiriOpen(false)}
          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Ask Gemini AI Copilot about grid emissions, HVAC setpoints, or campus carbon targets:
        </p>

        <div className="relative flex items-center">
          <input
            type="text"
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can we reduce peak load today?"
            className="w-full pl-3 pr-16 py-2 rounded-xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop voice mic' : 'Dictate with voice mic'}
              className={`p-1 rounded-lg transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-stone-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>
            <button
              type="submit"
              disabled={isThinking}
              className="p-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 rounded-lg cursor-pointer"
            >
              {isThinking ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            'Optimize HVAC Zone 4',
            'Summarize ESG Report',
            'Check Solar Array Output',
          ].map((sugg) => (
            <button
              key={sugg}
              type="button"
              onClick={() => {
                setPrompt(sugg);
              }}
              className="px-2 py-1 rounded-lg bg-stone-200/50 dark:bg-stone-800/50 text-[10px] text-stone-600 dark:text-stone-300 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
            >
              {sugg}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
