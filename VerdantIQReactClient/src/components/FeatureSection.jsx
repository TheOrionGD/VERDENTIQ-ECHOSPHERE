import React from 'react';
import { CORE_FEATURES } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { TrendingUp, AlertTriangle, Cpu, FileText, Bot, Network, Check } from 'lucide-react';

export default function FeatureSection() {
  const renderVisual = (type) => {
    switch (type) {
      case 'forecast':
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)', fontWeight: '600' }}>XGBOOST 72H LOAD FORECAST</span>
              <span style={{ color: 'var(--text-muted)' }}>RMSE: 0.038</span>
            </div>
            {/* Visual SVG Curve */}
            <svg viewBox="0 0 400 160" width="100%" height="auto">
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#267A58" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#267A58" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="20" y1="130" x2="380" y2="130" stroke="var(--border-light)" strokeWidth="1" />
              <line x1="20" y1="80" x2="380" y2="80" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="30" x2="380" y2="30" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Shaded Area */}
              <polygon points="20,130 50,110 90,85 140,95 190,50 240,65 290,40 340,70 380,55 380,130" fill="url(#curveGrad)" />
              {/* Forecast Line */}
              <polyline points="20,110 50,110 90,85 140,95 190,50 240,65 290,40 340,70 380,55" fill="none" stroke="#267A58" strokeWidth="3" />
              {/* Actual Line */}
              <polyline points="20,112 50,108 90,89 140,92 190,54 240,60" fill="none" stroke="#A6D96A" strokeWidth="2.5" className="animated-dash-line" />
              {/* Point */}
              <circle cx="240" cy="60" r="5" fill="#A6D96A" stroke="#081A17" strokeWidth="1.5" className="pulse-active" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Historical Baseline (Green)</span>
              <span>Projected 72h Envelope (Lime)</span>
            </div>
          </div>
        );

      case 'anomaly':
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: '#E05D52', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E05D52' }}></span>
                ISOLATION FOREST CONTAMINATION
              </span>
              <span style={{ color: 'var(--text-muted)' }}>SCORE: 0.942 [CRITICAL]</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E05D52', fontWeight: '600', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} />
                <span>Simultaneous Heating & Chilling Conflict Detected</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                AHU-4 chiller bypass valve stuck open at 42% while reheat coil active. Continuous loss: $48.20/hour.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)' }}>&bull; Latency: 12ms</span>
              <span style={{ color: 'var(--text-muted)' }}>&bull; False Positive Rate &lt; 0.08%</span>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)', fontWeight: '600' }}>SCIP MILP DECISION MATRIX</span>
              <span style={{ color: 'var(--text-muted)' }}>SOLVER: 184ms CONVERGED</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '0.6rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CHILLER 01</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>RUN 85%</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '0.6rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BATTERY BESS</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-secondary-eco)' }}>DISCHARGE</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '0.6rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GRID IMPORT</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>MINIMIZED</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Constraints satisfied: Max peak demand draw capped at 450 kW. Savings: $4,280 / billing cycle.
            </p>
          </div>
        );

      case 'ocr':
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)', fontWeight: '600' }}>TESSERACT OCR NORMALIZATION</span>
              <span style={{ color: 'var(--text-muted)' }}>PDF UTILITY BILL #9928</span>
            </div>
            <div style={{ background: 'var(--bg-terminal)', padding: '1rem', borderRadius: '6px', color: 'var(--text-terminal)', fontFamily: 'var(--font-mono)', fontSize: '0.76rem' }}>
              <div style={{ color: 'var(--color-intelligent-lime)' }}>EXTRACTED & RECONCILED:</div>
              <div>Billed kWh: 48,200 kWh | Metered kWh: 48,188 kWh</div>
              <div>Peak Demand: 242 kW | Surcharge: $0.00 (Zero Violation)</div>
              <div style={{ color: 'var(--text-terminal-muted)', marginTop: '4px' }}>SHA-256 Checksum: c098a72e81... [VERIFIED]</div>
            </div>
          </div>
        );

      case 'llm':
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)', fontWeight: '600' }}>LLM CONTEXTUAL SYNTHESIS</span>
              <span style={{ color: 'var(--text-muted)' }}>GROQ / GEMINI HYBRID</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem 1rem', borderRadius: '6px', borderLeft: '3px solid var(--color-secondary-eco)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                "Building 4 thermal load is projected to rise 18% tomorrow due to the heat wave. The MILP engine has scheduled night-time pre-cooling from 03:00 to 06:00 to avoid peak utility rates."
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="feature-visual-box hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--color-secondary-eco)', fontWeight: '600' }}>OPERATIONAL STATE FABRIC</span>
              <span style={{ color: 'var(--text-muted)' }}>46 COLLECTIONS SYNCED</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['telemetry_events', 'energy_forecasts', 'audit_blocks', 'persona_policies', 'chiller_states', 'tenant_quotas'].map((col, i) => (
                <span key={i} style={{ background: 'var(--bg-elevated)', padding: '0.35rem 0.65rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {col}
                </span>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <section id="intelligence" className="section-wrapper bg-grid-pattern">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 08</span>
            <AnimatedText text="CORE INTELLIGENCE CAPABILITIES" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Editorial technical deep-dives into our analytical core." mode="words" staggerMs={45} />
          </h2>
          <p>
            <AnimatedText 
              text="VerdantIQ moves beyond retrospective reporting into high-dimensional forecasting, instantaneous anomaly isolation, and mathematical operational optimization."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        {/* Feature Rows */}
        <div className="features-list">
          {CORE_FEATURES.map((feat, idx) => (
            <div key={feat.num} className={`feature-row ${idx % 2 === 1 ? 'reverse' : ''} reveal-up`}>
              <div className="feature-text">
                <div className="feature-number">{feat.num}</div>
                <div className="eyebrow-tag" style={{ marginBottom: '0.75rem' }}>{feat.pill}</div>
                <h3>
                  <AnimatedText text={feat.title} mode="words" staggerMs={50} />
                </h3>
                <div className="feature-sub">{feat.subtitle}</div>
                <p>{feat.description}</p>
                <ul className="feature-specs-list">
                  {feat.specs.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="feature-visual">
                {renderVisual(feat.diagramType)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
