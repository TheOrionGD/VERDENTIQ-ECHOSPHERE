import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useLenisScroll } from './hooks/useAnimations';
import { MorphismProvider } from './context/MorphismContext';

// Media Assets
import landingVideo from './assets/landig.mp4';

// Motion Components
import CinematicPreloader from './components/CinematicPreloader';

// Core Components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PersonaShowcase from './components/PersonaShowcase';
import TransformationSection from './components/TransformationSection';
import FeatureSection from './components/FeatureSection';
import DigitalTwin from './components/DigitalTwin';
import MorphismShowcase from './components/MorphismShowcase';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import IntelligencePipeline from './components/IntelligencePipeline';
import SecuritySection from './components/SecuritySection';
import PlatformShowcase from './components/PlatformShowcase';
import DownloadSection from './components/DownloadSection';
import WorkflowSection from './components/WorkflowSection';
import TechStack from './components/TechStack';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const globalVideoRef = useRef(null);

  // Initialize Lenis smooth scroll and IntersectionObserver reveals
  useLenisScroll();
  useScrollReveal();

  useEffect(() => {
    if (globalVideoRef.current) {
      globalVideoRef.current.play().catch(e => console.log('Global video loop autoplay deferred', e));
    }
  }, []);

  return (
    <MorphismProvider>
      <div className="ecosphere-app" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Cinematic Branded Preloader with Uploaded Splash Background */}
        {!preloaderDone && (
          <CinematicPreloader onComplete={() => setPreloaderDone(true)} />
        )}

        {/* FIXED GLOBAL BACKGROUND VIDEO LOOP (Continuous for all sections) */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <video
            ref={globalVideoRef}
            src={landingVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: theme === 'dark' ? 0.22 : 0.16,
              filter: 'saturate(1.2) contrast(1.15)',
              transform: 'scale(1.02)'
            }}
          />

          {/* Global Atmospheric Theme Masking */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: theme === 'dark'
                ? 'radial-gradient(circle at 50% 50%, rgba(8, 26, 23, 0.45) 0%, rgba(8, 26, 23, 0.88) 100%)'
                : 'radial-gradient(circle at 50% 50%, rgba(247, 248, 244, 0.6) 0%, rgba(247, 248, 244, 0.92) 100%)'
            }}
          />
        </div>

        {/* SECTION 01: Announcement Bar */}
        <AnnouncementBar />

        {/* SECTION 02: Navigation */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* SECTION 03: Editorial Hero */}
        <Hero />

        {/* SECTION 04 & 07: Persona Showcase */}
        <PersonaShowcase />

        {/* SECTION 05 & 06: Transformation & System Philosophy */}
        <TransformationSection />

        {/* SECTION 08: Core Intelligence Capabilities */}
        <FeatureSection />

        {/* SECTION 09: Digital Twin Environments */}
        <DigitalTwin />

        {/* SECTION 10: Multi-Morphism Interface Engine */}
        <MorphismShowcase />

        {/* SECTION 11 & 17: System Architecture & Repository Tree */}
        <ArchitectureDiagram />

        {/* SECTION 12: AI Intelligence Pipeline */}
        <IntelligencePipeline />

        {/* SECTION 13: Security & Governance */}
        <SecuritySection />

        {/* SECTION 14: Cross-Platform Ecosystem */}
        <PlatformShowcase />

        {/* SECTION 14B: Official Downloads & Release Assets */}
        <DownloadSection />

        {/* SECTION 15: Connected Workflow */}
        <WorkflowSection />

        {/* SECTION 16: Technology Stack */}
        <TechStack />

        {/* SECTION 18: Product Development Roadmap */}
        <Roadmap />

        {/* SECTION 19: FAQ */}
        <FAQ />

        {/* SECTION 20 & 21: Final Conversion CTA & Footer */}
        <Footer />
      </div>
    </MorphismProvider>
  );
}
