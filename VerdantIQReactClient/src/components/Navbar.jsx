import React, { useState } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="nav-header">
      <div className="nav-container">
        {/* Brand Group with Official Glowing Leaf Neural Logo */}
        <a href="#" className="brand-group">
          <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(166, 217, 106, 0.4)', background: '#081A17', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(166, 217, 106, 0.25)' }}>
            <img 
              src={logoImg} 
              alt="VerdantIQ Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div className="brand-text">
            <span className="brand-name">VerdantIQ</span>
            <span className="brand-sub">ECOSPHERE</span>
          </div>
        </a>

        {/* Center / Right Links */}
        <nav>
          <ul className="nav-links">
            <li><a href="#platform" className="nav-link">Platform</a></li>
            <li><a href="#personas" className="nav-link">Personas</a></li>
            <li><a href="#intelligence" className="nav-link">Intelligence</a></li>
            <li><a href="#morphism" className="nav-link">Morphism</a></li>
            <li><a href="#architecture" className="nav-link">Architecture</a></li>
            <li><a href="#workflow" className="nav-link">Workflow</a></li>
            <li><a href="#roadmap" className="nav-link">Roadmap</a></li>
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a href="#platform" className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
            <span>Explore Platform</span>
            <ArrowUpRight size={14} />
          </a>

          <button 
            className="mobile-nav-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="nav-link">Platform</a>
          <a href="#personas" onClick={() => setMobileMenuOpen(false)} className="nav-link">Personas</a>
          <a href="#intelligence" onClick={() => setMobileMenuOpen(false)} className="nav-link">Intelligence</a>
          <a href="#morphism" onClick={() => setMobileMenuOpen(false)} className="nav-link">Morphism Engine</a>
          <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="nav-link">Architecture</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="nav-link">Workflow</a>
          <a href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="nav-link">Roadmap</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="nav-link">FAQ</a>
        </div>
      )}
    </header>
  );
}
