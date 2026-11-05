import React, { useState } from 'react';
import { FAQS } from '../data/showcaseData';
import AnimatedText from './AnimatedText';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="section-wrapper bg-grid-pattern">
      <div className="container container-narrow">
        <div className="section-header reveal-up" style={{ textAlign: 'center', margin: '0 auto 3.5rem auto' }}>
          <div className="section-num" style={{ justifyContent: 'center' }}>
            <span>// 19</span>
            <AnimatedText text="FREQUENTLY ASKED QUESTIONS" mode="chars" staggerMs={16} />
          </div>
          <h2>
            <AnimatedText text="Everything you need to know about VerdantIQ Ecosphere." mode="words" staggerMs={45} />
          </h2>
          <p style={{ margin: '0 auto' }}>
            <AnimatedText text="Technical, operational, and architectural answers regarding the platform." mode="words" staggerMs={20} />
          </p>
        </div>

        <div className="faq-accordion reveal-up">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-item hover-lift ${isOpen ? 'open' : ''}`}>
                <button className="faq-trigger" onClick={() => toggle(idx)} aria-expanded={isOpen}>
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--color-secondary-eco)" className="icon-rotate-hover" /> : <ChevronDown size={20} color="var(--text-muted)" className="icon-rotate-hover" />}
                </button>
                {isOpen && (
                  <div className="faq-content text-blur-reveal is-visible">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
