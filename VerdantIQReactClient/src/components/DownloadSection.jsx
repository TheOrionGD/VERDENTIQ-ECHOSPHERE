import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Monitor, 
  Smartphone, 
  FileCode, 
  FolderArchive,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

const RELEASE_URL = 'https://github.com/TheOrionGD/VERDENTIQ-ECHOSPHERE/releases/tag/v1.0.6';
const ASSET_BASE = 'https://github.com/TheOrionGD/VERDENTIQ-ECHOSPHERE/releases/download/v1.0.6';

const ASSETS = [
  {
    id: 'setup-exe',
    title: 'Windows Installer (Setup)',
    fileName: 'VerdantIQ.Setup.1.0.6.exe',
    url: `${ASSET_BASE}/VerdantIQ.Setup.1.0.6.exe`,
    size: '215 MB',
    type: 'Windows Executable (.exe)',
    icon: Monitor,
    badge: 'Recommended',
    badgeColor: 'rgba(166, 217, 106, 0.25)',
    desc: 'Full NSIS installer with code-signed uninstaller, desktop shortcut, and auto-update support.',
  },
  {
    id: 'portable-exe',
    title: 'Windows Portable',
    fileName: 'VerdantIQ.1.0.6.exe',
    url: `${ASSET_BASE}/VerdantIQ.1.0.6.exe`,
    size: '214 MB',
    type: 'Portable Binary (.exe)',
    icon: FileCode,
    badge: 'Zero Install',
    badgeColor: 'rgba(56, 189, 248, 0.25)',
    desc: 'Runs immediately without installation or admin elevation. Ideal for USB drives and workstations.',
  },
  {
    id: 'win-zip',
    title: 'Windows Standalone Archive',
    fileName: 'VerdantIQ-1.0.6-win.zip',
    url: `${ASSET_BASE}/VerdantIQ-1.0.6-win.zip`,
    size: '295 MB',
    type: 'Zip Archive (.zip)',
    icon: FolderArchive,
    badge: 'Portable Zip',
    badgeColor: 'rgba(251, 191, 36, 0.25)',
    desc: 'Full unpacked Windows binary distribution with isolated runtime and resource trees.',
  },
  {
    id: 'android-apk',
    title: 'Android Mobile Application',
    fileName: 'VerdantIQ-1.0.6-android-release-signed.apk',
    url: `${ASSET_BASE}/VerdantIQ-1.0.6-android-release-signed.apk`,
    size: '13.8 MB',
    type: 'Android Package (.apk)',
    icon: Smartphone,
    badge: 'Mobile APK',
    badgeColor: 'rgba(192, 132, 252, 0.25)',
    desc: 'Capacitor Android application signed with production keystore. Compatible with Android 10+.',
  },
];

export default function DownloadSection() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="downloads" className="section-wrapper" style={{ scrollMarginTop: '80px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <div className="eyebrow-tag" style={{ margin: '0 auto 1.25rem auto' }}>
            <Download size={14} />
            <span>OFFICIAL RELEASES • v1.0.6</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Download VerdantIQ Ecosphere
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.82, lineHeight: 1.65 }}>
            Production-ready executables for Windows and Android mobile devices. Every binary is digitally signed with our Authenticode signature to ensure authenticity, integrity, and security.
          </p>
        </div>

        {/* Release Metadata Banner */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.25rem 1.75rem',
            background: 'var(--surface-color, rgba(18, 61, 50, 0.55))',
            border: '1px solid var(--border-color, rgba(166, 217, 106, 0.2))',
            borderRadius: '16px',
            marginBottom: '2.5rem',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(166, 217, 106, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A6D96A' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Release v1.0.6</span>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(166, 217, 106, 0.2)', color: '#A6D96A', fontWeight: 600 }}>
                  LATEST STABLE
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', opacity: 0.75 }}>
                Authenticode Code-Signed • Verified Publisher: VerdantIQ
              </span>
            </div>
          </div>

          <a 
            href={RELEASE_URL}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.88rem', padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>View Release on GitHub</span>
            <ExternalLink size={15} />
          </a>
        </div>

        {/* Assets Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {ASSETS.map((asset) => {
            const Icon = asset.icon;
            const isCopied = copiedId === asset.id;

            return (
              <div
                key={asset.id}
                className="card-base"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                  borderRadius: '18px',
                  background: 'var(--surface-color, rgba(14, 43, 36, 0.65))',
                  border: '1px solid var(--border-color, rgba(166, 217, 106, 0.15))',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div 
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(166, 217, 106, 0.12)',
                        border: '1px solid rgba(166, 217, 106, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#A6D96A'
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span 
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        background: asset.badgeColor,
                        letterSpacing: '0.02em'
                      }}
                    >
                      {asset.badge}
                    </span>
                  </div>

                  {/* Title & Details */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {asset.title}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', opacity: 0.75, marginBottom: '0.85rem' }}>
                    <span>{asset.type}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: '#A6D96A' }}>{asset.size}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', opacity: 0.8, lineHeight: 1.55, marginBottom: '1.5rem' }}>
                    {asset.desc}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div>
                  <div 
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      opacity: 0.85
                    }}
                    title={asset.fileName}
                  >
                    {asset.fileName}
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <a
                      href={asset.url}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '0.65rem 1rem',
                        fontSize: '0.88rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </a>

                    <button
                      onClick={() => handleCopyLink(asset.url, asset.id)}
                      className="btn-secondary"
                      aria-label="Copy direct download link"
                      title="Copy download link"
                      style={{
                        padding: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {isCopied ? <Check size={16} color="#A6D96A" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Verification Assurance note */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            background: 'rgba(166, 217, 106, 0.05)',
            border: '1px solid rgba(166, 217, 106, 0.15)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}
        >
          <CheckCircle2 size={20} color="#A6D96A" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.9 }}>
            <strong>Authenticode Code-Signed & Verified:</strong> The Windows binaries and uninstaller embed Authenticode digital signatures matching publisher <code>VerdantIQ</code>. If Windows SmartScreen displays a verification dialog on fresh downloads, select <strong>More Info &rarr; Run Anyway</strong> to proceed.
          </div>
        </div>
      </div>
    </section>
  );
}
