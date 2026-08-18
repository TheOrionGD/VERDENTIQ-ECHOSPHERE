'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMacTheme } from '@/context/MacThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import {
  Search,
  Bot,
  LayoutDashboard,
  Shield,
  Palette,
  Settings,
  Bell,
  Activity,
  Command,
  ArrowRight,
  Sparkles,
  X,
  Mic,
  MicOff,
} from 'lucide-react';

export const MacSpotlight: React.FC = () => {
  const router = useRouter();
  const { isSpotlightOpen, setIsSpotlightOpen, accentColor } = useMacTheme();
  const { roleConfig } = useAuth();
  const { isListening, toggleListening, interimTranscript, transcript } = useVoiceCommand();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (interimTranscript) {
      setQuery(interimTranscript);
    } else if (transcript) {
      setQuery(transcript);
    }
  }, [interimTranscript, transcript]);

  // Keyboard shortcut Cmd+Space or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Space' || e.key === 'k')) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSpotlightOpen) {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightOpen, setIsSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  const quickLinks = [
    {
      title: 'Role Dashboard',
      subtitle: `${roleConfig.label} Main View`,
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
    },
    {
      title: 'Ask AI Assistant',
      subtitle: 'Ask Gemini sustainability & HVAC questions',
      path: '/assistant',
      icon: Bot,
    },
    {
      title: 'Design System Kit',
      subtitle: 'Inspect VerdantIQ glass components & design tokens',
      path: '/design-system',
      icon: Palette,
    },
    {
      title: 'Audit & Compliance Logs',
      subtitle: 'Review ESG audit reports and tenant history',
      path: '/audit/overview',
      icon: Shield,
    },
    {
      title: 'Notifications & Alerts',
      subtitle: 'View live grid intensity & anomaly alerts',
      path: '/notifications',
      icon: Bell,
    },
    {
      title: 'System Settings',
      subtitle: 'Configure theme, preferences, and security',
      path: '/settings',
      icon: Settings,
    },
  ];

  const filteredLinks = query
    ? quickLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(query.toLowerCase()) ||
          link.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  const handleSelect = (path: string) => {
    setIsSpotlightOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-3 sm:px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 font-sf select-none">
      <div
        className="fixed inset-0"
        onClick={() => setIsSpotlightOpen(false)}
      />
      
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl macos-liquid-glass p-3 shadow-2xl border border-white/60 dark:border-white/15 text-stone-900 dark:text-stone-100 z-50 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-stone-200/50 dark:border-stone-800/50">
          <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search VerdantIQ system or ask Gemini AI..."
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop voice mic' : 'Dictate search with voice'}
            className={`p-1.5 rounded-lg transition-colors ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-stone-400 bg-stone-200/50 dark:bg-stone-800/50 px-2 py-0.5 rounded-md border border-white/20">
            <Command className="h-2.5 w-2.5" /> Space
          </kbd>
          <button
            onClick={() => setIsSpotlightOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="py-2 max-h-80 overflow-y-auto space-y-1">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => handleSelect(link.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-700 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 text-emerald-700 dark:text-emerald-300 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">{link.title}</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 group-hover:text-emerald-100">
                        {link.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-emerald-600 animate-pulse" />
              <span>No direct match. Press Enter to search with Gemini AI Assistant...</span>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="pt-2 mt-1 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-[10px] text-stone-400 px-2">
          <span>VerdantIQ Spotlight Engine</span>
          <span>Use ↑↓ to navigate, Esc to close</span>
        </div>
      </div>
    </div>
  );
};
