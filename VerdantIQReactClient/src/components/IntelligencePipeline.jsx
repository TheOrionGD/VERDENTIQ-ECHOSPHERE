import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle2, Cpu, Database, Network, Sparkles } from 'lucide-react';
import AnimatedText from './AnimatedText';
import mlFabricImg from '../assets/images/ai-ml-fabric.jpg';

export default function IntelligencePipeline() {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineStages = [
    { title: '1. Ingest & Normalize', model: 'Spring Reactive & Tesseract', desc: 'Continuous sensor telemetry streams and OCR bill extractions undergo validation and timestamp alignment.' },
    { title: '2. Time-Series Forecasting', model: 'XGBoost 2.0 Regressor', desc: 'Predictive models evaluate 72h forward load curves across temperature, humidity, and historical occupancy matrices.' },
    { title: '3. Anomaly Scoring', model: 'Isolation Forest Ensembles', desc: 'Microsecond scoring flags multi-variate telemetry contamination and uncharacteristic load spikes.' },
    { title: '4. Constrained Optimization', model: 'SCIP / MILP Solver', desc: 'Mathematical solver computes optimal chiller sequencing, peak shaving, and battery charge schedules.' },
    { title: '5. Contextual Action', model: 'Gemini / Groq LLM', desc: 'Translates raw mathematical solutions into concise operational dispatches for facility managers and automated BMS.' }
  ];

  return (
    <section className="section-wrapper bg-grid-pattern">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 12</span>
            <AnimatedText text="END-TO-END AI INTELLIGENCE PIPELINE" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="From physical signal to verified mathematical dispatch." mode="words" staggerMs={45} />
          </h2>
          <p>
            <AnimatedText 
              text="Follow how high-frequency data flows through our predictive, analytical, and prescriptive pipeline to arrive at deterministic operational decisions."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        {/* Pipeline Visual Stages */}
        <div className="stagger-container is-visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="hover-lift"
              style={{
                background: activeStep === idx ? 'var(--color-primary-forest)' : 'var(--bg-card)',
                color: activeStep === idx ? '#FFFFFF' : 'var(--text-primary)',
                border: activeStep === idx ? '1px solid var(--color-primary-forest)' : '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: activeStep === idx ? 'var(--shadow-md)' : 'none'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: activeStep === idx ? 'var(--color-intelligent-lime)' : 'var(--color-secondary-eco)', fontWeight: '600', marginBottom: '0.4rem' }}>
                STAGE 0{idx + 1}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.98rem', marginBottom: '0.25rem' }}>{stage.title}</div>
              <div style={{ fontSize: '0.78rem', opacity: activeStep === idx ? 0.9 : 0.65, fontFamily: 'var(--font-mono)' }}>{stage.model}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Execution Details with AI ML Neural Fabric Visual */}
        <div className="reveal-up hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0, alignItems: 'stretch' }}>
          <div style={{ padding: '2.5rem' }}>
            <div className="eyebrow-tag" style={{ marginBottom: '0.75rem' }}>
              <span>ACTIVE STAGE: {pipelineStages[activeStep].title}</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {pipelineStages[activeStep].model}
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {pipelineStages[activeStep].desc}
            </p>

            <div style={{ background: 'var(--bg-terminal)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-terminal)' }}>
              <div style={{ color: 'var(--color-intelligent-lime)', marginBottom: '0.4rem' }}>&gt; FASTAPI ML WORKER 04 DISPATCH:</div>
              <div>Inference Latency: 16.4ms | Quantile Loss: 0.021</div>
              <div style={{ color: 'var(--text-terminal-muted)', marginTop: '4px' }}>Decision State: CONVERGED // SCIP SOLVER EXECUTING</div>
            </div>
          </div>

          {/* AI Generated Neural ML Data Fabric Image */}
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <img 
              src={mlFabricImg} 
              alt="Neural AI Machine Learning Data Fabric"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-card) 0%, transparent 20%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(8, 26, 23, 0.85)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(166, 217, 106, 0.4)', fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', color: '#A6D96A' }}>
              XGBOOST + ISOLATION FOREST ENSEMBLE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
