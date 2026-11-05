import React from 'react';
import { ArrowRight, ArrowUpRight, ArrowUp } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* SECTION 20: Final Conversion Banner */}
      <section className="section-wrapper" style={{ borderBottom: 'none' }}>
        <div className="container">
          <div className="closing-cta">
            <div className="eyebrow-tag" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.2)', margin: '0 auto 1.5rem auto' }}>
              <span>JOIN THE CONNECTED FUTURE</span>
            </div>
            <h2>Build a more intelligent ecosystem.</h2>
            <p>
              Connect operations, uncover predictive machine learning intelligence, and make mathematically grounded sustainable decisions with VerdantIQ Ecosphere.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://verdantiq-client.onrender.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary" 
                style={{ background: '#FFFFFF', color: '#123D32', borderColor: '#FFFFFF' }}
              >
                <span>Launch Live Web Platform</span>
                <ArrowUpRight size={16} />
              </a>
              <a href="#downloads" className="btn-secondary" style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                <span>Download Desktop & App</span>
                <ArrowRight size={16} />
              </a>
              <a href="#architecture" className="btn-secondary" style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                <span>View Architecture</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 21: Site Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand & Purpose */}
            <div className="footer-col">
              <div className="brand-group" style={{ marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(166,217,106,0.5)', background: '#081A17', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(166,217,106,0.2)' }}>
                  <img src={logoImg} alt="VerdantIQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="brand-text">
                  <span className="brand-name">VerdantIQ</span>
                  <span className="brand-sub">ECOSPHERE</span>
                </div>
              </div>
              <p style={{ maxWidth: '340px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                One Ecosystem. Intelligent Operations. Sustainable Decisions. An integrated intelligence fabric uniting building telemetry, predictive models, and cryptographic governance.
              </p>
            </div>

            {/* Col 2: Platform Links */}
            <div className="footer-col">
              <h5>Platform</h5>
              <ul className="footer-links">
                <li><a href="#personas">Eight Personas</a></li>
                <li><a href="#intelligence">Predictive Intelligence</a></li>
                <li><a href="#morphism">Multi-Morphism Engine</a></li>
                <li><a href="#workflow">Operational Workflow</a></li>
              </ul>
            </div>

            {/* Col 3: Architecture Links */}
            <div className="footer-col">
              <h5>Architecture</h5>
              <ul className="footer-links">
                <li><a href="#architecture">System Repository Tree</a></li>
                <li><a href="#architecture">Spring Cloud Gateway</a></li>
                <li><a href="#architecture">FastAPI ML Fabric</a></li>
                <li><a href="#architecture">SHA-256 Audit Chaining</a></li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div className="footer-col">
              <h5>Resources</h5>
              <ul className="footer-links">
                <li><a href="#roadmap">Development Roadmap</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
                <li><a href="#platform">API Documentation</a></li>
                <li><a href="#platform">Compliance Whitepaper</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} VerdantIQ Ecosphere. Built with React 19 & Vite.
            </div>
            <button
              onClick={scrollToTop}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
