'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HelpCircle, Search, FileText, Send, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function HelpPage() {
  const toast = useToast();
  const [ticketSubject, setTicketSubject] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I toggle between the 8 role states?',
      a: 'Click the DEV ONLY role switcher badge located in the bottom-left corner of the screen, or select a role in the top header badge menu.',
    },
    {
      q: 'How does the Omnibar Command Engine process queries?',
      a: 'The Omnibar accepts natural language commands (press Cmd+K or Ctrl+K anywhere) and synthesizes environmental metrics, HVAC recommendations, and ML model drift telemetry.',
    },
    {
      q: 'What is the "Emerald Oasis" design theme?',
      a: 'Emerald Oasis is VerdantIQ\'s signature palette featuring deep emerald greens, warm stone neutrals, muted amber warnings, and soft coral anomaly indicators.',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Knowledge Base</Badge>
          </div>
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            Help Center & Documentation
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Documentation, role-based governance FAQs, and platform support ticketing.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <h2 className="font-editorial text-lg font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          {faqs.map((f, i) => (
            <Card
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="p-4 cursor-pointer hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center justify-between font-semibold text-xs text-stone-900">
                <span>{f.q}</span>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === i && (
                <p className="text-xs text-stone-600 mt-2 leading-relaxed border-t border-stone-100 pt-2">
                  {f.a}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Support Ticket Submission */}
        <Card className="p-5 space-y-3">
          <h2 className="font-editorial text-lg font-bold text-stone-900">
            Submit Support Ticket
          </h2>
          <div className="space-y-2 text-xs">
            <input
              type="text"
              placeholder="Brief summary of issue or question..."
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full h-9 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Ticket Submitted', 'Ticket #TCK-9921 recorded in support queue.');
                setTicketSubject('');
              }}
            >
              <Send className="h-3.5 w-3.5 mr-1" /> Submit Ticket
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
