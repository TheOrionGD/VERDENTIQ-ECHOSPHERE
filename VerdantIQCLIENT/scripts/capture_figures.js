const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OUT_DIR = 'o:/PROJECTS/Ecosphere/figures';
const BASE_URL = 'http://localhost:3000';

function getSystemMetrics() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  const cpuLoad = totalTick > 0 ? ((1 - totalIdle / totalTick) * 100) : 12.5;
  const totalMemMb = Math.round(os.totalmem() / (1024 * 1024));
  const freeMemMb = Math.round(os.freemem() / (1024 * 1024));
  const usedMemMb = totalMemMb - freeMemMb;
  return {
    cpu_usage: Math.round(cpuLoad * 10) / 10,
    total_memory_mb: totalMemMb,
    used_memory_mb: usedMemMb,
    free_memory_mb: freeMemMb,
    memory_percentage: Math.round((usedMemMb / totalMemMb) * 100 * 10) / 10,
    os_name: `${os.type()} ${os.release()}`,
    os_version: os.release(),
    host_name: os.hostname(),
  };
}

function registerIpcHandlers(win) {
  ipcMain.handle('window-minimize', () => { if (win) win.minimize(); return true; });
  ipcMain.handle('window-maximize', () => {
    if (!win) return false;
    if (win.isMaximized()) { win.unmaximize(); return false; }
    win.maximize(); return true;
  });
  ipcMain.handle('window-is-maximized', () => win ? win.isMaximized() : false);
  ipcMain.handle('window-close', () => { if (win) win.close(); return true; });
  ipcMain.handle('get-system-metrics', async () => getSystemMetrics());
  ipcMain.handle('send-notification', async (_event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title: title || 'VerdantIQ Desktop', body: body || '' }).show();
      return true;
    }
    return false;
  });
  ipcMain.handle('launch-service-stack', async () => 'Mock launch');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ROLES = {
  admin: {
    id: 'usr-01',
    role: 'admin',
    email: 'admin@verdantiq.io',
    name: 'Alexander Vance',
    tenantId: 'tenant_verdantiq_core',
    institution: 'VerdantIQ Core System',
    createdAt: new Date().toISOString()
  },
  region: {
    id: 'usr-02',
    role: 'region',
    email: 'region@tn.gov.in',
    name: 'Dr. K. Senthil Nathan',
    tenantId: 'tenant_tn_district_board',
    institution: 'State District Board 1',
    createdAt: new Date().toISOString()
  },
  institution: {
    id: 'usr-03',
    role: 'institution',
    email: 'admin@institution.org',
    name: 'Dr. Eleanor Vance',
    tenantId: 'tenant_institution_org',
    institution: 'Pacific State University System',
    createdAt: new Date().toISOString()
  },
  dept: {
    id: 'usr-04',
    role: 'dept',
    email: 'dept@institution.org',
    name: 'Prof. Marcus Sterling',
    tenantId: 'tenant_institution_org',
    institution: 'Pacific State University',
    department: 'Facility Science & CS Labs',
    createdAt: new Date().toISOString()
  },
  audit: {
    id: 'usr-05',
    role: 'audit',
    email: 'auditor@esg-verify.org',
    name: 'Elena Rostova',
    tenantId: 'tenant_institution_org',
    institution: 'External ESG Verification Directorate',
    createdAt: new Date().toISOString()
  },
  mlops: {
    id: 'usr-06',
    role: 'mlops',
    email: 'mlops@verdantiq.io',
    name: 'Tariq Al-Mansoor',
    tenantId: 'tenant_verdantiq_core',
    institution: 'Applied AI & ML Systems',
    createdAt: new Date().toISOString()
  },
  student: {
    id: 'usr-07',
    role: 'student',
    email: 'student@institution.org',
    name: 'Maya Lin',
    tenantId: 'tenant_institution_org',
    institution: 'Pacific State University',
    createdAt: new Date().toISOString()
  },
  user: {
    id: 'usr-08',
    role: 'user',
    email: 'user@verdantiq.org',
    name: 'David & Sarah Chen',
    tenantId: 'tenant_res_user',
    institution: 'Eco-Residence hh-101',
    createdAt: new Date().toISOString()
  }
};

app.whenReady().then(async () => {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    show: false,
    frame: false,
    backgroundColor: '#0a0f1d',
    webPreferences: {
      preload: path.join(__dirname, '..', 'electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    }
  });

  registerIpcHandlers(win);

  const setAuth = async (userObj) => {
    if (!userObj) {
      await win.webContents.executeJavaScript(`
        (() => {
          localStorage.removeItem('verdantiq_token');
          localStorage.removeItem('verdantiq_user');
          document.cookie = 'verdantiq_session=; path=/; max-age=0;';
        })()
      `);
      return;
    }
    const token = 'mock_jwt_token_2026';
    await win.webContents.executeJavaScript(`
      (() => {
        const u = ${JSON.stringify(userObj)};
        const t = '${token}';
        localStorage.setItem('verdantiq_token', t);
        localStorage.setItem('verdantiq_user', JSON.stringify(u));
        const sessionData = encodeURIComponent(JSON.stringify({
          token: t,
          role: u.role,
          email: u.email,
          userId: u.id
        }));
        document.cookie = 'verdantiq_session=' + sessionData + '; path=/; max-age=604800; SameSite=Lax;';
      })()
    `);
  };

  const capture = async (url, userObj, captionName, shortName, action) => {
    console.log(`\n==================================================`);
    console.log(`[CAPTURING] ${captionName} (${shortName})...`);
    console.log(`Target URL: ${url} | Role: ${userObj ? userObj.role : 'unauthenticated'}`);

    // Load initial page or blank to set storage
    await win.loadURL(url);
    await sleep(1500);

    if (userObj) {
      await setAuth(userObj);
      await win.loadURL(url);
    } else {
      await setAuth(null);
      await win.loadURL(url);
    }

    await sleep(4000);

    if (action) {
      try {
        await win.webContents.executeJavaScript(`(${action.toString()})()`);
        await sleep(2000);
      } catch (err) {
        console.warn(`Action failed for ${captionName}:`, err.message);
      }
    }

    // Capture Native Image
    const img = await win.webContents.capturePage();
    const pngBuffer = img.toPNG();

    const fullCaptionPath = path.join(OUT_DIR, `${captionName}.png`);
    const shortPath = path.join(OUT_DIR, `${shortName}.png`);

    fs.writeFileSync(fullCaptionPath, pngBuffer);
    fs.writeFileSync(shortPath, pngBuffer);

    console.log(`✓ Saved: ${fullCaptionPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`✓ Saved alias: ${shortPath}`);
  };

  try {
    // Warm up Next.js router
    console.log('Connecting to Next.js client on port 3000...');
    await win.loadURL(`${BASE_URL}/landing`);
    await sleep(3000);

    // -------------------------------------------------------------
    // B.1 Login Page
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/login`,
      null,
      'B.1 Login Page',
      'B.1',
      () => {
        // Highlight database ready status badge
        const badge = document.querySelector('.bg-emerald-950\\/60');
        if (badge) badge.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
      }
    );

    // -------------------------------------------------------------
    // B.2 Spatial Canvas Home
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/institution/geofence`,
      ROLES.institution,
      'B.2 Spatial Canvas Home',
      'B.2',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // Also save landing version of spatial canvas home
    await capture(
      `${BASE_URL}/landing`,
      null,
      'B.2 Spatial Canvas Home - Landing',
      'B.2_landing',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.3 Institution Executive Dashboard
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/institution/dashboard`,
      ROLES.institution,
      'B.3 Institution Executive Dashboard',
      'B.3',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.4 Department Verification Queue
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/dept/verify`,
      ROLES.dept,
      'B.4 Department Verification Queue',
      'B.4',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.5 Auditor Redacted Ledger
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/audit/logs`,
      ROLES.audit,
      'B.5 Auditor Redacted Ledger',
      'B.5',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.6 MLOps Model Registry and Pareto Curve
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/mlops/optimizer`,
      ROLES.mlops,
      'B.6 MLOps Model Registry and Pareto Curve',
      'B.6',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // Also capture Model Registry
    await capture(
      `${BASE_URL}/mlops/models`,
      ROLES.mlops,
      'B.6 MLOps Model Registry View',
      'B.6_models',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.7 Student Digital Twin Dashboard
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/student/dashboard`,
      ROLES.student,
      'B.7 Student Digital Twin Dashboard',
      'B.7',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // Also capture digital twin simulation
    await capture(
      `${BASE_URL}/student/digital-twin`,
      ROLES.student,
      'B.7 Student Digital Twin Configurator',
      'B.7_twin',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.8 Household Dashboard
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/user/dashboard`,
      ROLES.user,
      'B.8 Household Dashboard',
      'B.8',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.9 Admin and Regional Dashboards
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/region/dashboard`,
      ROLES.region,
      'B.9 Admin and Regional Dashboards',
      'B.9',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // Also capture Admin Dashboard
    await capture(
      `${BASE_URL}/admin/dashboard`,
      ROLES.admin,
      'B.9 Admin Governance Dashboard',
      'B.9_admin',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // B.10 Groq AI Omnibar
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/assistant`,
      ROLES.institution,
      'B.10 Groq AI Omnibar',
      'B.10',
      () => {
        // Pre-fill query input for realistic screenshot
        const input = document.querySelector('input[placeholder*="Ask"]');
        if (input) {
          input.value = "Analyze Life Sciences B HVAC anomaly & optimize pre-cooling schedule";
        }
      }
    );

    // -------------------------------------------------------------
    // 9.1 ML Model Performance Results
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/mlops/models`,
      ROLES.mlops,
      '9.1 ML Model Performance Results',
      '9.1',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // -------------------------------------------------------------
    // 9.2 Experimental Results of EcoSphere
    // -------------------------------------------------------------
    await capture(
      `${BASE_URL}/mlops/experiments`,
      ROLES.mlops,
      '9.2 Experimental Results of EcoSphere',
      '9.2',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    // Also capture Tenant Analytics & MILP Frontier for Experimental Results
    await capture(
      `${BASE_URL}/institution/analytics`,
      ROLES.institution,
      '9.2 Experimental Results of EcoSphere - Portfolio Analytics',
      '9.2_analytics',
      () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    );

    console.log('\n==================================================');
    console.log('🎉 ALL FIGURES SUCCESSFULLY CAPTURED FROM ELECTRON!');
    console.log(`Directory: ${OUT_DIR}`);
    console.log('==================================================\n');

  } catch (err) {
    console.error('CAPTURE ERROR:', err);
  } finally {
    app.quit();
  }
});
