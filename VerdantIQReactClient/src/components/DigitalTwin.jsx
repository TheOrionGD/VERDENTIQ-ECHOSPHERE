import React from 'react';
import AnimatedText from './AnimatedText';
import { MorphicCard } from '../context/MorphismContext';
import { Box, Layers, Globe, Building2, Home, Users } from 'lucide-react';
import twinImg from '../assets/images/digital-twin-city.jpg';

export default function DigitalTwin() {
  const environments = [
    { title: 'Regional Microgrid Twin', scope: 'Multi-jurisdictional peak-shaving, inter-tie balancing, and macro wind/solar curtailment avoidance.' },
    { title: 'Campus Facility Twin', scope: 'Building HVAC air handlers, chilled water loops, solar carports, and occupancy thermal buffers.' },
    { title: 'Department Lab Twin', scope: 'Sub-metered cleanroom ventilation, fume hood energy telemetry, and precision equipment idle curves.' },
    { title: 'Living Lab Student Twin', scope: 'Residence hall gamification, peer floor competition, and real-time cafeteria footprint meters.' },
    { title: 'Household Smart Twin', scope: 'Rooftop PV inverters, home BESS battery arbitrage, and dynamic TOU schedule optimization.' }
  ];

  return (
    <section className="section-wrapper">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 09</span>
            <AnimatedText text="DIGITAL TWIN TOPOLOGY" mode="chars" staggerMs={18} />
          </div>
          <h2>
            <AnimatedText text="Virtual representation of physical operational realities." mode="words" staggerMs={50} />
          </h2>
          <p>
            <AnimatedText 
              text="VerdantIQ models physical thermodynamic and electrical characteristics as software twins. Telemetry from the physical world streams into dynamic representations, enabling predictive simulations without disrupting physical operations."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          {/* AI Photorealistic Digital Twin Isometric Render with Morphic Wrapper */}
          <MorphicCard className="reveal-left hover-lift" style={{ borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <img 
              src={twinImg} 
              alt="VerdantIQ Digital Twin 3D Isometric Topology"
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
            />
            {/* Ambient Overlay Tag */}
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', background: 'rgba(8, 26, 23, 0.88)', backdropFilter: 'blur(8px)', padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(166, 217, 106, 0.4)', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', color: '#A6D96A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A6D96A' }}></span>
              DIGITAL TWIN &bull; LIVE SENSOR OVERLAY
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', background: 'linear-gradient(to top, rgba(7, 21, 18, 0.95), transparent)', color: '#FFFFFF', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem' }}>
              <div style={{ color: '#A6D96A', marginBottom: '2px' }}>SUB-100MS BI-DIRECTIONAL MQTT / BACNET</div>
              <div>4,200 active telemetry streams mapping thermal buffers, chiller loops & rooftop solar.</div>
            </div>
          </MorphicCard>

          {/* Twin Environment Capabilities with Morphic Cards */}
          <div className="stagger-container is-visible" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {environments.map((env, i) => (
              <MorphicCard key={i} className="hover-lift" style={{ padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <AnimatedText text={env.title} mode="words" staggerMs={35} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {env.scope}
                </div>
              </MorphicCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
