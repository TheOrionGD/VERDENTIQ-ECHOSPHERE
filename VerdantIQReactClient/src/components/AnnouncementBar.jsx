import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <span className="badge">
        <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
        Release v2.4
      </span>
      <span>
        Introducing <strong>VerdantIQ Ecosphere</strong> — A connected intelligence platform for sustainable operations & digital twins.
      </span>
      <a href="#ecosystem">
        Explore the ecosystem <ArrowRight size={13} />
      </a>
    </div>
  );
}

