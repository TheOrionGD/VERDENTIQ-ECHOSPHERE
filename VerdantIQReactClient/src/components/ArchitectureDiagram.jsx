import React, { useState } from 'react';
import { ARCHITECTURE_TREE } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { ChevronRight, ChevronDown, Folder, Server, Database, Shield, Cpu, Code } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [openNodes, setOpenNodes] = useState({ 0: true, 1: true, 2: true, 3: true, 4: true });

  const toggleNode = (idx) => {
    setOpenNodes(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <section id="architecture" className="section-wrapper">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 11</span>
            <AnimatedText text="SYSTEM ARCHITECTURE & REPOSITORY FABRIC" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Engineered for cryptographic verifiability & multi-tiered scale." mode="words" staggerMs={45} />
          </h2>
          <p>
            <AnimatedText 
              text="Modeled after the repository and architectural tree structures of modern engineering platforms, VerdantIQ isolates high-throughput reactive Java gateways, asynchronous Python ML engines, and resilient persistence boundaries."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        {/* Technical Architecture Tree / Repository Representation */}
        <div className="arch-tree-container reveal-scale hover-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Code size={18} color="#A6D96A" />
              <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.92rem' }}>verdantiq-ecosphere / system-tree</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-terminal-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A6D96A' }}></span>
              BRANCH: main (PRODUCTION TAG v2.4.0)
            </span>
          </div>

          <div>
            {ARCHITECTURE_TREE.map((layer, idx) => (
              <div key={idx} className="arch-node">
                <div className="arch-node-header" onClick={() => toggleNode(idx)}>
                  <div className="arch-node-title">
                    {openNodes[idx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Folder size={16} />
                    <span>{layer.name}</span>
                  </div>
                  <span className="arch-node-details">{layer.details}</span>
                </div>

                {openNodes[idx] && (
                  <div className="arch-children">
                    {layer.children.map((child, cIdx) => (
                      <div key={cIdx} className="arch-leaf">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--color-intelligent-lime)', opacity: 0.7 }}>├─</span>
                          <span className="arch-leaf-name">{child.name}</span>
                        </div>
                        <span className="arch-leaf-desc">{child.details}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-terminal-muted)' }}>
            <span>&bull; Complete strict tenant partition enforcement</span>
            <span>&bull; Zero-leakage cryptographic boundaries</span>
            <span>&bull; Non-blocking reactive I/O throughput</span>
          </div>
        </div>
      </div>
    </section>
  );
}
