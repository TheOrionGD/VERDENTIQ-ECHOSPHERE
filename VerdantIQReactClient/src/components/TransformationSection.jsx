import React from 'react';
import AnimatedText from './AnimatedText';
import { MorphicCard } from '../context/MorphismContext';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import operationsImg from '../assets/images/clean-operations.jpg';

export default function TransformationSection() {
  return (
    <section id="platform" className="section-wrapper">
      <div className="container">
        {/* Section 05: Editorial narrative with AI Operational Image */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
          <div className="section-header reveal-up" style={{ marginBottom: 0 }}>
            <div className="section-num">
              <span>// 05</span>
              <AnimatedText text="SYSTEM PHILOSOPHY" mode="chars" staggerMs={18} />
            </div>
            <h2>
              <AnimatedText text="Not another dashboard. An interconnected ecosystem." mode="words" staggerMs={45} />
            </h2>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              <AnimatedText 
                text="Conventional ESG software offers retrospective PDF reports and disconnected charts. VerdantIQ replaces isolated software silos with a continuous decision-making fabric that links physical sensors, machine learning microservices, and human operational teams."
                mode="words"
                staggerMs={16}
              />
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-primary)' }}>&lt; 100ms</strong>
                Bi-directional Sync
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem' }}>
                <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--color-secondary-eco)' }}>Zero Silos</strong>
                Unified Operational Ledger
              </div>
            </div>
          </div>

          {/* AI Image: Clean Operations Scandinavian Control Center */}
          <MorphicCard className="reveal-right hover-lift" style={{ borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <img 
              src={operationsImg} 
              alt="VerdantIQ Real-time Control Center"
              style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'linear-gradient(to top, rgba(10,31,24,0.95), transparent)', color: '#FFFFFF', fontFamily: 'IBM Plex Mono', fontSize: '0.76rem' }}>
              <span style={{ color: '#A6D96A' }}>● LIVE CONTROL SUITE</span> &bull; Regional dispatch operator balancing peak-hour microgrid battery arbitration.
            </div>
          </MorphicCard>
        </div>

        {/* Section 06: Before vs After Transformation with Morphic Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Before Column */}
          <MorphicCard className="reveal-left hover-lift" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#B8544A', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              <XCircle size={18} />
              <span>Before VerdantIQ &bull; Fragmented Legacy</span>
            </div>

            <ul className="stagger-container is-visible" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { title: 'Isolated Telemetry Silos', desc: 'HVAC, sub-meters, and billing live in disparate incompatible portals.' },
                { title: 'Retrospective Lagging Reports', desc: 'Energy anomalies and budget blowouts discovered 30 days after occurrence.' },
                { title: 'Manual Heuristic Dispatch', desc: 'Chillers and battery storage sequenced by guesswork rather than mathematical optimization.' },
                { title: 'Unverifiable ESG Audits', desc: 'Spreadsheet-based carbon calculations vulnerable to human error and compliance penalties.' }
              ].map((item, i) => (
                <li key={i} style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '0.8rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.98rem' }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>{item.desc}</div>
                </li>
              ))}
            </ul>
          </MorphicCard>

          {/* With VerdantIQ Column */}
          <MorphicCard className="reveal-right hover-lift" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-secondary-eco)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              <CheckCircle2 size={18} />
              <span>With VerdantIQ &bull; The Connected Ecosphere</span>
            </div>

            <ul className="stagger-container is-visible" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { title: 'Unified Reactive Fabric', desc: '46 synchronized MongoDB collections connect physical IoT, billing, and models in sub-100ms.' },
                { title: 'Predictive & Prescriptive Loops', desc: '72-hour forward XGBoost predictions preempt peak utility surcharges before they trigger.' },
                { title: 'Mathematical Constraint Solvers', desc: 'SCIP MILP solvers compute optimal asset sequencing across dynamic pricing tariffs.' },
                { title: 'Cryptographic SHA-256 Chaining', desc: 'Every meter tick and dispatch instruction sealed in immutable sequential blocks.' }
              ].map((item, i) => (
                <li key={i} style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '0.8rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.98rem' }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>{item.desc}</div>
                </li>
              ))}
            </ul>
          </MorphicCard>
        </div>
      </div>
    </section>
  );
}
