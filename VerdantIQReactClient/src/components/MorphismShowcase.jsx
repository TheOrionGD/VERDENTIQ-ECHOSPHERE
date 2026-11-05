import React from 'react';
import { useMorphism } from '../context/MorphismContext';
import AnimatedText from './AnimatedText';
import { Sparkles, Palette, CheckCircle2, Sliders } from 'lucide-react';

export default function MorphismShowcase() {
  const { activeMorphism, setActiveMorphism, MORPHISM_STYLES } = useMorphism();

  return (
    <section id="morphism" className="section-wrapper bg-grid-pattern">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 10</span>
            <AnimatedText text="MULTI-MORPHISM INTERFACE ENGINE" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Eight design languages. One unified operational core." mode="words" staggerMs={45} />
          </h2>
          <p>
            <AnimatedText 
              text="VerdantIQ incorporates a Windows 11-inspired Multi-Morphism engine. Switch dynamically between eight distinct design philosophies—from deep Obsidian Glass to high-contrast Neubrutalism—without altering underlying application data or state. Selecting any style below updates cards across the entire website."
              mode="words"
              staggerMs={15}
            />
          </p>
        </div>

        {/* Morphism Style Selector Tabs */}
        <div className="morphism-tabs reveal-scale">
          {MORPHISM_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveMorphism(style)}
              className={`morphism-tab-btn btn-motion ${activeMorphism.id === style.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '0.7rem', opacity: 0.65, display: 'block' }}>{style.tag}</span>
              {style.name}
            </button>
          ))}
        </div>

        {/* Live Interactive Preview Stage */}
        <div className="morphism-preview-stage reveal-up hover-lift">
          {/* Left: Style Specification Description */}
          <div>
            <div className="eyebrow-tag reveal-scale" style={{ marginBottom: '1rem' }}>
              <Palette size={13} />
              <span>ACTIVE ENGINE: {activeMorphism.tag}</span>
            </div>
            <h3 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              {activeMorphism.name}
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              {activeMorphism.desc}
            </p>

            <div style={{ background: 'var(--bg-card)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--color-secondary-eco)', fontWeight: '600', marginBottom: '0.25rem' }}>GLOBAL ENGINE BROADCAST:</div>
              <div style={{ color: 'var(--text-secondary)' }}>All cards across Hero, Personas, Features, Architecture, and Roadmap are actively morphing to {activeMorphism.name}.</div>
            </div>
          </div>

          {/* Right: Live Morphic Widget with Float Ambient Animation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="float-ambient"
              style={{
                ...activeMorphism.cardStyle,
                width: '100%',
                maxWidth: '420px',
                padding: '2rem',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  FACILITY_04 // ZONE_B
                </span>
                <span style={{ fontSize: '0.72rem', color: '#84C043', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#84C043' }}></span>
                  ONLINE
                </span>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                HVAC Multi-Stage Chiller
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                Automated thermal equilibrium active
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed rgba(128,128,128,0.3)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>COP RATIO</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>6.42</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>DRAW (KW)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>412 kW</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>DELTA</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#84C043' }}>-14%</div>
                </div>
              </div>

              <button
                className="btn-motion"
                style={{
                  ...activeMorphism.buttonStyle,
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Sliders size={16} className="btn-icon" />
                <span>Execute SCIP Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
