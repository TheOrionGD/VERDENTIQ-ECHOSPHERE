import React, { useState } from 'react';
import { PERSONAS } from '../data/showcaseData';
import { MorphicCard } from '../context/MorphismContext';
import AnimatedText from './AnimatedText';
import { Shield, Activity, Cpu, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PersonaShowcase() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);

  return (
    <section id="personas" className="section-wrapper">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 04</span>
            <AnimatedText text="MULTI-PERSONA OPERATIONAL FABRIC" mode="chars" staggerMs={18} />
          </div>
          <h2>
            <AnimatedText text="Eight personas. One shared intelligence layer." mode="words" staggerMs={55} />
          </h2>
          <p>
            <AnimatedText 
              text="Experience how distinct stakeholder tiers interface with VerdantIQ Ecosphere. Switch between the eight personas below to explore their real-time telemetry, authority rings, and tailored operational readouts."
              mode="words"
              staggerMs={18}
            />
          </p>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="persona-switcher reveal-scale">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p)}
              className={`persona-btn btn-motion ${selectedPersona.id === p.id ? 'active' : ''}`}
            >
              <span style={{ opacity: 0.6, marginRight: '4px' }}>{p.num}</span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Interactive Persona Stage with Global Morphic Engine Card */}
        <MorphicCard className="persona-panel reveal-up hover-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="eyebrow-tag">{selectedPersona.badge}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  ROLE ID: {selectedPersona.id.toUpperCase()}_CTX_V2
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{selectedPersona.role}</h3>
              <p style={{ maxWidth: '780px', marginTop: '0.5rem', fontSize: '0.98rem' }}>
                {selectedPersona.description}
              </p>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>GOVERNANCE SCOPE</div>
              <div style={{ color: 'var(--color-secondary-eco)', fontWeight: '600', marginTop: '2px' }}>
                {selectedPersona.stats.governanceMode}
              </div>
            </div>
          </div>

          {/* Interactive Metric Cards with Morphic Engine */}
          <div className="persona-grid stagger-container is-visible">
            {selectedPersona.demoMetrics.map((m, idx) => (
              <MorphicCard key={idx} className="metric-card hover-lift">
                <div className="m-label">{m.label}</div>
                <div className="m-value">{m.value}</div>
                <div className="m-trend">
                  <CheckCircle2 size={12} />
                  <span>{m.trend}</span>
                </div>
              </MorphicCard>
            ))}
          </div>

          {/* Persona Live System Stream Log */}
          <div style={{ background: 'var(--bg-terminal)', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-terminal-muted)', fontSize: '0.72rem' }}>
              <span>AUDIT TELEMETRY STREAM &bull; SHA-256 SIGNED</span>
              <span style={{ color: 'var(--color-intelligent-lime)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-active" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#A6D96A' }}></span>
                LIVE LOG [DEMO]
              </span>
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <span style={{ color: 'var(--color-intelligent-lime)', marginRight: '8px' }}>[STREAM_EVENT]</span>
              {selectedPersona.sampleLog}
            </div>
          </div>
        </MorphicCard>
      </div>
    </section>
  );
}
