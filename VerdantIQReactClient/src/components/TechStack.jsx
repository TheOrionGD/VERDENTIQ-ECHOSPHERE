import React from 'react';
import { TECH_STACK } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { Terminal, Layers, Cpu } from 'lucide-react';

export default function TechStack() {
  return (
    <section className="section-wrapper bg-grid-pattern">
      <div className="container">
        <div className="section-header reveal-up">
          <div className="section-num">
            <span>// 16</span>
            <AnimatedText text="ENTERPRISE TECHNOLOGY STACK" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Battle-tested distributed infrastructure." mode="words" staggerMs={50} />
          </h2>
          <p>
            <AnimatedText 
              text="No experimental toys. VerdantIQ is built upon industry-grade foundations: reactive Java gateways for high-throughput concurrency, asynchronous Python for statistical learning, and sharded document stores for telemetry durability."
              mode="words"
              staggerMs={16}
            />
          </p>
        </div>

        <div className="tech-grid stagger-container is-visible">
          {TECH_STACK.map((group, idx) => (
            <div key={idx} className="tech-card hover-lift hover-glow">
              <h4>{group.category}</h4>
              <ul className="tech-list">
                {group.items.map((item, iIdx) => (
                  <li key={iIdx} className="tech-item" style={{ transition: 'color var(--motion-fast) var(--ease-editorial)' }}>
                    <span className="tech-item-name">{item.name}</span>
                    <span className="tech-item-role">{item.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
