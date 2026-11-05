import React from 'react';
import { ROADMAP_ITEMS } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { MorphicCard } from '../context/MorphismContext';
import { Clock, CheckCircle2, CircleDashed } from 'lucide-react';

export default function Roadmap() {
  return (
    <section id="roadmap" className="section-wrapper">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 18</span>
            <AnimatedText text="PRODUCT DEVELOPMENT ROADMAP" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Architectural velocity with rigorous engineering discipline." mode="words" staggerMs={50} />
          </h2>
          <p>
            <AnimatedText 
              text="A transparent view of what is production-operational today, what our engineering team is actively building, and our upcoming structural roadmap."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        <div className="stagger-container is-visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {ROADMAP_ITEMS.map((col, idx) => (
            <MorphicCard key={idx} className="hover-lift hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  {col.phase}
                </span>
                <span className="eyebrow-tag reveal-scale" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                  {col.status}
                </span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {col.items.map((item, iIdx) => (
                  <li key={iIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, transition: 'transform var(--motion-fast) var(--ease-editorial)' }}>
                    <span style={{ color: 'var(--color-secondary-eco)', marginTop: '2px' }}>&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </MorphicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
