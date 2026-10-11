/**
 * VerdantIQ Ecosphere - Comprehensive Multi-Role Seed Script
 * 
 * Populates MongoDB with all 8 user personas, their credentials,
 * and realistic performed actions and domain data for all 20+ features per role.
 * 
 * Roles Seeded:
 *  1. ADMIN       - System Administrator (admin@verdantiq.io)
 *  2. REGION      - Regional Authority (region@tn.gov.in)
 *  3. INSTITUTION - Institutional Executive (admin@institution.org)
 *  4. DEPT        - Department Lead / Manager (dept@institution.org)
 *  5. AUDIT       - ESG Auditor & Compliance Officer (auditor@esg-verify.org)
 *  6. MLOPS       - MLOps Engineer & Data Scientist (mlops@verdantiq.io)
 *  7. STUDENT     - Student Eco-Participant (student@institution.org)
 *  8. HOUSEHOLD   - Household Resident / Individual (user@verdantiq.org)
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if available
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env'),
    path.join(process.cwd(), '.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let value = trimmed.substring(idx + 1).trim();
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      break;
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'VerdantIQ';

const now = new Date();
const isoNow = now.toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

/* =========================================================================
   1. USERS COLLECTION (8 Distinct Personas)
   ========================================================================= */
const USERS_DATA = [
  {
    id: 'usr_sys_admin_01',
    email: 'admin@verdantiq.io',
    name: 'Alexander Vance',
    role: 'admin',
    tenantId: 'tenant_verdantiq_core',
    department: 'Infrastructure & Platform Security',
    institution: 'VerdantIQ Global Platform Core',
    passwordHash: '$2a$10$VerdantIQPlatformAdminSecureHash2026!',
    isVerified: true,
    provider: 'email',
    bio: 'Platform System Administrator with global RBAC, rate-limiting, and microservice orchestration access.',
    createdAt: daysAgo(180),
    updatedAt: isoNow,
  },
  {
    id: 'usr_region_auth_02',
    email: 'region@tn.gov.in',
    name: 'Dr. K. Senthil Nathan',
    role: 'region',
    tenantId: 'tenant_tn_district_board',
    department: 'Regional Environmental Protection Board',
    institution: 'Regional Sustainability Council - District 1',
    passwordHash: '$2a$10$VerdantIQRegionSecureHash2026!',
    isVerified: true,
    provider: 'outlook',
    bio: 'Regional Authority Overseer monitoring multi-campus compliance, GIS heatmaps, and regional energy benchmarks.',
    createdAt: daysAgo(150),
    updatedAt: isoNow,
  },
  {
    id: 'usr_inst_exec_03',
    email: 'admin@institution.org',
    name: 'Dr. Eleanor Vance',
    role: 'institution',
    tenantId: 'tenant_institution_org',
    department: 'Office of the Vice Chancellor',
    institution: 'Pacific State University System',
    passwordHash: '$2a$10$VerdantIQInstSecureHash2026!',
    isVerified: true,
    provider: 'google',
    bio: 'Institutional Executive driving campus decarbonization, geofencing, and executive ESG reporting.',
    createdAt: daysAgo(120),
    updatedAt: isoNow,
  },
  {
    id: 'usr_dept_lead_04',
    email: 'dept@institution.org',
    name: 'Prof. Marcus Sterling',
    role: 'dept',
    tenantId: 'tenant_institution_org',
    department: 'Facility Science & CS Labs',
    institution: 'Pacific State University System',
    passwordHash: '$2a$10$VerdantIQDeptSecureHash2026!',
    isVerified: true,
    provider: 'email',
    bio: 'Department Lead managing sub-cohorts, student proof verifications, and lab energy schedules.',
    createdAt: daysAgo(90),
    updatedAt: isoNow,
  },
  {
    id: 'usr_esg_auditor_05',
    email: 'auditor@esg-verify.org',
    name: 'Elena Rostova',
    role: 'audit',
    tenantId: 'tenant_institution_org',
    department: 'External ESG Verification Directorate',
    institution: 'Pacific State University System (Scope Audit)',
    passwordHash: '$2a$10$VerdantIQAuditSecureHash2026!',
    isVerified: true,
    provider: 'email',
    bio: 'ESG Compliance Auditor verifying immutable redacted logs, OCR utility invoices, and ISO 50001 metrics.',
    createdAt: daysAgo(75),
    updatedAt: isoNow,
  },
  {
    id: 'usr_mlops_eng_06',
    email: 'mlops@verdantiq.io',
    name: 'Tariq Al-Mansoor',
    role: 'mlops',
    tenantId: 'tenant_verdantiq_core',
    department: 'Applied AI & ML Systems',
    institution: 'VerdantIQ Global Platform Core',
    passwordHash: '$2a$10$VerdantIQMlopsSecureHash2026!',
    isVerified: true,
    provider: 'google',
    bio: 'MLOps Architect managing model registries, MILP optimization weights, canary splits, and XGBoost retraining.',
    createdAt: daysAgo(60),
    updatedAt: isoNow,
  },
  {
    id: 'usr_student_07',
    email: 'student@institution.org',
    name: 'Maya Lin',
    role: 'student',
    tenantId: 'tenant_institution_org',
    department: 'Environmental Engineering',
    institution: 'Pacific State University System',
    isVerifiedStudent: true,
    isVerified: true,
    dormId: 'dorm-room-304B',
    passwordHash: '$2a$10$VerdantIQStudentSecureHash2026!',
    provider: 'google',
    bio: 'Student Eco-Ambassador participating in geofenced challenges, dorm energy setbacks, and eco-projects.',
    createdAt: daysAgo(45),
    updatedAt: isoNow,
  },
  {
    id: 'usr_household_08',
    email: 'user@verdantiq.org',
    name: 'David & Sarah Chen',
    role: 'user',
    tenantId: 'tenant_res_user',
    department: 'Residential Sector',
    institution: 'Independent Eco-Household',
    isVerified: true,
    householdId: 'hh-101',
    passwordHash: '$2a$10$VerdantIQUserSecureHash2026!',
    provider: 'email',
    bio: 'Residential Eco-Household utilizing MILP action optimization, solar storage tracking, and utility bill OCR.',
    createdAt: daysAgo(30),
    updatedAt: isoNow,
  }
];

/* =========================================================================
   2. INSTITUTIONS COLLECTION
   ========================================================================= */
const INSTITUTIONS_DATA = [
  {
    id: 'inst-01',
    name: 'Pacific State University System',
    code: 'PSU',
    domain: 'institution.org',
    domainDNS: 'institution.org',
    regionDistrict: 'District 1 (Bay Area North)',
    lat: 37.7749,
    lng: -122.4194,
    status: 'active',
    studentCount: 24500,
    deptCount: 18,
    currentEUI: 112.4,
    targetEUI: 110.0,
    carbonIntensity: 184.2,
    targetCarbonIntensity: 200.0,
    forecastAccuracyPct: 94.8,
    forecastErrorMapePct: 5.2,
    targetDistanceScore: 92,
    complianceRate: 96.5,
    supportFlagged: false,
    provisioningStatus: 'provisioned',
    createdAt: daysAgo(180),
  },
  {
    id: 'inst-02',
    name: 'Pacific State University - East Campus',
    code: 'PSU-EDU',
    domain: 'pacific.edu',
    domainDNS: 'pacific.edu',
    regionDistrict: 'District 1 (Bay Area North)',
    lat: 37.7760,
    lng: -122.4200,
    status: 'active',
    studentCount: 18200,
    deptCount: 14,
    currentEUI: 108.2,
    targetEUI: 105.0,
    carbonIntensity: 175.0,
    targetCarbonIntensity: 190.0,
    forecastAccuracyPct: 95.1,
    forecastErrorMapePct: 4.9,
    targetDistanceScore: 95,
    complianceRate: 98.0,
    supportFlagged: false,
    provisioningStatus: 'provisioned',
    createdAt: daysAgo(150),
  },
  {
    id: 'inst-03',
    name: 'Stanford University',
    code: 'STANFORD',
    domain: 'stanford.edu',
    domainDNS: 'stanford.edu',
    regionDistrict: 'District 2 (Silicon Corridor)',
    lat: 37.4275,
    lng: -122.1697,
    status: 'active',
    studentCount: 17000,
    deptCount: 20,
    currentEUI: 95.4,
    targetEUI: 90.0,
    carbonIntensity: 130.0,
    targetCarbonIntensity: 150.0,
    forecastAccuracyPct: 97.2,
    forecastErrorMapePct: 2.8,
    targetDistanceScore: 97,
    complianceRate: 99.1,
    supportFlagged: false,
    provisioningStatus: 'provisioned',
    createdAt: daysAgo(120),
  },
  {
    id: 'inst-04',
    name: 'Massachusetts Institute of Technology',
    code: 'MIT',
    domain: 'mit.edu',
    domainDNS: 'mit.edu',
    regionDistrict: 'District 3 (Northwest Coastal)',
    lat: 42.3601,
    lng: -71.0942,
    status: 'active',
    studentCount: 11800,
    deptCount: 16,
    currentEUI: 92.1,
    targetEUI: 88.0,
    carbonIntensity: 120.5,
    targetCarbonIntensity: 140.0,
    forecastAccuracyPct: 98.0,
    forecastErrorMapePct: 2.0,
    targetDistanceScore: 99,
    complianceRate: 99.5,
    supportFlagged: false,
    provisioningStatus: 'provisioned',
    createdAt: daysAgo(100),
  }
];

/* =========================================================================
   3. ROLE 1: SYSTEM ADMINISTRATOR (ADMIN) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const RBAC_SCHEMA_ROLES_DATA = [
  {
    id: 'rbac-admin',
    roleName: 'ADMIN',
    displayName: 'System Administrator',
    description: 'Full global administrative, security configuration, and microservice oversight privileges.',
    permissions: ['GLOBAL_USER_MGMT', 'RBAC_CONFIG', 'RATE_LIMIT_OVERRIDE', 'SYSTEM_BROADCAST', 'AUDIT_LOG_VIEW_FULL', 'TENANT_PROVISION', 'KEY_ROTATION', 'FEATURE_FLAG_EDIT'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-region',
    roleName: 'REGION',
    displayName: 'Regional Authority',
    description: 'Regional multi-campus governance, GIS heatmaps, and state ESG benchmarks.',
    permissions: ['REGION_DASHBOARD', 'DOMAIN_OVERSIGHT', 'STATE_AGGREGATION', 'BENCHMARK_CONFIG', 'TENANT_APPROVAL', 'SUPPORT_TICKET_MGMT'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-institution',
    roleName: 'INSTITUTION',
    displayName: 'Institutional Executive',
    description: 'Campus-wide sustainability command center, geofence configuration, and executive ESG report generation.',
    permissions: ['INST_DASHBOARD', 'GEOFENCE_CONFIG', 'DEPT_AGGREGATION', 'EXECUTIVE_REPORT_SCHEDULE', 'DOMAIN_WHITELIST', 'CHALLENGE_APPROVAL'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-dept',
    roleName: 'DEPT',
    displayName: 'Department Lead',
    description: 'Departmental resource tracking, sub-cohort management, and student action proof verification.',
    permissions: ['DEPT_DASHBOARD', 'SUBCOHORT_MGMT', 'PROOF_VERIFICATION', 'DEPT_CHALLENGE_BUILD', 'TRIGGER_SETTINGS', 'STUDENT_ONBOARDING'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-audit',
    roleName: 'AUDIT',
    displayName: 'ESG Auditor',
    description: 'Regulatory compliance auditing, redacted immutable log review, OCR invoice validation, and model cards.',
    permissions: ['AUDIT_OVERVIEW', 'REDACTED_LOG_INSPECT', 'DATA_LINEAGE_VIEW', 'AUDIT_REQUEST_CREATE', 'OCR_VERIFICATION', 'COMPLIANCE_SIGN_OFF'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-mlops',
    roleName: 'MLOPS',
    displayName: 'MLOps Engineer',
    description: 'Model registry management, atomic rollback triggers, MILP weight tuning, and canary traffic splitting.',
    permissions: ['MODEL_REGISTRY_VIEW', 'MODEL_ROLLBACK_EXEC', 'MILP_WEIGHTS_TUNE', 'RETRAIN_SCHEDULE_MGMT', 'CANARY_SPLIT_CONFIG', 'EXPERIMENT_TRACK'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-student',
    roleName: 'STUDENT',
    displayName: 'Student Eco-Participant',
    description: 'Dorm digital twin monitoring, geofenced challenges, eco-action proof submissions, and reward redemptions.',
    permissions: ['STUDENT_DASHBOARD', 'DORM_TWIN_VIEW', 'CHALLENGE_JOIN', 'ACTION_PROOF_SUBMIT', 'REWARD_REDEEM', 'PROJECT_SUBMIT'],
    createdAt: daysAgo(180),
  },
  {
    id: 'rbac-household',
    roleName: 'HOUSEHOLD',
    displayName: 'Household Resident',
    description: 'Home digital twin management, MILP energy optimizer, utility bill OCR, and appliance tracking.',
    permissions: ['HOUSEHOLD_DASHBOARD', 'UTILITY_LOG_SUBMIT', 'MILP_OPTIMIZE_RUN', 'OCR_BILL_UPLOAD', 'DEVICE_LINK', 'GOAL_SET'],
    createdAt: daysAgo(180),
  }
];

const RATE_LIMIT_RULES_DATA = [
  { id: 'rate-01', endpointPattern: '/api/v1/forecast/**', limitPerMinute: 60, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  { id: 'rate-02', endpointPattern: '/api/v1/anomaly/**', limitPerMinute: 120, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  { id: 'rate-03', endpointPattern: '/api/v1/optimize/**', limitPerMinute: 30, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  { id: 'rate-04', endpointPattern: '/api/v1/ocr/**', limitPerMinute: 20, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  { id: 'rate-05', endpointPattern: '/api/auth/login', limitPerMinute: 10, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  { id: 'rate-06', endpointPattern: '/api/student/proofs', limitPerMinute: 45, tenantScope: 'tenant_institution_org', enabled: true, updatedAt: daysAgo(10) },
];

const SYSTEM_BROADCASTS_DATA = [
  {
    id: 'bcast-01',
    title: 'Spring 2026 Regional Eco-Challenge Active',
    message: 'The Inter-Campus Net-Zero Spring Challenge is live across all registered universities.',
    severity: 'INFO',
    targetAudience: 'ALL_USERS',
    active: true,
    publishedBy: 'admin@verdantiq.io',
    createdAt: daysAgo(5),
    expiresAt: daysAgo(-25),
  },
  {
    id: 'bcast-02',
    title: 'Regional Power Grid Peak Strain Advisory',
    message: 'Regional grid operator has declared high demand. All campus chillers and smart thermostats shifted to Eco-Mode.',
    severity: 'WARNING',
    targetAudience: 'INSTITUTION_DEPT_HOUSEHOLD',
    active: true,
    publishedBy: 'admin@verdantiq.io',
    createdAt: hoursAgo(6),
    expiresAt: hoursAgo(-18),
  },
  {
    id: 'bcast-03',
    title: 'XGBoost Forecasting Model v2.4 Live',
    message: 'Automated 30-day forecast models updated with enhanced weather variance regressors.',
    severity: 'INFO',
    targetAudience: 'MLOPS_AUDIT_INSTITUTION',
    active: true,
    publishedBy: 'admin@verdantiq.io',
    createdAt: daysAgo(12),
    expiresAt: daysAgo(-18),
  },
  {
    id: 'bcast-04',
    title: 'Scheduled Microservice Gateway Maintenance Completed',
    message: 'Database connection pool optimization and token refresh enhancements deployed.',
    severity: 'SUCCESS',
    targetAudience: 'ALL_USERS',
    active: false,
    publishedBy: 'admin@verdantiq.io',
    createdAt: daysAgo(20),
    expiresAt: daysAgo(19),
  }
];

const FEATURE_FLAGS_DATA = [
  { id: 'flag-xgboost-v2', key: 'enable_xgboost_forecast_v2', enabled: true, description: 'Enable XGBoost v2.4 30-day consumption forecasting regression', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(8) },
  { id: 'flag-canary-split', key: 'canary_traffic_split', enabled: true, description: 'Route 10% of ML inference traffic to canary forecaster candidate', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(5) },
  { id: 'flag-iso50001', key: 'esg_iso50001_compliance', enabled: true, description: 'Activate automated ISO 50001 Energy Performance Indicator audits', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(14) },
  { id: 'flag-realtime-sse', key: 'realtime_sse_telemetry', enabled: true, description: 'Enable real-time Server-Sent Events for live campus telemetry', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(2) },
  { id: 'flag-ocr-autoverify', key: 'ocr_invoice_auto_verify', enabled: true, description: 'Enable PyTesseract automated OCR utility bill data extraction', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(10) },
  { id: 'flag-experimental-milp', key: 'experimental_milp_solver', enabled: false, description: 'Test experimental MILP multi-facility global load balancing', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(3) },
];

const ACCESS_GRANTS_DATA = [
  { id: 'grant-01', granteeEmail: 'techsupport@verdantiq.org', targetTenant: 'tenant_institution_org', elevatedRole: 'AUDIT', justification: 'Quarterly ISO 50001 external data verification inspection', approvedBy: 'admin@verdantiq.io', status: 'ACTIVE', expiresAt: daysAgo(-14) },
  { id: 'grant-02', granteeEmail: 'ml-researcher@pacific.edu', targetTenant: 'tenant_institution_org', elevatedRole: 'MLOPS', justification: 'Fine-tuning XGBoost models on campus building sensor arrays', approvedBy: 'admin@verdantiq.io', status: 'EXPIRED', expiresAt: daysAgo(2) },
];

const ADMIN_AUDIT_LOGS_DATA = [
  { id: 'admin-log-01', action: 'TENANT_PROVISION', resourceType: 'INSTITUTION', resourceId: 'inst-01', details: 'Initialized Pacific State University System tenant partition with encrypted credentials', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(180) },
  { id: 'admin-log-02', action: 'RBAC_UPDATE', resourceType: 'ROLE', resourceId: 'rbac-student', details: 'Added ACTION_PROOF_SUBMIT and REWARD_REDEEM permissions to Student role', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(40) },
  { id: 'admin-log-03', action: 'RATE_LIMIT_UPDATE', resourceType: 'ENDPOINT', resourceId: '/api/v1/forecast/**', details: 'Increased rate limit from 30 to 60 req/min for campus research analytics', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(15) },
  { id: 'admin-log-04', action: 'FEATURE_FLAG_TOGGLE', resourceType: 'FEATURE_FLAG', resourceId: 'enable_xgboost_forecast_v2', details: 'Switched XGBoost forecast engine v2 to active', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(8) },
  { id: 'admin-log-05', action: 'SECRET_KEY_ROTATION', resourceType: 'GATEWAY_SECURITY', resourceId: 'INTERNAL_SERVICE_KEY', details: 'Successfully rotated internal microservice auth token between Spring Boot and FastAPI', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(30) },
  { id: 'admin-log-06', action: 'SESSION_REVOCATION', resourceType: 'USER_SESSION', resourceId: 'usr_stale_temp_99', details: 'Invalidated stale user session tokens following credential reset', executedBy: 'admin@verdantiq.io', timestamp: daysAgo(3) },
];

/* =========================================================================
   4. ROLE 2: REGIONAL AUTHORITY (REGION) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const DOMAIN_OVERSIGHT_RECORDS_DATA = [
  { id: 'dom-01', institutionId: 'inst-01', domainName: 'institution.org', institutionName: 'Pacific State University System', regionDistrict: 'District 1 (Bay Area North)', studentCount: 24500, activeEUI: 112.4, targetEUI: 110.0, complianceStatus: 'COMPLIANT', carbonFactor: 0.42, updatedAt: daysAgo(1) },
  { id: 'dom-02', institutionId: 'inst-02', domainName: 'pacific.edu', institutionName: 'Pacific State University - East Campus', regionDistrict: 'District 1 (Bay Area North)', studentCount: 18200, activeEUI: 108.2, targetEUI: 105.0, complianceStatus: 'COMPLIANT', carbonFactor: 0.42, updatedAt: daysAgo(1) },
  { id: 'dom-03', institutionId: 'inst-03', domainName: 'stanford.edu', institutionName: 'Stanford University', regionDistrict: 'District 2 (Silicon Corridor)', studentCount: 17000, activeEUI: 95.4, targetEUI: 90.0, complianceStatus: 'EXEMPLARY', carbonFactor: 0.38, updatedAt: daysAgo(2) },
  { id: 'dom-04', institutionId: 'inst-04', domainName: 'mit.edu', institutionName: 'Massachusetts Institute of Technology', regionDistrict: 'District 3 (Northwest Coastal)', studentCount: 11800, activeEUI: 92.1, targetEUI: 88.0, complianceStatus: 'EXEMPLARY', carbonFactor: 0.35, updatedAt: daysAgo(3) },
];

const REGIONAL_POLICY_CONFIGS_DATA = [
  { id: 'pol-01', regionDistrict: 'District 1 (Bay Area North)', policyCode: 'STATE-CAMPUS-2026-NETZERO', title: 'State University Net-Zero Transition Mandate', mandatoryEUIStandard: 110.0, targetYear: 2030, finePerOverdueTonCO2: 120.0, active: true, updatedAt: daysAgo(60) },
  { id: 'pol-02', regionDistrict: 'District 1 (Bay Area North)', policyCode: 'WATER-CONSERVE-TIER2', title: 'Campus Water Efficiency & Greywater Recycling Code', maxGallonsPerCapitaDaily: 35.0, active: true, updatedAt: daysAgo(90) },
];

const REGIONAL_BENCHMARKS_DATA = [
  { id: 'bench-01', metricName: 'Campus Energy Use Intensity (EUI)', baselineValue: 125.0, currentRegionalAverage: 104.5, targetStandard: 95.0, unit: 'kWh/m²', regionDistrict: 'District 1 (Bay Area North)', year: 2026 },
  { id: 'bench-02', metricName: 'Electricity Grid Carbon Intensity Factor', baselineValue: 0.52, currentRegionalAverage: 0.41, targetStandard: 0.30, unit: 'kg CO₂e/kWh', regionDistrict: 'District 1 (Bay Area North)', year: 2026 },
  { id: 'bench-03', metricName: 'Solid Waste Landfill Diversion Rate', baselineValue: 65.0, currentRegionalAverage: 82.4, targetStandard: 90.0, unit: '%', regionDistrict: 'District 1 (Bay Area North)', year: 2026 },
];

const GROWTH_TREND_DATA_POINTS_DATA = [
  { id: 'trend-01', month: '2025-10', totalKwhSaved: 42000, totalCarbonReducedKg: 21840, participatingCampuses: 8, activeEcoParticipants: 14200 },
  { id: 'trend-02', month: '2025-11', totalKwhSaved: 51200, totalCarbonReducedKg: 26624, participatingCampuses: 10, activeEcoParticipants: 18500 },
  { id: 'trend-03', month: '2025-12', totalKwhSaved: 63800, totalCarbonReducedKg: 33176, participatingCampuses: 12, activeEcoParticipants: 22100 },
  { id: 'trend-04', month: '2026-01', totalKwhSaved: 74500, totalCarbonReducedKg: 38740, participatingCampuses: 14, activeEcoParticipants: 27400 },
  { id: 'trend-05', month: '2026-02', totalKwhSaved: 88900, totalCarbonReducedKg: 46228, participatingCampuses: 16, activeEcoParticipants: 33800 },
  { id: 'trend-06', month: '2026-03', totalKwhSaved: 104200, totalCarbonReducedKg: 54184, participatingCampuses: 18, activeEcoParticipants: 41200 },
];

const SHARED_CHALLENGE_TEMPLATES_DATA = [
  {
    id: 'shared-ch-01',
    title: 'Inter-Campus Net-Zero Spring Cup',
    description: 'Universities compete to achieve the highest percentage reduction in campus dormitory lighting and HVAC loads.',
    category: 'ENERGY_REDUCTION',
    targetKwhReduction: 10000,
    pointReward: 2500,
    startDate: daysAgo(10),
    endDate: daysAgo(-20),
    participantCount: 4250,
    status: 'ACTIVE',
    createdBy: 'region@tn.gov.in',
  },
  {
    id: 'shared-ch-02',
    title: 'Zero Single-Use Campus Dining Cup',
    description: 'Eliminate disposable containers and plastic cutlery across all university dining halls.',
    category: 'WASTE_DIVERSION',
    targetKgWasteDiverted: 5000,
    pointReward: 1500,
    startDate: daysAgo(5),
    endDate: daysAgo(-25),
    participantCount: 6800,
    status: 'ACTIVE',
    createdBy: 'region@tn.gov.in',
  }
];

const TENANT_REQUESTS_DATA = [
  { id: 'req-01', institutionName: 'UC Berkeley Sustainable Campus', contactEmail: 'director.energy@berkeley.edu', domain: 'berkeley.edu', regionDistrict: 'District 1 (Bay Area North)', studentCapacity: 45000, status: 'APPROVED', reviewedBy: 'region@tn.gov.in', reviewedAt: daysAgo(12) },
  { id: 'req-02', institutionName: 'Silicon Valley Polytechnic Institute', contactEmail: 'sustainability@svpi.edu', domain: 'svpi.edu', regionDistrict: 'District 2 (Silicon Corridor)', studentCapacity: 8500, status: 'PENDING', reviewedBy: null, reviewedAt: null },
];

const SUPPORT_TICKETS_DATA = [
  { id: 'ticket-01', institutionId: 'inst-01', title: 'Smart Meter BACnet Gateway Anomaly in Science Quad', priority: 'HIGH', status: 'IN_PROGRESS', assignedTo: 'region@tn.gov.in', createdAt: daysAgo(3), updatedAt: hoursAgo(4) },
  { id: 'ticket-02', institutionId: 'inst-02', title: 'Solar Array Inverter Feed Calibration Sync', priority: 'MEDIUM', status: 'RESOLVED', assignedTo: 'region@tn.gov.in', createdAt: daysAgo(14), updatedAt: daysAgo(8) },
];

/* =========================================================================
   5. ROLE 3: INSTITUTIONAL EXECUTIVE (INSTITUTION) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const GEOFENCE_POLYGONS_DATA = [
  {
    id: 'geo-poly-01',
    institutionId: 'inst-01',
    sectorName: 'North Academic & Research Quad',
    coordinates: [
      { lat: 37.7755, lng: -122.4210 },
      { lat: 37.7765, lng: -122.4185 },
      { lat: 37.7745, lng: -122.4170 },
      { lat: 37.7735, lng: -122.4195 },
    ],
    zoneType: 'ACADEMIC_LABS',
    euiTarget: 115.0,
    isActive: true,
  },
  {
    id: 'geo-poly-02',
    institutionId: 'inst-01',
    sectorName: 'West Village Dormitory Complex',
    coordinates: [
      { lat: 37.7725, lng: -122.4220 },
      { lat: 37.7738, lng: -122.4200 },
      { lat: 37.7718, lng: -122.4180 },
      { lat: 37.7705, lng: -122.4205 },
    ],
    zoneType: 'RESIDENTIAL_DORMS',
    euiTarget: 85.0,
    isActive: true,
  }
];

const INSTITUTION_DEPARTMENT_RECORDS_DATA = [
  { id: 'inst-dept-01', institutionId: 'inst-01', departmentId: 'dept-cs-01', departmentName: 'Facility Science & CS Labs', facultyCount: 45, studentCount: 1450, currentMonthKwh: 48500, kwhSavingsVsBaselinePct: 18.4, carbonSavedKg: 9400, costSavedUSD: 4850.0, ecoScore: 94 },
  { id: 'inst-dept-02', institutionId: 'inst-01', departmentId: 'dept-env-02', departmentName: 'Environmental Engineering', facultyCount: 32, studentCount: 820, currentMonthKwh: 24200, kwhSavingsVsBaselinePct: 24.2, carbonSavedKg: 5800, costSavedUSD: 2900.0, ecoScore: 98 },
  { id: 'inst-dept-03', institutionId: 'inst-01', departmentId: 'dept-dorm-03', departmentName: 'West Village Dormitory Quads', facultyCount: 12, studentCount: 4200, currentMonthKwh: 92000, kwhSavingsVsBaselinePct: 14.8, carbonSavedKg: 16500, costSavedUSD: 8250.0, ecoScore: 91 },
  { id: 'inst-dept-04', institutionId: 'inst-01', departmentId: 'dept-life-04', departmentName: 'Life Sciences & Biotech Labs', facultyCount: 58, studentCount: 1600, currentMonthKwh: 124000, kwhSavingsVsBaselinePct: 12.1, carbonSavedKg: 18200, costSavedUSD: 9100.0, ecoScore: 88 },
];

const EXECUTIVE_REPORT_SCHEDULES_DATA = [
  { id: 'sched-01', institutionId: 'inst-01', reportType: 'MONTHLY_ESG_DISCLOSURE', format: 'PDF', recipients: ['chancellor@pacific.edu', 'board@pacific.edu', 'admin@institution.org'], cronExpression: '0 8 1 * *', nextRun: daysAgo(-12), active: true },
  { id: 'sched-02', institutionId: 'inst-01', reportType: 'EPA_ISO50001_COMPLIANCE_QUARTERLY', format: 'PDF', recipients: ['sustainability@pacific.edu', 'auditor@esg-verify.org'], cronExpression: '0 9 1 1,4,7,10 *', nextRun: daysAgo(-40), active: true },
];

const ACCEPTED_DOMAINS_DATA = [
  { id: 'acc-dom-01', institutionId: 'inst-01', domain: 'institution.org', verified: true, allowAutoStudentJoin: true, addedAt: daysAgo(180) },
  { id: 'acc-dom-02', institutionId: 'inst-01', domain: 'pacific.edu', verified: true, allowAutoStudentJoin: true, addedAt: daysAgo(150) },
  { id: 'acc-dom-03', institutionId: 'inst-01', domain: 'alumni.pacific.edu', verified: true, allowAutoStudentJoin: false, addedAt: daysAgo(90) },
];

const CHALLENGE_APPROVAL_ITEMS_DATA = [
  { id: 'ch-app-01', institutionId: 'inst-01', challengeTitle: 'Campus Dormitory Nocturnal HVAC Setback Sprint', proposedByDept: 'Facility Science', estimatedKwhSavings: 15000, status: 'APPROVED', reviewedBy: 'admin@institution.org', approvedAt: daysAgo(14) },
  { id: 'ch-app-02', institutionId: 'inst-01', challengeTitle: 'Science Hall Stairway Climb vs Elevator Eco-Race', proposedByDept: 'Environmental Engineering', estimatedKwhSavings: 3500, status: 'APPROVED', reviewedBy: 'admin@institution.org', approvedAt: daysAgo(7) },
];

const ESCALATION_RESOLUTIONS_DATA = [
  { id: 'esc-res-01', institutionId: 'inst-01', escalationCaseId: 'esc-01', issueSummary: 'Central Chiller plant continuous baseline surge during off-peak weekend hours', resolutionNotes: 'Replaced faulty chilled water modulating valve in Building B. Energy draw restored to baseline.', resolvedBy: 'admin@institution.org', resolvedAt: daysAgo(4) },
];

/* =========================================================================
   6. ROLE 4: DEPARTMENT LEAD (DEPT) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const SUB_COHORTS_DATA = [
  { id: 'cohort-01', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', cohortName: 'High-Performance Computing Lab Squad', leaderEmail: 'student.lead1@institution.org', memberCount: 28, weeklyKwhTarget: 450.0, currentKwhScore: 380.0 },
  { id: 'cohort-02', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', cohortName: 'Facility Robotics & Sensor Team', leaderEmail: 'student.lead2@institution.org', memberCount: 16, weeklyKwhTarget: 220.0, currentKwhScore: 195.0 },
  { id: 'cohort-03', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', cohortName: 'Green Dorm Floor 3 Eco-Squad', leaderEmail: 'student@institution.org', memberCount: 34, weeklyKwhTarget: 600.0, currentKwhScore: 490.0 },
];

const STUDENT_REGISTRY_RECORDS_DATA = [
  { id: 'sreg-01', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', studentId: 'usr_student_07', studentEmail: 'student@institution.org', studentName: 'Maya Lin', dormRoom: 'dorm-room-304B', totalEcoPoints: 1450, kwhSavedTotal: 84.5, verificationStatus: 'VERIFIED', enrolledAt: daysAgo(45) },
  { id: 'sreg-02', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', studentId: 'usr_student_08_sub', studentEmail: 'liam.chen@institution.org', studentName: 'Liam Chen', dormRoom: 'dorm-room-308A', totalEcoPoints: 1120, kwhSavedTotal: 62.0, verificationStatus: 'VERIFIED', enrolledAt: daysAgo(40) },
  { id: 'sreg-03', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', studentId: 'usr_student_09_sub', studentEmail: 'aisha.patel@institution.org', studentName: 'Aisha Patel', dormRoom: 'dorm-room-412C', totalEcoPoints: 980, kwhSavedTotal: 54.0, verificationStatus: 'VERIFIED', enrolledAt: daysAgo(35) },
];

const VERIFICATION_ITEMS_DATA = [
  {
    id: 'ver-01',
    deptId: 'dept-cs-01',
    tenantId: 'tenant_institution_org',
    studentEmail: 'student@institution.org',
    studentName: 'Maya Lin',
    actionType: 'LAB_EQUIPMENT_POWER_DOWN',
    description: 'Shutdown 12 idle GPU simulation workstations overnight on Friday',
    proofImageUri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    proofImageHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    calculatedKwh: 36.0,
    pointsAwarded: 250,
    status: 'APPROVED',
    reviewedBy: 'dept@institution.org',
    reviewedAt: daysAgo(2),
  },
  {
    id: 'ver-02',
    deptId: 'dept-cs-01',
    tenantId: 'tenant_institution_org',
    studentEmail: 'student@institution.org',
    studentName: 'Maya Lin',
    actionType: 'STAIRWELL_COMMUTE_WEEK',
    description: 'Logged 45 floors of stairs instead of elevator across Science Complex',
    proofImageUri: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    proofImageHash: 'sha256:c28d2279b90f4a3e2a96c9c6f2a89311de1705649a37e1933560b4352f146522',
    calculatedKwh: 12.5,
    pointsAwarded: 120,
    status: 'APPROVED',
    reviewedBy: 'dept@institution.org',
    reviewedAt: daysAgo(5),
  },
  {
    id: 'ver-03',
    deptId: 'dept-cs-01',
    tenantId: 'tenant_institution_org',
    studentEmail: 'liam.chen@institution.org',
    studentName: 'Liam Chen',
    actionType: 'DORM_COLD_WASH_LAUNDRY',
    description: 'Ran 4 loads of dorm laundry on cold eco cycle',
    proofImageUri: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    proofImageHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    calculatedKwh: 9.2,
    pointsAwarded: 90,
    status: 'APPROVED',
    reviewedBy: 'dept@institution.org',
    reviewedAt: daysAgo(3),
  },
  {
    id: 'ver-04',
    deptId: 'dept-cs-01',
    tenantId: 'tenant_institution_org',
    studentEmail: 'aisha.patel@institution.org',
    studentName: 'Aisha Patel',
    actionType: 'DOUBLE_SIDED_PRINTING_TRANSITION',
    description: 'Transitioned lab study handouts to 100% digital PDF omnibar readers',
    proofImageUri: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=600&q=80',
    proofImageHash: 'sha256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    calculatedKwh: 4.8,
    pointsAwarded: 75,
    status: 'PENDING',
    reviewedBy: null,
    reviewedAt: null,
  }
];

const DEPT_CHALLENGE_TEMPLATES_DATA = [
  { id: 'dept-ch-01', deptId: 'dept-cs-01', title: 'Server Room Nocturnal Power-Down', targetKwh: 500, pointReward: 300, durationDays: 7, active: true },
  { id: 'dept-ch-02', deptId: 'dept-cs-01', title: 'Lab Weekend Phantom Load Purge', targetKwh: 350, pointReward: 200, durationDays: 3, active: true },
];

const ESCALATION_CASES_DATA = [
  { id: 'esc-01', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', roomLocation: 'Building B - Lab 204 Chiller Valve', priority: 'HIGH', status: 'RESOLVED', reportedBy: 'dept@institution.org', description: 'Chilled water pipe bypass valve stuck open causing constant condenser draw', reportedAt: daysAgo(6) },
  { id: 'esc-02', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', roomLocation: 'Science Complex West Stairwell', priority: 'LOW', status: 'IN_PROGRESS', reportedBy: 'dept@institution.org', description: 'Motion sensor light stay-on duration set to 30 mins instead of 3 mins eco-mode', reportedAt: daysAgo(2) },
];

/* =========================================================================
   7. ROLE 5: ESG AUDITOR & COMPLIANCE (AUDIT) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const AUDIT_REQUESTS_DATA = [
  { id: 'aud-req-01', tenantId: 'tenant_institution_org', targetDepartment: 'Facility Science', scopeStandard: 'ISO 50001 (Section 6.3 - Energy Baselines)', title: 'Request for Sub-Metered Calibration Logs (Quarter 1)', status: 'COMPLETED', auditorEmail: 'auditor@esg-verify.org', requestedAt: daysAgo(25), resolvedAt: daysAgo(18) },
  { id: 'aud-req-02', tenantId: 'tenant_institution_org', targetDepartment: 'Executive Operations', scopeStandard: 'GRI 302-1 (Energy Consumption within Organization)', title: 'Utility Bill OCR Hash Chain Verification Certificate', status: 'IN_REVIEW', auditorEmail: 'auditor@esg-verify.org', requestedAt: daysAgo(5), resolvedAt: null },
];

const REDACTED_AUDIT_LOGS_DATA = [
  {
    id: 'redacted-log-01',
    anonymizedUid: 'usr_anon_***_4b8f',
    sanitizedRole: 'STUDENT',
    tenantId: 'tenant_institution_org',
    actionCategory: 'ECO_ACTION_VERIFICATION',
    kwhSaved: 36.0,
    carbonKgReduced: 15.12,
    cryptographicHash: 'sha256:d41d8cd98f00b204e9800998ecf8427e',
    complianceStandard: 'ISO 50001',
    timestamp: daysAgo(2),
  },
  {
    id: 'redacted-log-02',
    anonymizedUid: 'usr_anon_***_99e1',
    sanitizedRole: 'DEPT_LEAD',
    tenantId: 'tenant_institution_org',
    actionCategory: 'HVAC_SETPOINT_OPTIMIZATION',
    kwhSaved: 145.0,
    carbonKgReduced: 60.9,
    cryptographicHash: 'sha256:098f6bcd4621d373cade4e832627b4f6',
    complianceStandard: 'GRI 302-4',
    timestamp: daysAgo(4),
  },
  {
    id: 'redacted-log-03',
    anonymizedUid: 'usr_anon_***_11fa',
    sanitizedRole: 'HOUSEHOLD',
    tenantId: 'tenant_res_user',
    actionCategory: 'SOLAR_EXPORT_OFFPEAK_CHARGE',
    kwhSaved: 28.5,
    carbonKgReduced: 11.97,
    cryptographicHash: 'sha256:ad0234829205b9033196ba818f7a872b',
    complianceStandard: 'UN SDG 7.2',
    timestamp: daysAgo(6),
  },
];

const DATA_FLOW_NODES_DATA = [
  { id: 'flow-01', nodeName: 'Smart Meter BACnet Telemetry Source', nodeType: 'INGESTION', protocol: 'MQTT/REST', latencyMs: 24, status: 'HEALTHY' },
  { id: 'flow-02', nodeName: 'Spring Boot API Gateway Validation', nodeType: 'MIDDLEWARE_AUTH', protocol: 'JWT/RBAC', latencyMs: 8, status: 'HEALTHY' },
  { id: 'flow-03', nodeName: 'PyTesseract OCR Invoice Parsing Engine', nodeType: 'DOCUMENT_AI', protocol: 'HTTP_JSON', latencyMs: 420, status: 'HEALTHY' },
  { id: 'flow-04', nodeName: 'XGBoost 30-Day Forecast Regressor', nodeType: 'ML_INFERENCE', protocol: 'FASTAPI_REST', latencyMs: 65, status: 'HEALTHY' },
  { id: 'flow-05', nodeName: 'Google OR-Tools MILP SCIP Optimizer', nodeType: 'OPTIMIZATION', protocol: 'FASTAPI_REST', latencyMs: 82, status: 'HEALTHY' },
  { id: 'flow-06', nodeName: 'Redacted Immutable ESG Disclosure Ledger', nodeType: 'PERSISTENCE', protocol: 'MONGODB_TLS', latencyMs: 12, status: 'HEALTHY' },
];

const EXPORT_CONFIGS_DATA = [
  { id: 'exp-01', configName: 'GRI Standards 2026 Core ESG Package', exportFormat: 'PDF', includeDataLineage: true, includeModelFairnessCards: true, piiRedacted: true },
  { id: 'exp-02', configName: 'ISO 50001 Energy Performance Verification CSV', exportFormat: 'CSV', includeDataLineage: false, includeModelFairnessCards: false, piiRedacted: true },
];

/* =========================================================================
   8. ROLE 6: MLOPS ENGINEER & DATA SCIENTIST (MLOPS) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const ML_MODELS_DATA = [
  {
    id: 'ml-mod-01',
    modelName: 'XGBoost Energy Forecaster',
    version: '2.4.0',
    modelType: 'XGBRegressor',
    framework: 'xgboost-2.0.3 / python-3.11',
    artifactPath: 'ml-gateway/app/models/model_store/xgboost_forecaster_v2.4.pkl',
    status: 'ACTIVE_PRODUCTION',
    rmse: 2.14,
    mae: 1.62,
    r2Score: 0.962,
    features: ['hour', 'dayofweek', 'month', 'temp_c', 'humidity', 'solar_irradiance', 'is_holiday', 'lag_24h'],
    trainedAt: daysAgo(8),
    retrainCron: '0 2 * * 0',
  },
  {
    id: 'ml-mod-02',
    modelName: 'IsolationForest Anomaly Detector',
    version: '1.8.2',
    modelType: 'IsolationForest',
    framework: 'scikit-learn-1.4.1 / python-3.11',
    artifactPath: 'ml-gateway/app/models/model_store/isolation_forest_v1.8.pkl',
    status: 'ACTIVE_PRODUCTION',
    contaminationRate: 0.05,
    f1Score: 0.941,
    features: ['kwh_delta', 'peak_surge_ratio', 'night_idle_kwh', 'temp_variance'],
    trainedAt: daysAgo(14),
    retrainCron: '0 3 1 * *',
  },
  {
    id: 'ml-mod-03',
    modelName: 'Google OR-Tools MILP SCIP Optimizer',
    version: '3.1.0',
    modelType: 'SCIP_MILP_Solver',
    framework: 'ortools-9.9 / python-3.11',
    artifactPath: 'ml-gateway/app/services/optimization.py',
    status: 'ACTIVE_PRODUCTION',
    avgSolveTimeMs: 82.4,
    weights: { carbon: 0.5, cost: 0.3, comfort: 0.2 },
    updatedAt: daysAgo(3),
  },
  {
    id: 'ml-mod-04',
    modelName: 'PyTesseract OCR Invoice Parsing Pipeline',
    version: '1.2.0',
    modelType: 'Tesseract_LSTM_OCR',
    framework: 'pytesseract-0.3.10 / tesseract-5.3',
    artifactPath: 'ml-gateway/app/services/ocr.py',
    status: 'ACTIVE_PRODUCTION',
    characterAccuracyPct: 99.2,
    supportedDocs: ['UTILITY_ELECTRIC_BILL', 'WATER_UTILITY_INVOICE', 'SOLAR_CREDIT_CERTIFICATE'],
    updatedAt: daysAgo(10),
  },
  {
    id: 'ml-mod-05',
    modelName: 'XGBoost Energy Forecaster (Rollback Candidate)',
    version: '2.3.1',
    modelType: 'XGBRegressor',
    framework: 'xgboost-1.7.6 / python-3.11',
    artifactPath: 'ml-gateway/app/models/model_store/xgboost_forecaster_v2.3.pkl',
    status: 'ARCHIVED_STANDBY',
    rmse: 2.68,
    mae: 1.95,
    r2Score: 0.938,
    trainedAt: daysAgo(45),
  }
];

const RETRAIN_SCHEDULES_DATA = [
  { id: 'retrain-01', modelId: 'ml-mod-01', modelName: 'XGBoost Energy Forecaster', cronExpression: '0 2 * * 0', enabled: true, lastRun: daysAgo(8), lastStatus: 'SUCCESS', datasetSize: 50000 },
  { id: 'retrain-02', modelId: 'ml-mod-02', modelName: 'IsolationForest Anomaly Detector', cronExpression: '0 3 1 * *', enabled: true, lastRun: daysAgo(14), lastStatus: 'SUCCESS', datasetSize: 35000 },
];

const CANARY_DEPLOYMENTS_DATA = [
  { id: 'canary-01', activeModelVersion: '2.4.0', canaryModelVersion: '2.5.0-rc1', trafficSplitPercentCanary: 10, errorRateBaselinePct: 0.02, errorRateCanaryPct: 0.01, active: true },
];

const ML_ALERT_RULES_DATA = [
  { id: 'ml-alt-01', modelName: 'XGBoost Energy Forecaster', metric: 'MAE_DRIFT', threshold: 4.5, currentReading: 1.62, triggerAction: 'AUTO_NOTIFY_AND_QUEUE_RETRAIN', status: 'HEALTHY' },
  { id: 'ml-alt-02', modelName: 'FastAPI Microservice Gateway', metric: 'P99_LATENCY_MS', threshold: 350.0, currentReading: 118.0, triggerAction: 'SCALE_WORKER_POOL', status: 'HEALTHY' },
];

const LLM_ROUTING_RULES_DATA = [
  { id: 'llm-01', promptTaskCategory: 'ESG_COMPLIANCE_ANALYSIS', targetProvider: 'GEMINI', modelIdentifier: 'gemini-1.5-pro', tokenBudgetMonthly: 500000, currentTokensUsed: 142000, active: true },
  { id: 'llm-02', promptTaskCategory: 'STUDENT_OMNIBAR_FAST_QUERIES', targetProvider: 'GROQ', modelIdentifier: 'llama-3.3-70b-versatile', tokenBudgetMonthly: 1000000, currentTokensUsed: 310000, active: true },
];

/* =========================================================================
   9. ROLE 7: STUDENT ECO-PARTICIPANT (STUDENT) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const DIGITAL_TWIN_DORMS_DATA = [
  {
    id: 'dorm-room-304B',
    studentEmail: 'student@institution.org',
    dormBuilding: 'West Village Dormitory Quad - Hall B',
    roomNumber: '304-B',
    occupantCount: 2,
    livePowerWatts: 142.5,
    ambientTempC: 22.1,
    hvacEcoStatus: 'ACTIVE_ECO_SETBACK',
    smartPlugsActive: 3,
    lightingEfficiencyPct: 96.0,
    dailyKwhUsage: 4.8,
    dailyKwhSaved: 2.4,
    ecoStreakDays: 14,
    updatedAt: isoNow,
  }
];

const GEOFENCED_CHALLENGES_DATA = [
  {
    id: 'geo-ch-01',
    title: 'North Quad Reusable Mug Week',
    description: 'Use personal tumbler at all North Quad coffee kiosks to divert single-use cups.',
    geofenceSector: 'North Academic & Research Quad',
    pointsReward: 350,
    participantsJoined: 620,
    isJoinedByMaya: true,
    userProgressPct: 100,
    status: 'COMPLETED',
  },
  {
    id: 'geo-ch-02',
    title: 'Science Complex Stairway Sprint',
    description: 'Log stair climbs in Science Building B instead of using elevators.',
    geofenceSector: 'North Academic & Research Quad',
    pointsReward: 200,
    participantsJoined: 410,
    isJoinedByMaya: true,
    userProgressPct: 80,
    status: 'ACTIVE',
  },
  {
    id: 'geo-ch-03',
    title: 'West Village Dorm Nocturnal Vampire Load Purge',
    description: 'Turn off all power strips and charger bricks between 12 AM and 7 AM.',
    geofenceSector: 'West Village Dormitory Complex',
    pointsReward: 300,
    participantsJoined: 850,
    isJoinedByMaya: true,
    userProgressPct: 92,
    status: 'ACTIVE',
  }
];

const ACADEMIC_PROJECTS_DATA = [
  {
    id: 'proj-01',
    studentEmail: 'student@institution.org',
    title: 'Smart Campus Microgrid: SCIP MILP Optimization on Dorm Photovoltaic Arrays',
    abstract: 'Investigating Google OR-Tools MILP formulations to distribute campus solar battery storage during peak electricity tariff windows.',
    department: 'Environmental Engineering & CS',
    advisorName: 'Prof. Marcus Sterling',
    status: 'PUBLISHED_SHOWCASE',
    grade: 'A+',
    submittedAt: daysAgo(20),
  },
  {
    id: 'proj-02',
    studentEmail: 'student@institution.org',
    title: 'IoT Telemetry Anomaly Detection with IsolationForest in University Labs',
    abstract: 'Applying unsupervised anomaly detection to identify sub-meter water valve leaks and overnight lab equipment surges.',
    department: 'Environmental Engineering',
    advisorName: 'Dr. Eleanor Vance',
    status: 'IN_PROGRESS',
    grade: null,
    submittedAt: daysAgo(5),
  }
];

const COMMUNITY_DATAS_DATA = [
  {
    id: 'comm-01',
    authorEmail: 'student@institution.org',
    authorName: 'Maya Lin',
    title: 'Dorm Mini-Fridge Power Optimization Tips (Saved 18 kWh this month!)',
    content: 'Setting the mini-fridge dial from 5 to 3.5 kept everything perfectly cold while dropping daily draw from 1.2 kWh to 0.6 kWh.',
    likes: 48,
    commentsCount: 14,
    tags: ['dorm-tips', 'energy-saving', 'eco-points'],
    createdAt: daysAgo(12),
  },
  {
    id: 'comm-02',
    authorEmail: 'student.lead1@institution.org',
    authorName: 'Kai Tanaka',
    title: 'Campus Green Bike Share: Spring Semester Expansion',
    content: '15 new solar-charged e-bikes added to Science Quad charging station! 50 EcoPoints per commute ride.',
    likes: 62,
    commentsCount: 9,
    tags: ['green-transit', 'campus-commute'],
    createdAt: daysAgo(4),
  }
];

/* =========================================================================
   10. ROLE 8: HOUSEHOLD RESIDENT (HOUSEHOLD / USER) PERFORMED ACTIONS & ENTITIES
   ========================================================================= */
const HOUSEHOLDS_DIGITAL_TWIN_DATA = [
  {
    id: 'hh-101',
    version: '1.2.0',
    timestamp: new Date(daysAgo(30)),
    note: 'Primary single-family eco-residence with rooftop solar, smart battery, and heat pump HVAC.',
    houseSizeSqFt: 2400,
    occupants: 4,
    homeType: 'Single Family Residential',
    appliances: [
      'Variable-Speed Heat Pump HVAC',
      'Hybrid Heat Pump Water Heater',
      'Ecobee Smart Thermostat Premium',
      'Energy Star Inverter Refrigerator',
      'Level 2 EV Smart Charger',
      'Induction Cooktop Range'
    ],
    solarCapacityKw: 6.5,
    batteryCapacityKwh: 10.0,
    evCharger: true,
    heatPump: true,
    estAnnualEmissionsKg: 2150.0,
    estMonthlySavingsUSD: 142.50,
  }
];

const LINKED_DEVICES_DATA = [
  { id: 'dev-01', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Emporia Vue Gen 2 Whole Home Smart Meter', deviceType: 'ENERGY_MONITOR', status: 'ONLINE', protocol: 'MQTT_TLS', liveWatts: 420.0, updatedAt: isoNow },
  { id: 'dev-02', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Ecobee Smart Thermostat Pro', deviceType: 'HVAC_CONTROLLER', status: 'ONLINE', currentTempF: 71.0, targetTempF: 68.0, ecoMode: true, updatedAt: isoNow },
  { id: 'dev-03', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Tesla Wall Connector Gen 3', deviceType: 'EV_CHARGER', status: 'STANDBY_SCHEDULED', scheduledChargeTime: '01:00 AM - 05:00 AM', updatedAt: isoNow },
  { id: 'dev-04', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Enphase IQ Battery 10T', deviceType: 'BATTERY_STORAGE', status: 'ONLINE', stateOfChargePct: 88.5, discharging: false, updatedAt: isoNow },
];

const USER_GOALS_DATA = [
  { id: 'goal-01', userEmail: 'user@verdantiq.org', householdId: 'hh-101', title: 'Achieve 25% Monthly Grid Draw Reduction', targetValue: 25.0, currentValue: 21.4, unit: '%', category: 'ELECTRICITY', status: 'ON_TRACK', deadline: daysAgo(-15) },
  { id: 'goal-02', userEmail: 'user@verdantiq.org', householdId: 'hh-101', title: 'Zero Vampire Power Overnight (11 PM - 6 AM)', targetValue: 0.15, currentValue: 0.12, unit: 'kW', category: 'PHANTOM_LOAD', status: 'ACHIEVED', deadline: daysAgo(2) },
  { id: 'goal-03', userEmail: 'user@verdantiq.org', householdId: 'hh-101', title: '85% Solar Direct Self-Consumption', targetValue: 85.0, currentValue: 89.2, unit: '%', category: 'SOLAR_UTILIZATION', status: 'ACHIEVED', deadline: daysAgo(-30) },
];

const USER_REPORTS_DATA = [
  { id: 'rep-01', userEmail: 'user@verdantiq.org', householdId: 'hh-101', month: '2026-02', totalKwhSaved: 286.0, totalSavingsUSD: 89.20, carbonReducedKg: 152.4, environmentalGrade: 'A+', regionalPercentile: 94, generatedAt: daysAgo(16) },
  { id: 'rep-02', userEmail: 'user@verdantiq.org', householdId: 'hh-101', month: '2026-01', totalKwhSaved: 245.0, totalSavingsUSD: 78.50, carbonReducedKg: 132.8, environmentalGrade: 'A', regionalPercentile: 91, generatedAt: daysAgo(46) },
];

const REWARD_ITEMS_DATA = [
  { id: 'rew-01', title: 'Eco-Smart LED 4-Pack Voucher', category: 'HOME_EFFICIENCY', pointsCost: 500, stock: 150, sponsor: 'Regional Clean Power Alliance' },
  { id: 'rew-02', title: '$25 Organic Farmers Market Co-op Card', category: 'SUSTAINABLE_FOOD', pointsCost: 800, stock: 90, sponsor: 'Bay Area Sustainable Food Collective' },
  { id: 'rew-03', title: 'Residential Solar Battery Health Audit Credit', category: 'CLEAN_ENERGY', pointsCost: 1200, stock: 40, sponsor: 'VerdantIQ Certified Energy Services' },
  { id: 'rew-04', title: 'Campus Bookstore $15 Green Perks Certificate', category: 'STUDENT_CAMPUS', pointsCost: 400, stock: 200, sponsor: 'Pacific State University Bookstore' },
];

/* =========================================================================
   11. COMBINED ACTIVITY LOGS (Performed Actions for End Users & Roles)
   ========================================================================= */
const ACTIVITY_LOGS_DATA = [];

// Seed 30 days of performed activity logs for Maya Lin (Student)
for (let i = 30; i >= 1; i--) {
  const kwh = +(2.0 + Math.random() * 3.5).toFixed(2);
  const carbon = +(kwh * 0.42).toFixed(2);
  const usd = +(kwh * 0.22).toFixed(2);
  const points = Math.round(kwh * 15);
  const actions = [
    'Dorm Room Nocturnal HVAC Eco-Setback',
    'Campus Stairway Commute (Diverted Elevator)',
    'Cold Wash Laundry in Dorm Village',
    'Double-Sided Digital Note Taking',
    'Solar E-Bike Campus Commute'
  ];
  const chosenAction = actions[i % actions.length];

  ACTIVITY_LOGS_DATA.push({
    id: `act-stu-${31 - i}`,
    householdId: 'dorm-room-304B',
    tenantId: 'tenant_institution_org',
    userEmail: 'student@institution.org',
    actionName: chosenAction,
    timestamp: new Date(daysAgo(i)),
    kwhSaved: kwh,
    carbonKgSaved: carbon,
    savingsUSD: usd,
    ecoPointsEarned: points,
    type: 'student_action_verified',
  });
}

// Seed 30 days of performed activity logs for David & Sarah Chen (Household)
for (let i = 30; i >= 1; i--) {
  const kwh = +(6.5 + Math.random() * 8.0).toFixed(2);
  const carbon = +(kwh * 0.42).toFixed(2);
  const usd = +(kwh * 0.24).toFixed(2);
  const points = Math.round(kwh * 20);
  const actions = [
    'Smart Thermostat MILP SCIP Temperature Setback',
    'Off-Peak Level 2 EV Overnight Smart Charging (2 AM - 5 AM)',
    'Solar Battery Peak Load Shifting to Grid',
    'Heat Pump Water Heater Eco Mode Schedule',
    'Phantom Standby Power Purge via Smart Plugs'
  ];
  const chosenAction = actions[i % actions.length];

  ACTIVITY_LOGS_DATA.push({
    id: `act-hh-${31 - i}`,
    householdId: 'hh-101',
    tenantId: 'tenant_res_user',
    userEmail: 'user@verdantiq.org',
    actionName: chosenAction,
    timestamp: new Date(daysAgo(i)),
    kwhSaved: kwh,
    carbonKgSaved: carbon,
    savingsUSD: usd,
    ecoPointsEarned: points,
    type: 'optimization',
  });
}

/* =========================================================================
   12. IMMUTABLE AUDIT LOGS (AuditLogs Collection)
   ========================================================================= */
const AUDIT_LOGS_DATA = [
  {
    id: 'audit-core-01',
    uid: 'usr_sys_admin_01',
    userEmail: 'admin@verdantiq.io',
    userRole: 'ADMIN',
    tenantId: 'tenant_verdantiq_core',
    action: 'PLATFORM_SECURITY_INITIALIZED',
    resourceType: 'SECURITY_CONFIG',
    resourceId: 'SecurityConfig.java',
    details: 'Initialized Spring Security JWT filter chain with role hierarchy and TLS 1.3 enforcement',
    createdAt: new Date(daysAgo(180)),
  },
  {
    id: 'audit-core-02',
    uid: 'usr_region_auth_02',
    userEmail: 'region@tn.gov.in',
    userRole: 'REGION',
    tenantId: 'tenant_tn_district_board',
    action: 'REGIONAL_POLICY_CONFIGURED',
    resourceType: 'POLICY',
    resourceId: 'STATE-CAMPUS-2026-NETZERO',
    details: 'Configured mandatory 110.0 EUI benchmark standard for Bay Area North district universities',
    createdAt: new Date(daysAgo(60)),
  },
  {
    id: 'audit-core-03',
    uid: 'usr_inst_exec_03',
    userEmail: 'admin@institution.org',
    userRole: 'INSTITUTION',
    tenantId: 'tenant_institution_org',
    action: 'GEOFENCE_POLYGONS_UPDATED',
    resourceType: 'GEOFENCE',
    resourceId: 'geo-poly-01',
    details: 'Mapped North Academic Quad GPS vectors for automated student challenge verification',
    createdAt: new Date(daysAgo(30)),
  },
  {
    id: 'audit-core-04',
    uid: 'usr_dept_lead_04',
    userEmail: 'dept@institution.org',
    userRole: 'DEPT',
    tenantId: 'tenant_institution_org',
    action: 'STUDENT_PROOF_VERIFIED',
    resourceType: 'VERIFICATION_ITEM',
    resourceId: 'ver-01',
    details: 'Inspected and approved lab equipment shutdown proof submitted by Maya Lin; awarded 250 EcoPoints',
    createdAt: new Date(daysAgo(2)),
  },
  {
    id: 'audit-core-05',
    uid: 'usr_esg_auditor_05',
    userEmail: 'auditor@esg-verify.org',
    userRole: 'AUDIT',
    tenantId: 'tenant_institution_org',
    action: 'COMPLIANCE_SIGN_OFF',
    resourceType: 'ISO50001_REPORT',
    resourceId: 'iso50001-q1-2026',
    details: 'Digitally signed off on Pacific State University Q1 ISO 50001 energy baseline statement',
    createdAt: new Date(daysAgo(18)),
  },
  {
    id: 'audit-core-06',
    uid: 'usr_mlops_eng_06',
    userEmail: 'mlops@verdantiq.io',
    userRole: 'MLOPS',
    tenantId: 'tenant_verdantiq_core',
    action: 'MODEL_VERSION_DEPLOYED',
    resourceType: 'ML_MODEL',
    resourceId: 'xgboost-forecaster-v2.4',
    details: 'Promoted XGBoost v2.4 forecaster to active production registry pointer following canary validation',
    createdAt: new Date(daysAgo(8)),
  },
];

/* =========================================================================
   SEED RUNNER FUNCTION
   ========================================================================= */
async function seedAll(options = {}) {
  const { reset = true } = options;
  console.log('\n============================================================');
  console.log('🌱 VERDANTIQ ECOSPHERE - MULTI-ROLE DATA SEEDING ENGINE');
  console.log('============================================================\n');
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
  console.log(`Target Database: [${MONGODB_DB_NAME}]`);

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully.\n');
    const db = client.db(MONGODB_DB_NAME);

    const collectionsToSeed = [
      { name: 'users', data: USERS_DATA, idKey: 'email' },
      { name: 'institutions', data: INSTITUTIONS_DATA, idKey: 'id' },
      { name: 'rbacschemaroles', data: RBAC_SCHEMA_ROLES_DATA, idKey: 'id' },
      { name: 'ratelimitrules', data: RATE_LIMIT_RULES_DATA, idKey: 'id' },
      { name: 'systembroadcasts', data: SYSTEM_BROADCASTS_DATA, idKey: 'id' },
      { name: 'featureflags', data: FEATURE_FLAGS_DATA, idKey: 'id' },
      { name: 'accessgrants', data: ACCESS_GRANTS_DATA, idKey: 'id' },
      { name: 'admin_audit_logs', data: ADMIN_AUDIT_LOGS_DATA, idKey: 'id' },
      { name: 'domainoversightrecords', data: DOMAIN_OVERSIGHT_RECORDS_DATA, idKey: 'id' },
      { name: 'regionalpolicyconfigs', data: REGIONAL_POLICY_CONFIGS_DATA, idKey: 'id' },
      { name: 'regionalbenchmarks', data: REGIONAL_BENCHMARKS_DATA, idKey: 'id' },
      { name: 'growthtrenddatapoints', data: GROWTH_TREND_DATA_POINTS_DATA, idKey: 'id' },
      { name: 'sharedchallengetemplates', data: SHARED_CHALLENGE_TEMPLATES_DATA, idKey: 'id' },
      { name: 'tenantrequests', data: TENANT_REQUESTS_DATA, idKey: 'id' },
      { name: 'supporttickets', data: SUPPORT_TICKETS_DATA, idKey: 'id' },
      { name: 'geofencepolygons', data: GEOFENCE_POLYGONS_DATA, idKey: 'id' },
      { name: 'institutiondepartmentrecords', data: INSTITUTION_DEPARTMENT_RECORDS_DATA, idKey: 'id' },
      { name: 'executivereportschedules', data: EXECUTIVE_REPORT_SCHEDULES_DATA, idKey: 'id' },
      { name: 'accepteddomains', data: ACCEPTED_DOMAINS_DATA, idKey: 'id' },
      { name: 'challengeapprovalitems', data: CHALLENGE_APPROVAL_ITEMS_DATA, idKey: 'id' },
      { name: 'escalationresolutions', data: ESCALATION_RESOLUTIONS_DATA, idKey: 'id' },
      { name: 'subcohorts', data: SUB_COHORTS_DATA, idKey: 'id' },
      { name: 'studentregistryrecords', data: STUDENT_REGISTRY_RECORDS_DATA, idKey: 'id' },
      { name: 'verificationitems', data: VERIFICATION_ITEMS_DATA, idKey: 'id' },
      { name: 'deptchallengetemplates', data: DEPT_CHALLENGE_TEMPLATES_DATA, idKey: 'id' },
      { name: 'escalationcases', data: ESCALATION_CASES_DATA, idKey: 'id' },
      { name: 'auditrequests', data: AUDIT_REQUESTS_DATA, idKey: 'id' },
      { name: 'redactedauditlogs', data: REDACTED_AUDIT_LOGS_DATA, idKey: 'id' },
      { name: 'dataflownodes', data: DATA_FLOW_NODES_DATA, idKey: 'id' },
      { name: 'exportconfigs', data: EXPORT_CONFIGS_DATA, idKey: 'id' },
      { name: 'ml_models', data: ML_MODELS_DATA, idKey: 'id' },
      { name: 'retrain_schedules', data: RETRAIN_SCHEDULES_DATA, idKey: 'id' },
      { name: 'canary_deployments', data: CANARY_DEPLOYMENTS_DATA, idKey: 'id' },
      { name: 'ml_alert_rules', data: ML_ALERT_RULES_DATA, idKey: 'id' },
      { name: 'llm_routing_rules', data: LLM_ROUTING_RULES_DATA, idKey: 'id' },
      { name: 'digitaltwindorms', data: DIGITAL_TWIN_DORMS_DATA, idKey: 'id' },
      { name: 'geofencedchallenges', data: GEOFENCED_CHALLENGES_DATA, idKey: 'id' },
      { name: 'academicprojects', data: ACADEMIC_PROJECTS_DATA, idKey: 'id' },
      { name: 'communitydatas', data: COMMUNITY_DATAS_DATA, idKey: 'id' },
      { name: 'Households', data: HOUSEHOLDS_DIGITAL_TWIN_DATA, idKey: 'id' },
      { name: 'linkeddevices', data: LINKED_DEVICES_DATA, idKey: 'id' },
      { name: 'user_goals', data: USER_GOALS_DATA, idKey: 'id' },
      { name: 'user_reports', data: USER_REPORTS_DATA, idKey: 'id' },
      { name: 'reward_items', data: REWARD_ITEMS_DATA, idKey: 'id' },
      { name: 'activity_logs', data: ACTIVITY_LOGS_DATA, idKey: 'id' },
      { name: 'AuditLogs', data: AUDIT_LOGS_DATA, idKey: 'id' },
    ];

    console.log('🔄 Executing Seeding Cycle...\n');
    let totalRecordsSeeded = 0;

    for (const item of collectionsToSeed) {
      const col = db.collection(item.name);
      if (reset) {
        await col.deleteMany({});
      }
      if (item.data && item.data.length > 0) {
        await col.insertMany(item.data);
        totalRecordsSeeded += item.data.length;
        console.log(`  ✓ [${item.name.padEnd(28)}] -> Seeded ${item.data.length.toString().padStart(3)} records`);
      }
    }

    console.log('\n============================================================');
    console.log('✨ SEEDING SUMMARY: ALL 8 USER ROLES SUCCESSFULLY PROVISIONED');
    console.log('============================================================\n');

    console.log('┌────┬─────────────┬──────────────────────────┬───────────────────────┬────────────────────────┐');
    console.log('│ #  │ Role Code   │ User Email               │ Display Name          │ Organization / Scope   │');
    console.log('├────┼─────────────┼──────────────────────────┼───────────────────────┼────────────────────────┤');
    console.log('│ 1  │ ADMIN       │ admin@verdantiq.io       │ Alexander Vance       │ VerdantIQ Core System  │');
    console.log('│ 2  │ REGION      │ region@tn.gov.in         │ Dr. K. Senthil Nathan │ State District Board 1 │');
    console.log('│ 3  │ INSTITUTION │ admin@institution.org    │ Dr. Eleanor Vance     │ Pacific State Univ Sys │');
    console.log('│ 4  │ DEPT        │ dept@institution.org     │ Prof. Marcus Sterling │ Facility Science & CS  │');
    console.log('│ 5  │ AUDIT       │ auditor@esg-verify.org   │ Elena Rostova         │ External ESG Inspector │');
    console.log('│ 6  │ MLOPS       │ mlops@verdantiq.io       │ Tariq Al-Mansoor      │ Applied AI & MLOps     │');
    console.log('│ 7  │ STUDENT     │ student@institution.org  │ Maya Lin              │ West Village Dorm 304B │');
    console.log('│ 8  │ HOUSEHOLD   │ user@verdantiq.org       │ David & Sarah Chen    │ Eco-Residence hh-101   │');
    console.log('└────┴─────────────┴──────────────────────────┴───────────────────────┴────────────────────────┘');

    console.log(`\n🎉 Total Collections Processed: ${collectionsToSeed.length}`);
    console.log(`📊 Total Documents Inserted:   ${totalRecordsSeeded}`);
    console.log('\nAll 8 user accounts have active performed actions, audit records, and telemetry!');
    return { success: true, totalRecords: totalRecordsSeeded, collectionsCount: collectionsToSeed.length };
  } catch (error) {
    console.error('\n❌ Error during database seeding:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Allow CLI direct execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const reset = !args.includes('--no-reset');
  seedAll({ reset })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedAll, USERS_DATA, INSTITUTIONS_DATA, RBAC_SCHEMA_ROLES_DATA };
