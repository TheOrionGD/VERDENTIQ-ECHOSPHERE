'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMacTheme } from '@/context/MacThemeContext';

export interface VoiceLog {
  id: string;
  text: string;
  action: string;
  timestamp: string;
}

interface VoiceCommandContextType {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: string | null;
  feedbackMessage: string | null;
  isSupported: boolean;
  speechSynthesisEnabled: boolean;
  isVoiceOverlayOpen: boolean;
  setIsVoiceOverlayOpen: (open: boolean) => void;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  toggleSpeechSynthesis: () => void;
  executeVoiceCommand: (cmdText: string) => boolean;
  voiceLogs: VoiceLog[];
  clearLogs: () => void;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const VoiceCommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, switchRole, roleConfig } = useAuth();
  const {
    setThemeMode,
    effectiveTheme,
    setIsSiriOpen,
    setIsSpotlightOpen,
    setIsControlCenterOpen,
    setIsNotificationCenterOpen,
  } = useMacTheme();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);

  const recognitionRef = useRef<any>(null);

  const speak = useCallback(
    (text: string) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && speechSynthesisEnabled) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [speechSynthesisEnabled]
  );

  const addVoiceLog = useCallback((text: string, action: string) => {
    const newLog: VoiceLog = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      action,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setVoiceLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  }, []);

  const executeVoiceCommand = useCallback(
    (cmdRaw: string): boolean => {
      const text = cmdRaw.trim().toLowerCase();
      if (!text) return false;

      setLastCommand(cmdRaw);

      // 1. Theme Commands
      if (text.includes('dark mode') || text.includes('dark theme') || text.includes('light mode') || text.includes('light theme')) {
        setThemeMode('dark');
        const msg = 'Dark theme is locked active across system';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }

      // 2. Role Switching Commands (8-Tier System Hierarchy)
      if (text.includes('switch role to platform admin') || text.includes('role admin') || text.includes('admin view')) {
        switchRole('admin');
        const msg = 'Switched to Tier 1: Platform Admin';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to mlops') || text.includes('mlops view') || text.includes('role mlops')) {
        switchRole('mlops');
        const msg = 'Switched to Tier 2: ML Ops Admin';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to audit') || text.includes('auditor view') || text.includes('role audit')) {
        switchRole('audit');
        const msg = 'Switched to Tier 3: Auditor / Researcher';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to regional') || text.includes('regional admin') || text.includes('district governance') || text.includes('regional governance')) {
        switchRole('region');
        const msg = 'Switched to Tier 4: Regional Admin (Regional District Governance)';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to institution') || text.includes('institution admin') || text.includes('role institution')) {
        switchRole('institution');
        const msg = 'Switched to Tier 5: Institution Admin';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to department') || text.includes('department moderator') || text.includes('role dept')) {
        switchRole('dept');
        const msg = 'Switched to Tier 6: Department Moderator';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to student') || text.includes('student view') || text.includes('role student')) {
        switchRole('student');
        const msg = 'Switched to Tier 7: Student Learner';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('switch role to standard user') || text.includes('household view') || text.includes('role user')) {
        switchRole('user');
        const msg = 'Switched to Tier 8: Standard User (Household)';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }

      // 3. System Utility Overlays
      if (text.includes('open siri') || text.includes('open ai') || text.includes('launch ai') || text.includes('ai assistant')) {
        setIsSiriOpen(true);
        const msg = 'Opening AI Assistant';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('open spotlight') || text.includes('spotlight search') || text.includes('search command')) {
        setIsSpotlightOpen(true);
        const msg = 'Opening Spotlight Search';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('open control center') || text.includes('control center') || text.includes('system settings')) {
        setIsControlCenterOpen(true);
        const msg = 'Opening Control Center';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('open notifications') || text.includes('show notifications')) {
        setIsNotificationCenterOpen(true);
        const msg = 'Opening Notification Center';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('open voice overlay') || text.includes('voice overlay') || text.includes('voice help')) {
        setIsVoiceOverlayOpen(true);
        const msg = 'Opening Voice Control Panel';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }

      // 4. Navigation Commands
      if (text.includes('go home') || text.includes('landing page') || text.includes('open landing')) {
        router.push('/landing');
        const msg = 'Navigating to Landing Page';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('my dashboard') || text === 'dashboard' || text.includes('open dashboard') || text.includes('go to dashboard')) {
        const dest = roleConfig.dashboardPath || '/user/dashboard';
        router.push(dest);
        const msg = `Navigating to ${roleConfig.label} Dashboard`;
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('admin dashboard') || text.includes('go to admin')) {
        router.push('/admin-dashboard');
        const msg = 'Navigating to Admin Dashboard';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('mlops dashboard') || text.includes('go to mlops') || text.includes('open mlops')) {
        router.push('/mlops-dashboard');
        const msg = 'Navigating to MLOps Platform';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('audit dashboard') || text.includes('go to audit') || text.includes('open audit')) {
        router.push('/audit-dashboard');
        const msg = 'Navigating to Audit Governance';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('department dashboard') || text.includes('go to department') || text.includes('go to dept')) {
        router.push('/dept-dashboard');
        const msg = 'Navigating to Department Workspace';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('institution dashboard') || text.includes('go to institution')) {
        router.push('/institution-dashboard');
        const msg = 'Navigating to Institution Dashboard';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('region dashboard') || text.includes('go to region')) {
        router.push('/region-dashboard');
        const msg = 'Navigating to Regional Analytics';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('student dashboard') || text.includes('go to student')) {
        router.push('/student-dashboard');
        const msg = 'Navigating to Student Hub';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('go to assistant') || text.includes('open assistant') || text.includes('ai assistant')) {
        router.push('/assistant');
        const msg = 'Navigating to AI Assistant Workspace';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('go to settings') || text.includes('open settings') || text.includes('system settings')) {
        router.push('/settings');
        const msg = 'Navigating to System Settings';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('go to profile') || text.includes('open profile') || text.includes('my profile')) {
        router.push('/profile');
        const msg = 'Navigating to User Profile';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('go to help') || text.includes('open help') || text.includes('user manual')) {
        router.push('/help');
        const msg = 'Navigating to Help Center';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('design system') || text.includes('ui kit')) {
        router.push('/design-system');
        const msg = 'Navigating to VerdantIQ Design System';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }
      if (text.includes('login') || text.includes('sign in')) {
        router.push('/login');
        const msg = 'Navigating to Login Page';
        setFeedbackMessage(msg);
        speak(msg);
        addVoiceLog(cmdRaw, msg);
        return true;
      }

      // 5. Query / Prompt fallback to Assistant
      if (
        text.startsWith('ask ') ||
        text.startsWith('query ') ||
        text.startsWith('search for ') ||
        text.startsWith('tell me ') ||
        text.startsWith('what is ') ||
        text.startsWith('how to ') ||
        text.length > 8
      ) {
        let cleanPrompt = cmdRaw;
        if (text.startsWith('ask ')) cleanPrompt = cmdRaw.substring(4);
        else if (text.startsWith('query ')) cleanPrompt = cmdRaw.substring(6);
        else if (text.startsWith('search for ')) cleanPrompt = cmdRaw.substring(11);

        const msg = `Sending query to Gemini: "${cleanPrompt}"`;
        setFeedbackMessage(msg);
        speak(`Asking Gemini: ${cleanPrompt}`);
        addVoiceLog(cmdRaw, msg);
        router.push(`/assistant?prompt=${encodeURIComponent(cleanPrompt)}`);
        return true;
      }

      const fallbackMsg = `Unrecognized command: "${cmdRaw}"`;
      setFeedbackMessage(fallbackMsg);
      speak(`Command not recognized: ${cmdRaw}`);
      addVoiceLog(cmdRaw, 'Unrecognized Command');
      return false;
    },
    [
      router,
      roleConfig,
      switchRole,
      setThemeMode,
      setIsSiriOpen,
      setIsSpotlightOpen,
      setIsControlCenterOpen,
      setIsNotificationCenterOpen,
      speak,
      addVoiceLog,
    ]
  );

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setIsListening(true);
      setFeedbackMessage('Listening via system dictation...');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedbackMessage('Listening for voice commands...');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTrans += res[0].transcript;
          } else {
            currentInterim += res[0].transcript;
          }
        }

        setInterimTranscript(currentInterim);
        if (finalTrans) {
          setTranscript(finalTrans);
          executeVoiceCommand(finalTrans);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setFeedbackMessage('Microphone access denied. Please grant permission in browser settings.');
          speak('Microphone access denied');
        } else {
          setFeedbackMessage(`Voice status: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Automatically restart if user intended to stay listening
        if (isListening && recognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Speech recognition init error:', e);
      setIsListening(true);
      setFeedbackMessage('Voice dictation active');
    }
  }, [executeVoiceCommand, isListening, speak]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setInterimTranscript('');
    setFeedbackMessage('Voice listening paused');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      recognitionRef.current = null;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const toggleSpeechSynthesis = useCallback(() => {
    setSpeechSynthesisEnabled((prev) => !prev);
  }, []);

  const clearLogs = useCallback(() => {
    setVoiceLogs([]);
  }, []);

  // Keyboard shortcut listener for Option+V or Alt+V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        setIsVoiceOverlayOpen((prev) => !prev);
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening]);

  return (
    <VoiceCommandContext.Provider
      value={{
        isListening,
        transcript,
        interimTranscript,
        lastCommand,
        feedbackMessage,
        isSupported,
        speechSynthesisEnabled,
        isVoiceOverlayOpen,
        setIsVoiceOverlayOpen,
        startListening,
        stopListening,
        toggleListening,
        toggleSpeechSynthesis,
        executeVoiceCommand,
        voiceLogs,
        clearLogs,
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
};

export const useVoiceCommand = () => {
  const context = useContext(VoiceCommandContext);
  if (!context) {
    throw new Error('useVoiceCommand must be used within a VoiceCommandProvider');
  }
  return context;
};
