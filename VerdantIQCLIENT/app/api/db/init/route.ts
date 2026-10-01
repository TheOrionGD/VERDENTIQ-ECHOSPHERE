import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

const INITIAL_INSTITUTIONS_SEED = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_8_USERS_SEED = [
  {
    id: 'usr_sys_admin_01',
    name: 'Alexander Vance',
    email: 'admin@verdantiq.io',
    role: 'admin',
    tenantId: 'tenant_verdantiq_core',
    department: 'Infrastructure & Platform Security',
    institution: 'VerdantIQ Global Platform Core',
    passwordHash: '$2a$10$VerdantIQPlatformAdminSecureHash2026!',
    isVerified: true,
    provider: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_region_auth_02',
    name: 'Dr. K. Senthil Nathan',
    email: 'region@tn.gov.in',
    role: 'region',
    tenantId: 'tenant_tn_district_board',
    department: 'Regional Environmental Protection Board',
    institution: 'Regional Sustainability Council - District 1',
    passwordHash: '$2a$10$VerdantIQRegionSecureHash2026!',
    isVerified: true,
    provider: 'outlook',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_inst_exec_03',
    name: 'Dr. Eleanor Vance',
    email: 'admin@institution.org',
    role: 'institution',
    tenantId: 'tenant_institution_org',
    department: 'Office of the Vice Chancellor',
    institution: 'Pacific State University System',
    passwordHash: '$2a$10$VerdantIQInstSecureHash2026!',
    isVerified: true,
    provider: 'google',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_dept_lead_04',
    name: 'Prof. Marcus Sterling',
    email: 'dept@institution.org',
    role: 'dept',
    tenantId: 'tenant_institution_org',
    department: 'Facility Science & CS Labs',
    institution: 'Pacific State University System',
    passwordHash: '$2a$10$VerdantIQDeptSecureHash2026!',
    isVerified: true,
    provider: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_esg_auditor_05',
    name: 'Elena Rostova',
    email: 'auditor@esg-verify.org',
    role: 'audit',
    tenantId: 'tenant_institution_org',
    department: 'External ESG Verification Directorate',
    institution: 'Pacific State University System (Scope Audit)',
    passwordHash: '$2a$10$VerdantIQAuditSecureHash2026!',
    isVerified: true,
    provider: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_mlops_eng_06',
    name: 'Tariq Al-Mansoor',
    email: 'mlops@verdantiq.io',
    role: 'mlops',
    tenantId: 'tenant_verdantiq_core',
    department: 'Applied AI & ML Systems',
    institution: 'VerdantIQ Global Platform Core',
    passwordHash: '$2a$10$VerdantIQMlopsSecureHash2026!',
    isVerified: true,
    provider: 'google',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_student_07',
    name: 'Maya Lin',
    email: 'student@institution.org',
    role: 'student',
    tenantId: 'tenant_institution_org',
    department: 'Environmental Engineering',
    institution: 'Pacific State University System',
    isVerifiedStudent: true,
    isVerified: true,
    dormId: 'dorm-room-304B',
    passwordHash: '$2a$10$VerdantIQStudentSecureHash2026!',
    provider: 'google',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_household_08',
    name: 'David & Sarah Chen',
    email: 'user@verdantiq.org',
    role: 'user',
    tenantId: 'tenant_res_user',
    department: 'Residential Sector',
    institution: 'Independent Eco-Household',
    isVerified: true,
    householdId: 'hh-101',
    passwordHash: '$2a$10$VerdantIQUserSecureHash2026!',
    provider: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'MongoDB connection string pending; in-memory database simulation active.',
        seeded: false,
      });
    }

    const instCol = db.collection('institutions');
    const instCount = await instCol.countDocuments();
    if (instCount === 0) {
      await instCol.insertMany(INITIAL_INSTITUTIONS_SEED);
    }

    const userCol = db.collection('users');
    const userCount = await userCol.countDocuments();
    if (userCount === 0) {
      await userCol.insertMany(INITIAL_8_USERS_SEED);
    } else {
      // Ensure all 8 personas exist
      for (const u of INITIAL_8_USERS_SEED) {
        const exists = await userCol.findOne({ email: u.email });
        if (!exists) {
          await userCol.insertOne(u);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized and all 8 user roles verified in MongoDB.',
      institutionsCount: await instCol.countDocuments(),
      usersCount: await userCol.countDocuments(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database init error' }, { status: 500 });
  }
}
