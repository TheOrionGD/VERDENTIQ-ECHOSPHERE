'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckSquare, ExternalLink, Copy, Check, Calendar, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface GoogleTasksReminderWidgetProps {
  initialTitle?: string;
  initialNotes?: string;
  className?: string;
  compact?: boolean;
}

export const GoogleTasksReminderWidget: React.FC<GoogleTasksReminderWidgetProps> = ({
  initialTitle = 'Review VerdantIQ Environmental Telemetry',
  initialNotes = 'Follow up on campus HVAC energy optimization and local carbon emissions target.',
  className = '',
  compact = false,
}) => {
  const toast = useToast();
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [taskNotes, setTaskNotes] = useState(initialNotes);
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  // Deep redirect links for Google Tasks
  const GOOGLE_TASKS_WEB_URL = 'https://tasks.google.com';
  const GOOGLE_CALENDAR_TASKS_URL = 'https://calendar.google.com/calendar/u/0/r/tasks';
  const GOOGLE_CANVAS_TASKS_URL = 'https://mail.google.com/tasks/canvas';

  const handleOpenGoogleTasks = (url: string = GOOGLE_TASKS_WEB_URL) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Redirecting to Google Tasks', 'Opened Google Tasks in a new browser tab.');
  };

  const handleCopyTaskData = () => {
    const formattedTask = `📋 [VerdantIQ Task Reminder]
Title: ${taskTitle}
Due Date: ${dueDate}
Details: ${taskNotes}
System Ref: VerdantIQ Environmental Governance Platform`;

    navigator.clipboard.writeText(formattedTask);
    setCopied(true);
    toast.success('Task Copied to Clipboard', 'You can now paste this directly into your Google Tasks app!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className={`flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-900/40 border border-stone-800 text-xs ${className}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 flex-shrink-0">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-stone-200 truncate">{taskTitle}</span>
            <span className="text-[10px] text-stone-400">Google Tasks Quick Link</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="secondary"
            size="xs"
            onClick={handleCopyTaskData}
            title="Copy formatted task text"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => handleOpenGoogleTasks(GOOGLE_TASKS_WEB_URL)}
            title="Open Google Tasks App"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-4 bg-gradient-to-br from-stone-900 to-stone-950 border border-blue-900/30 text-stone-100 shadow-xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-100">Google Tasks Reminder Redirect</h3>
              <Badge variant="blue" className="text-[10px]">Web App Link</Badge>
            </div>
            <p className="text-[11px] text-stone-400">
              Create and manage reminders directly in your official Google Tasks app.
            </p>
          </div>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-stone-300 mb-1">
            Task Title / Title Reminder
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Complete Life Sciences HVAC Audit..."
            className="w-full h-8 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-stone-300 mb-1">
              Target Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-stone-300 mb-1">
              Task Context / Notes
            </label>
            <input
              type="text"
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Add details, notes, or URL references..."
              className="w-full h-8 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyTaskData}
          className="text-stone-300 border-stone-700 hover:bg-stone-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy Task Details
            </>
          )}
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenGoogleTasks(GOOGLE_CALENDAR_TASKS_URL)}
            title="Open Tasks inside Google Calendar"
            className="text-[11px]"
          >
            Calendar Tasks
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenGoogleTasks(GOOGLE_TASKS_WEB_URL)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Open Google Tasks App
          </Button>
        </div>
      </div>
    </Card>
  );
};
