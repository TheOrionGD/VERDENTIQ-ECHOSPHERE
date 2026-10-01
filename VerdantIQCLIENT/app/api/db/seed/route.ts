import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// Helper date functions
const now = new Date();
const isoNow = now.toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

/* 1. All 8 Personas */
const ALL_8_USERS = [
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
    createdAt: daysAgo(30),
    updatedAt: isoNow,
  }
];

const SEED_DATA_MAP: Record<string, any[]> = {
  users: ALL_8_USERS,
  institutions: [
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
    }
  ],
  rbacschemaroles: [
    { id: 'rbac-admin', roleName: 'ADMIN', displayName: 'System Administrator', permissions: ['GLOBAL_USER_MGMT', 'RBAC_CONFIG', 'RATE_LIMIT_OVERRIDE', 'SYSTEM_BROADCAST', 'AUDIT_LOG_VIEW_FULL', 'TENANT_PROVISION', 'KEY_ROTATION', 'FEATURE_FLAG_EDIT'], createdAt: daysAgo(180) },
    { id: 'rbac-region', roleName: 'REGION', displayName: 'Regional Authority', permissions: ['REGION_DASHBOARD', 'DOMAIN_OVERSIGHT', 'STATE_AGGREGATION', 'BENCHMARK_CONFIG', 'TENANT_APPROVAL', 'SUPPORT_TICKET_MGMT'], createdAt: daysAgo(180) },
    { id: 'rbac-institution', roleName: 'INSTITUTION', displayName: 'Institutional Executive', permissions: ['INST_DASHBOARD', 'GEOFENCE_CONFIG', 'DEPT_AGGREGATION', 'EXECUTIVE_REPORT_SCHEDULE', 'DOMAIN_WHITELIST', 'CHALLENGE_APPROVAL'], createdAt: daysAgo(180) },
    { id: 'rbac-dept', roleName: 'DEPT', displayName: 'Department Lead', permissions: ['DEPT_DASHBOARD', 'SUBCOHORT_MGMT', 'PROOF_VERIFICATION', 'DEPT_CHALLENGE_BUILD', 'TRIGGER_SETTINGS', 'STUDENT_ONBOARDING'], createdAt: daysAgo(180) },
    { id: 'rbac-audit', roleName: 'AUDIT', displayName: 'ESG Auditor', permissions: ['AUDIT_OVERVIEW', 'REDACTED_LOG_INSPECT', 'DATA_LINEAGE_VIEW', 'AUDIT_REQUEST_CREATE', 'OCR_VERIFICATION', 'COMPLIANCE_SIGN_OFF'], createdAt: daysAgo(180) },
    { id: 'rbac-mlops', roleName: 'MLOPS', displayName: 'MLOps Engineer', permissions: ['MODEL_REGISTRY_VIEW', 'MODEL_ROLLBACK_EXEC', 'MILP_WEIGHTS_TUNE', 'RETRAIN_SCHEDULE_MGMT', 'CANARY_SPLIT_CONFIG', 'EXPERIMENT_TRACK'], createdAt: daysAgo(180) },
    { id: 'rbac-student', roleName: 'STUDENT', displayName: 'Student Eco-Participant', permissions: ['STUDENT_DASHBOARD', 'DORM_TWIN_VIEW', 'CHALLENGE_JOIN', 'ACTION_PROOF_SUBMIT', 'REWARD_REDEEM', 'PROJECT_SUBMIT'], createdAt: daysAgo(180) },
    { id: 'rbac-household', roleName: 'HOUSEHOLD', displayName: 'Household Resident', permissions: ['HOUSEHOLD_DASHBOARD', 'UTILITY_LOG_SUBMIT', 'MILP_OPTIMIZE_RUN', 'OCR_BILL_UPLOAD', 'DEVICE_LINK', 'GOAL_SET'], createdAt: daysAgo(180) }
  ],
  ratelimitrules: [
    { id: 'rate-01', endpointPattern: '/api/v1/forecast/**', limitPerMinute: 60, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
    { id: 'rate-02', endpointPattern: '/api/v1/anomaly/**', limitPerMinute: 120, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
    { id: 'rate-03', endpointPattern: '/api/v1/optimize/**', limitPerMinute: 30, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
    { id: 'rate-04', endpointPattern: '/api/v1/ocr/**', limitPerMinute: 20, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
    { id: 'rate-05', endpointPattern: '/api/auth/login', limitPerMinute: 10, tenantScope: 'all', enabled: true, updatedAt: daysAgo(10) },
  ],
  systembroadcasts: [
    { id: 'bcast-01', title: 'Spring 2026 Regional Eco-Challenge Active', message: 'The Inter-Campus Net-Zero Spring Challenge is live across all registered universities.', severity: 'INFO', targetAudience: 'ALL_USERS', active: true, publishedBy: 'admin@verdantiq.io', createdAt: daysAgo(5) },
    { id: 'bcast-02', title: 'Regional Power Grid Peak Strain Advisory', message: 'Regional grid operator has declared high demand. Campus chillers set to Eco-Mode.', severity: 'WARNING', targetAudience: 'INSTITUTION_DEPT_HOUSEHOLD', active: true, publishedBy: 'admin@verdantiq.io', createdAt: hoursAgo(6) },
  ],
  featureflags: [
    { id: 'flag-xgboost-v2', key: 'enable_xgboost_forecast_v2', enabled: true, description: 'Enable XGBoost v2.4 30-day consumption forecasting', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(8) },
    { id: 'flag-canary-split', key: 'canary_traffic_split', enabled: true, description: 'Route 10% of ML inference traffic to canary forecaster', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(5) },
    { id: 'flag-iso50001', key: 'esg_iso50001_compliance', enabled: true, description: 'Activate automated ISO 50001 Energy Performance Indicator audits', modifiedBy: 'admin@verdantiq.io', updatedAt: daysAgo(14) },
  ],
  domainoversightrecords: [
    { id: 'dom-01', institutionId: 'inst-01', domainName: 'institution.org', institutionName: 'Pacific State University System', regionDistrict: 'District 1 (Bay Area North)', studentCount: 24500, activeEUI: 112.4, targetEUI: 110.0, complianceStatus: 'COMPLIANT', carbonFactor: 0.42, updatedAt: daysAgo(1) },
    { id: 'dom-02', institutionId: 'inst-02', domainName: 'pacific.edu', institutionName: 'Pacific State University - East Campus', regionDistrict: 'District 1 (Bay Area North)', studentCount: 18200, activeEUI: 108.2, targetEUI: 105.0, complianceStatus: 'COMPLIANT', carbonFactor: 0.42, updatedAt: daysAgo(1) },
  ],
  geofencepolygons: [
    { id: 'geo-poly-01', institutionId: 'inst-01', sectorName: 'North Academic & Research Quad', coordinates: [{ lat: 37.7755, lng: -122.4210 }, { lat: 37.7765, lng: -122.4185 }, { lat: 37.7745, lng: -122.4170 }, { lat: 37.7735, lng: -122.4195 }], zoneType: 'ACADEMIC_LABS', euiTarget: 115.0, isActive: true },
    { id: 'geo-poly-02', institutionId: 'inst-01', sectorName: 'West Village Dormitory Complex', coordinates: [{ lat: 37.7725, lng: -122.4220 }, { lat: 37.7738, lng: -122.4200 }, { lat: 37.7718, lng: -122.4180 }, { lat: 37.7705, lng: -122.4205 }], zoneType: 'RESIDENTIAL_DORMS', euiTarget: 85.0, isActive: true }
  ],
  subcohorts: [
    { id: 'cohort-01', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', cohortName: 'High-Performance Computing Lab Squad', leaderEmail: 'student.lead1@institution.org', memberCount: 28, weeklyKwhTarget: 450.0, currentKwhScore: 380.0 },
    { id: 'cohort-02', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', cohortName: 'Green Dorm Floor 3 Eco-Squad', leaderEmail: 'student@institution.org', memberCount: 34, weeklyKwhTarget: 600.0, currentKwhScore: 490.0 }
  ],
  verificationitems: [
    { id: 'ver-01', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', studentEmail: 'student@institution.org', studentName: 'Maya Lin', actionType: 'LAB_EQUIPMENT_POWER_DOWN', description: 'Shutdown 12 idle GPU simulation workstations overnight on Friday', calculatedKwh: 36.0, pointsAwarded: 250, status: 'APPROVED', reviewedBy: 'dept@institution.org', reviewedAt: daysAgo(2) },
    { id: 'ver-02', deptId: 'dept-cs-01', tenantId: 'tenant_institution_org', studentEmail: 'student@institution.org', studentName: 'Maya Lin', actionType: 'STAIRWELL_COMMUTE_WEEK', description: 'Logged 45 floors of stairs instead of elevator across Science Complex', calculatedKwh: 12.5, pointsAwarded: 120, status: 'APPROVED', reviewedBy: 'dept@institution.org', reviewedAt: daysAgo(5) }
  ],
  digitaltwindorms: [
    { id: 'dorm-room-304B', studentEmail: 'student@institution.org', dormBuilding: 'West Village Dormitory Quad - Hall B', roomNumber: '304-B', occupantCount: 2, livePowerWatts: 142.5, ambientTempC: 22.1, hvacEcoStatus: 'ACTIVE_ECO_SETBACK', dailyKwhUsage: 4.8, dailyKwhSaved: 2.4, ecoStreakDays: 14, updatedAt: isoNow }
  ],
  geofencedchallenges: [
    { id: 'geo-ch-01', title: 'North Quad Reusable Mug Week', description: 'Use personal tumbler at North Quad kiosks to divert single-use cups.', geofenceSector: 'North Academic & Research Quad', pointsReward: 350, participantsJoined: 620, isJoinedByMaya: true, userProgressPct: 100, status: 'COMPLETED' },
    { id: 'geo-ch-02', title: 'Science Complex Stairway Sprint', description: 'Log stair climbs in Science Building B instead of using elevators.', geofenceSector: 'North Academic & Research Quad', pointsReward: 200, participantsJoined: 410, isJoinedByMaya: true, userProgressPct: 80, status: 'ACTIVE' }
  ],
  academicprojects: [
    { id: 'proj-01', studentEmail: 'student@institution.org', title: 'Smart Campus Microgrid: SCIP MILP Optimization on Dorm Photovoltaic Arrays', abstract: 'Investigating Google OR-Tools MILP formulations to distribute campus solar battery storage.', department: 'Environmental Engineering & CS', advisorName: 'Prof. Marcus Sterling', status: 'PUBLISHED_SHOWCASE', grade: 'A+', submittedAt: daysAgo(20) }
  ],
  Households: [
    { id: 'hh-101', version: '1.2.0', note: 'Primary single-family eco-residence with rooftop solar, smart battery, and heat pump HVAC.', houseSizeSqFt: 2400, occupants: 4, homeType: 'Single Family Residential', appliances: ['Heat Pump HVAC', 'Heat Pump Water Heater', 'Smart Thermostat', 'Level 2 EV Smart Charger'], solarCapacityKw: 6.5, batteryCapacityKwh: 10.0, evCharger: true, heatPump: true, estAnnualEmissionsKg: 2150.0, estMonthlySavingsUSD: 142.50 }
  ],
  linkeddevices: [
    { id: 'dev-01', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Emporia Vue Gen 2 Whole Home Smart Meter', deviceType: 'ENERGY_MONITOR', status: 'ONLINE', liveWatts: 420.0, updatedAt: isoNow },
    { id: 'dev-02', householdId: 'hh-101', userEmail: 'user@verdantiq.org', deviceName: 'Ecobee Smart Thermostat Pro', deviceType: 'HVAC_CONTROLLER', status: 'ONLINE', currentTempF: 71.0, targetTempF: 68.0, ecoMode: true, updatedAt: isoNow }
  ],
  user_goals: [
    { id: 'goal-01', userEmail: 'user@verdantiq.org', householdId: 'hh-101', title: 'Achieve 25% Monthly Grid Draw Reduction', targetValue: 25.0, currentValue: 21.4, unit: '%', status: 'ON_TRACK', deadline: daysAgo(-15) },
    { id: 'goal-02', userEmail: 'user@verdantiq.org', householdId: 'hh-101', title: 'Zero Vampire Power Overnight (11 PM - 6 AM)', targetValue: 0.15, currentValue: 0.12, unit: 'kW', status: 'ACHIEVED', deadline: daysAgo(2) }
  ],
  user_reports: [
    { id: 'rep-01', userEmail: 'user@verdantiq.org', householdId: 'hh-101', month: '2026-02', totalKwhSaved: 286.0, totalSavingsUSD: 89.20, carbonReducedKg: 152.4, environmentalGrade: 'A+', generatedAt: daysAgo(16) }
  ],
  reward_items: [
    { id: 'rew-01', title: 'Eco-Smart LED 4-Pack Voucher', category: 'HOME_EFFICIENCY', pointsCost: 500, stock: 150, sponsor: 'Regional Clean Power Alliance' },
    { id: 'rew-02', title: '$25 Organic Farmers Market Co-op Card', category: 'SUSTAINABLE_FOOD', pointsCost: 800, stock: 90, sponsor: 'Bay Area Sustainable Food Collective' }
  ],
  ml_models: [
    { id: 'ml-mod-01', modelName: 'XGBoost Energy Forecaster', version: '2.4.0', status: 'ACTIVE_PRODUCTION', rmse: 2.14, mae: 1.62, r2Score: 0.962, trainedAt: daysAgo(8) },
    { id: 'ml-mod-02', modelName: 'IsolationForest Anomaly Detector', version: '1.8.2', status: 'ACTIVE_PRODUCTION', contaminationRate: 0.05, f1Score: 0.941, trainedAt: daysAgo(14) }
  ],
  activity_logs: [
    { id: 'act-stu-01', householdId: 'dorm-room-304B', tenantId: 'tenant_institution_org', userEmail: 'student@institution.org', actionName: 'Dorm Room Nocturnal HVAC Eco-Setback', timestamp: new Date(daysAgo(1)), kwhSaved: 3.5, carbonKgSaved: 1.47, savingsUSD: 0.77, ecoPointsEarned: 52, type: 'student_action_verified' },
    { id: 'act-hh-01', householdId: 'hh-101', tenantId: 'tenant_res_user', userEmail: 'user@verdantiq.org', actionName: 'Smart Thermostat MILP SCIP Temperature Setback', timestamp: new Date(daysAgo(1)), kwhSaved: 11.2, carbonKgSaved: 4.7, savingsUSD: 2.68, ecoPointsEarned: 224, type: 'optimization' }
  ],
  AuditLogs: [
    { id: 'audit-core-01', uid: 'usr_sys_admin_01', userEmail: 'admin@verdantiq.io', userRole: 'ADMIN', tenantId: 'tenant_verdantiq_core', action: 'PLATFORM_SECURITY_INITIALIZED', resourceType: 'SECURITY_CONFIG', resourceId: 'SecurityConfig.java', details: 'Initialized Spring Security JWT filter chain with role hierarchy', createdAt: new Date(daysAgo(180)) },
    { id: 'audit-core-04', uid: 'usr_dept_lead_04', userEmail: 'dept@institution.org', userRole: 'DEPT', tenantId: 'tenant_institution_org', action: 'STUDENT_PROOF_VERIFIED', resourceType: 'VERIFICATION_ITEM', resourceId: 'ver-01', details: 'Approved lab shutdown proof; awarded 250 EcoPoints', createdAt: new Date(daysAgo(2)) }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const reset = body.reset !== false;
    const db = await getMongoDb();

    if (!db) {
      return NextResponse.json({
        success: false,
        message: 'MongoDB connection not configured or reachable.',
      }, { status: 503 });
    }

    const report: Record<string, number> = {};

    for (const [colName, items] of Object.entries(SEED_DATA_MAP)) {
      const col = db.collection(colName);
      if (reset) {
        await col.deleteMany({});
      }
      if (items.length > 0) {
        await col.insertMany(items);
        report[colName] = items.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All 8 user roles and performed actions seeded successfully.',
      report,
      seededRoles: [
        { role: 'ADMIN', email: 'admin@verdantiq.io', name: 'Alexander Vance' },
        { role: 'REGION', email: 'region@tn.gov.in', name: 'Dr. K. Senthil Nathan' },
        { role: 'INSTITUTION', email: 'admin@institution.org', name: 'Dr. Eleanor Vance' },
        { role: 'DEPT', email: 'dept@institution.org', name: 'Prof. Marcus Sterling' },
        { role: 'AUDIT', email: 'auditor@esg-verify.org', name: 'Elena Rostova' },
        { role: 'MLOPS', email: 'mlops@verdantiq.io', name: 'Tariq Al-Mansoor' },
        { role: 'STUDENT', email: 'student@institution.org', name: 'Maya Lin' },
        { role: 'HOUSEHOLD', email: 'user@verdantiq.org', name: 'David & Sarah Chen' }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Seeding failure' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
