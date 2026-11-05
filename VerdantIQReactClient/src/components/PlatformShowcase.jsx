import React from 'react';
import AnimatedText from './AnimatedText';
import { MorphicCard } from '../context/MorphismContext';
import { Monitor, Laptop, Smartphone, Check } from 'lucide-react';

export default function PlatformShowcase() {
  const platforms = [
    {
      name: 'Web Application',
      runtime: 'React 19 & Next.js',
      description: 'Zero-install browser portal delivering high-density operational views, interactive SCIP controls, and deep analytics across desktop viewports.',
      features: ['Full Multi-Morphism Engine', 'SVG Topology Visualizers', 'Instant Session Handoff']
    },
    {
      name: 'Electron Desktop',
      runtime: 'Electron 32 & SQLite Buffer',
      description: 'Native workstation deployment for facility control rooms and plant managers, featuring local offline sensor telemetry caching.',
      features: ['Native OS Hardware Acceleration', 'Offline Event Buffer', 'Multi-Monitor Control Grids']
    },
    {
      name: 'Android Mobile Client',
      runtime: 'Capacitor 6 & Biometrics',
      description: 'Field inspection and campus citizen app allowing maintenance engineers and students to scan equipment QR codes and log observations.',
      features: ['Biometric Credential Keystore', 'Camera QR Telemetry Sync', 'Real-Time Emergency Alerts']
    }
  ];

  return (
    <section className="section-wrapper bg-grid-pattern">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 14</span>
            <AnimatedText text="CROSS-PLATFORM ECOSYSTEM ACCESS" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="One operational core. Three purpose-built runtimes." mode="words" staggerMs={50} />
          </h2>
          <p>
            <AnimatedText 
              text="Whether monitoring facility equipment from an Android phone in the boiler room, running high-performance optimization on an Electron workstation, or auditing carbon ledgers on the Web."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        <div className="stagger-container is-visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {platforms.map((plat, idx) => (
            <MorphicCard key={idx} className="hover-lift hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="eyebrow-tag reveal-scale">{plat.runtime}</span>
                  {idx === 0 && <Monitor size={20} color="var(--color-secondary-eco)" className="icon-rotate-hover" />}
                  {idx === 1 && <Laptop size={20} color="var(--color-secondary-eco)" className="icon-rotate-hover" />}
                  {idx === 2 && <Smartphone size={20} color="var(--color-secondary-eco)" className="icon-rotate-hover" />}
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  <AnimatedText text={plat.name} mode="words" staggerMs={40} />
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {plat.description}
                </p>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {plat.features.map((f, fIdx) => (
                  <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={14} color="var(--color-secondary-eco)" />
                    <span>{f}</span>
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
