import React, { useState } from 'react';
import { AuthProvider } from './lib/authContext';
import { useAuth } from './lib/useAuth';
import { SplashScreen } from './components/auth/SplashScreen';
import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { WindowsTaskbar } from './components/shell/WindowsTaskbar';
import { WindowsStartMenu } from './components/shell/WindowsStartMenu';
import { WindowsWindow } from './components/shell/WindowsWindow';
import { WindowsActionCenter } from './components/shell/WindowsActionCenter';

// 8 Role Dashboards
import { InstitutionDashboard } from './components/roles/InstitutionDashboard';
import { AdminDashboard } from './components/roles/AdminDashboard';
import { MlopsDashboard } from './components/roles/MlopsDashboard';
import { AuditDashboard } from './components/roles/AuditDashboard';
import { RegionDashboard } from './components/roles/RegionDashboard';
import { DeptDashboard } from './components/roles/DeptDashboard';
import { StudentDashboard } from './components/roles/StudentDashboard';
import { UserDashboard } from './components/roles/UserDashboard';

// Role Icons
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  MapPin, 
  Layers, 
  GraduationCap, 
  Home 
} from 'lucide-react';

const ROLE_ICONS = {
  admin: ShieldCheck,
  mlops: Cpu,
  audit: FileCheck,
  region: MapPin,
  institution: Building2,
  dept: Layers,
  student: GraduationCap,
  user: Home,
};

import { TenantRequestPage } from './components/auth/TenantRequestPage';
import { TenantStatusPage } from './components/auth/TenantStatusPage';
import { BackgroundVideo } from './components/common/BackgroundVideo';
import { HelpCenterScreen } from './components/screens/HelpCenterScreen';
import { DocumentationScreen } from './components/screens/DocumentationScreen';
import { ApiReferenceScreen } from './components/screens/ApiReferenceScreen';
import { SecurityOverviewScreen } from './components/screens/SecurityOverviewScreen';

function MainApplicationContent() {
  const { currentRole, roleMeta, switchRole, isDarkMode } = useAuth();
  
  // App navigation state: 'landing' -> 'login' -> 'workspace' | 'tenant-request' | 'tenant-status' | 'help' | 'documentation' | 'api-reference' | 'security'
  const [appState, setAppState] = useState('landing');
  const [tenantStatusRef, setTenantStatusRef] = useState('');
  const [securityInitialTab, setSecurityInitialTab] = useState('db-claims');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);

  // 2. Landing Page
  if (appState === 'landing') {
    return (
      <div key="landing" className="liquid-screen-transition w-full h-full">
        <LandingPage
          onEnterLogin={() => setAppState('login')}
          onDirectRoleSelect={(roleKey) => {
            switchRole(roleKey);
            setAppState('workspace');
          }}
          onOpenTenantRequest={() => setAppState('tenant-request')}
          onOpenTenantStatus={(refId) => {
            setTenantStatusRef(refId || '');
            setAppState('tenant-status');
          }}
          onNavigateScreen={(screenName, extra) => {
            if (screenName === 'security') {
              setSecurityInitialTab(extra || 'db-claims');
              setAppState('security');
            } else {
              setAppState(screenName);
            }
          }}
        />
      </div>
    );
  }

  // Help Center Screen
  if (appState === 'help') {
    return (
      <div key="help" className="liquid-screen-transition w-full h-full">
        <HelpCenterScreen
          onBack={() => setAppState('landing')}
          onNavigateScreen={(screenName) => setAppState(screenName)}
        />
      </div>
    );
  }

  // Technical Documentation Screen
  if (appState === 'documentation') {
    return (
      <div key="documentation" className="liquid-screen-transition w-full h-full">
        <DocumentationScreen
          onBack={() => setAppState('landing')}
          onNavigateScreen={(targetRole) => {
            if (targetRole === 'api-reference') {
              setAppState('api-reference');
            } else if (ROLE_ICONS[targetRole]) {
              switchRole(targetRole);
              setAppState('workspace');
            } else {
              setAppState('landing');
            }
          }}
        />
      </div>
    );
  }

  // REST API Reference Screen
  if (appState === 'api-reference') {
    return (
      <div key="api-reference" className="liquid-screen-transition w-full h-full">
        <ApiReferenceScreen
          onBack={() => setAppState('landing')}
        />
      </div>
    );
  }

  // Security & Encryption Standards Screen
  if (appState === 'security') {
    return (
      <div key="security" className="liquid-screen-transition w-full h-full">
        <SecurityOverviewScreen
          initialTab={securityInitialTab}
          onBack={() => setAppState('landing')}
        />
      </div>
    );
  }

  // Tenant Request Page (Campus & District Provisioning)
  if (appState === 'tenant-request') {
    return (
      <div key="tenant-request" className="liquid-screen-transition w-full h-full">
        <TenantRequestPage
          onBackToLanding={() => setAppState('landing')}
          onGoToStatus={(refId) => {
            setTenantStatusRef(refId);
            setAppState('tenant-status');
          }}
        />
      </div>
    );
  }

  // Tenant Status Page (Application Tracker)
  if (appState === 'tenant-status') {
    return (
      <div key="tenant-status" className="liquid-screen-transition w-full h-full">
        <TenantStatusPage
          initialRef={tenantStatusRef}
          onBackToLanding={() => setAppState('landing')}
          onNewApplication={() => setAppState('tenant-request')}
        />
      </div>
    );
  }

  // 3. Login Page
  if (appState === 'login') {
    return (
      <div key="login" className="liquid-screen-transition w-full h-full">
        <LoginPage
          onBackToLanding={() => setAppState('landing')}
          onLoginSuccess={() => setAppState('workspace')}
        />
      </div>
    );
  }

  // 4. Role-Separated Windows 11 Desktop Workspace
  const CurrentIcon = ROLE_ICONS[currentRole] || Building2;

  const renderActiveDashboard = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'mlops':
        return <MlopsDashboard />;
      case 'audit':
        return <AuditDashboard />;
      case 'region':
        return <RegionDashboard />;
      case 'dept':
        return <DeptDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'user':
        return <UserDashboard />;
      case 'institution':
      default:
        return <InstitutionDashboard />;
    }
  };

  return (
    <div 
      className={`liquid-screen-transition relative w-screen h-screen overflow-hidden ${isDarkMode ? 'dark' : 'light'} select-none flex flex-col transition-colors duration-300`}
      onClick={() => {
        if (isStartOpen) setIsStartOpen(false);
        if (isActionCenterOpen) setIsActionCenterOpen(false);
      }}
    >
      {/* Video Background for Windows Workspace */}
      <BackgroundVideo 
        overlayClassName={
          isDarkMode 
            ? 'bg-gradient-to-b from-neutral-950/60 via-neutral-950/70 to-neutral-950/80 backdrop-blur-[1px]'
            : 'bg-gradient-to-b from-sky-950/40 via-slate-900/40 to-slate-950/60 backdrop-blur-[1px]'
        }
      />
      {/* Top Banner allowing quick return to Landing / Sign Out */}
      <div className="absolute top-2 right-4 z-40 flex items-center space-x-2 text-xs">
        <button
          onClick={() => setAppState('landing')}
          className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          Landing Page
        </button>
        <button
          onClick={() => setAppState('login')}
          className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          Switch User / Sign Out
        </button>
      </div>

      {/* Active Role Window Frame */}
      <div className="flex-1 min-h-0 w-full overflow-hidden pb-12 pt-1 px-2" onClick={(e) => e.stopPropagation()}>
        <WindowsWindow
          title={`VerdantIQ Ecosphere — ${roleMeta.label}`}
          icon={CurrentIcon}
          roleBadge={`Tier ${roleMeta.hierarchyLevel}: ${roleMeta.id}`}
          onClose={() => setAppState('login')}
        >
          {renderActiveDashboard()}
        </WindowsWindow>
      </div>

      {/* Windows 11 Start Menu Flyout */}
      <div onClick={(e) => e.stopPropagation()}>
        <WindowsStartMenu
          isOpen={isStartOpen}
          onClose={() => setIsStartOpen(false)}
        />
      </div>

      {/* Windows 11 Action Center Flyout */}
      <div onClick={(e) => e.stopPropagation()}>
        <WindowsActionCenter
          isOpen={isActionCenterOpen}
          onClose={() => setIsActionCenterOpen(false)}
        />
      </div>

      {/* Windows 11 Centered Taskbar */}
      <div onClick={(e) => e.stopPropagation()}>
        <WindowsTaskbar
          isStartOpen={isStartOpen}
          onToggleStartMenu={() => {
            setIsStartOpen(!isStartOpen);
            setIsActionCenterOpen(false);
          }}
          onToggleActionCenter={() => {
            setIsActionCenterOpen(!isActionCenterOpen);
            setIsStartOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApplicationContent />
    </AuthProvider>
  );
}
