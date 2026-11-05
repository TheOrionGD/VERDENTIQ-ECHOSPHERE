import React from 'react';
import AnimatedText from './AnimatedText';
import { MorphicCard } from '../context/MorphismContext';
import { ShieldCheck, Lock, Key, FileCheck, CheckCircle2 } from 'lucide-react';
import govImg from '../assets/images/governance-security.jpg';

export default function SecuritySection() {
  const securityPillars = [
    {
      title: 'Cryptographic SHA-256 Audit Chaining',
      desc: 'Each telemetry ingestion event, threshold override, and dispatch record is hashed sequentially into an immutable block chain. Tampering with any historical meter datum invalidates downstream hashes immediately.'
    },
    {
      title: 'Multi-Tiered RBAC & Tenant Isolation',
      desc: 'Strict logical partition boundaries separate distinct institutions and municipal regions. Roles are bound by fine-grained security policies enforced at the Spring Gateway layer.'
    },
    {
      title: 'Statutory ISO 14064 Compliance',
      desc: 'All carbon accounting logic conforms to internationally recognized Scope 1, 2, and 3 emissions standards, providing certified export ledgers ready for formal governmental auditing.'
    },
    {
      title: 'Zero-Leakage Telemetry Pipelines',
      desc: 'Local edge caching buffers sensitive residential and departmental telemetry, ensuring aggregated privacy without forfeiting macro-grid analytical accuracy.'
    }
  ];

  return (
    <section className="section-wrapper">
      <div className="container">
        {/* Editorial Header & Cryptographic Data Center Visual */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div className="section-header reveal-up" style={{ marginBottom: 0 }}>
            <div className="section-num">
              <span>// 13</span>
              <AnimatedText text="SECURITY, IMMUTABILITY & GOVERNANCE" mode="chars" staggerMs={16} />
            </div>
            <h2>
              <AnimatedText text="Enterprise governance built on mathematical verifiability." mode="words" staggerMs={45} />
            </h2>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
              <AnimatedText 
                text="When sustainability data influences legal reporting, carbon credit settlement, and municipal grid operations, trust must be mathematical rather than promissory."
                mode="words"
                staggerMs={16}
              />
            </p>
          </div>

          {/* AI Photorealistic Cryptographic Vault & Server Fabric Image */}
          <MorphicCard className="reveal-right hover-lift" style={{ borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
            <img 
              src={govImg} 
              alt="Cryptographic SHA-256 Datacenter Vault"
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'linear-gradient(to top, rgba(7, 21, 18, 0.95), transparent)', color: '#FFFFFF', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem' }}>
              <span style={{ color: '#A6D96A' }}>● HARDWARE-SECURED ENCLAVE</span> &bull; SHA-256 sequential block hashing ensuring tamper-proof audit trails.
            </div>
          </MorphicCard>
        </div>

        {/* Security Pillars Cards with Morphic Engine */}
        <div className="stagger-container is-visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {securityPillars.map((pillar, idx) => (
            <MorphicCard key={idx} className="hover-lift" style={{ padding: '1.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--tag-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary-eco)', marginBottom: '1.25rem' }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                {pillar.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {pillar.desc}
              </p>
            </MorphicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
