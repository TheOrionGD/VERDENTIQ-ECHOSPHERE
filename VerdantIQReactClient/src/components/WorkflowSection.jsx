import React from 'react';
import { WORKFLOW_STEPS } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { ArrowDown, CheckCircle } from 'lucide-react';

export default function WorkflowSection() {
  return (
    <section id="workflow" className="section-wrapper">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 15</span>
            <AnimatedText text="CONNECTED OPERATIONAL WORKFLOW" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Seven systematic steps from physical telemetry to audit closure." mode="words" staggerMs={50} />
          </h2>
          <p>
            <AnimatedText 
              text="An unbending sequence ensures that raw signals are verified, forecasted, checked for anomalous conditions, mathematically optimized, and sealed cryptographically."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        <div className="stagger-container is-visible" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="hover-lift"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1.5rem 2rem',
                display: 'grid',
                gridTemplateColumns: '70px 1.5fr 3fr',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-secondary-eco)', opacity: 0.65 }}>
                {step.num}
              </div>

              <div>
                <span className="eyebrow-tag reveal-scale" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', marginBottom: '0.35rem' }}>{step.badge}</span>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  <AnimatedText text={step.title} mode="words" staggerMs={40} />
                </h4>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{step.step}</div>
              </div>

              <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
