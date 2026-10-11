export interface RegionalDistrict {
  id: string;
  name: string;
  hq: string;
  zone: 'North' | 'South' | 'West' | 'East' | 'Central';
  centerLatLong?: { lat: number; lng: number };
  institutionsCount: number;
  departmentsCount: number;
  studentsCount: number;
  standardHouseholdsCount: number;
  avgGridCarbon: number; // gCO2e/kWh
  renewableSharePct: number; // %
  complianceRatePct: number; // %
  governanceStatus: 'Optimal Governance' | 'High Performance' | 'Needs Support' | 'No Active Data';
  createdAt?: string;
}

// Default initial regional districts dynamically managed by Regional Admin
const INITIAL_REGIONAL_DISTRICTS: RegionalDistrict[] = [
  {
    id: 'dist-bay-north',
    name: 'District 1: Bay Area North',
    hq: 'San Francisco',
    zone: 'North',
    centerLatLong: { lat: 37.7749, lng: -122.4194 },
    institutionsCount: 8,
    departmentsCount: 32,
    studentsCount: 24500,
    standardHouseholdsCount: 142000,
    avgGridCarbon: 142.5,
    renewableSharePct: 62.4,
    complianceRatePct: 94.8,
    governanceStatus: 'High Performance',
    createdAt: '2025-01-15',
  },
  {
    id: 'dist-silicon-corridor',
    name: 'District 2: Silicon Corridor',
    hq: 'San Jose',
    zone: 'West',
    centerLatLong: { lat: 37.3382, lng: -121.8863 },
    institutionsCount: 12,
    departmentsCount: 48,
    studentsCount: 38200,
    standardHouseholdsCount: 210000,
    avgGridCarbon: 128.0,
    renewableSharePct: 68.2,
    complianceRatePct: 96.5,
    governanceStatus: 'Optimal Governance',
    createdAt: '2025-01-20',
  },
  {
    id: 'dist-northwest-coastal',
    name: 'District 3: Northwest Coastal',
    hq: 'Eureka',
    zone: 'North',
    centerLatLong: { lat: 40.8021, lng: -124.1637 },
    institutionsCount: 4,
    departmentsCount: 16,
    studentsCount: 11800,
    standardHouseholdsCount: 65000,
    avgGridCarbon: 165.2,
    renewableSharePct: 54.0,
    complianceRatePct: 88.4,
    governanceStatus: 'Needs Support',
    createdAt: '2025-02-01',
  },
  {
    id: 'dist-central-sierra',
    name: 'District 4: Central Sierra',
    hq: 'Fresno',
    zone: 'Central',
    centerLatLong: { lat: 36.7468, lng: -119.7726 },
    institutionsCount: 6,
    departmentsCount: 24,
    studentsCount: 19400,
    standardHouseholdsCount: 115000,
    avgGridCarbon: 152.0,
    renewableSharePct: 58.6,
    complianceRatePct: 91.2,
    governanceStatus: 'High Performance',
    createdAt: '2025-02-10',
  },
];

const STORAGE_KEY = 'verdantiq_regional_districts';

export const getRegionalDistricts = (): RegionalDistrict[] => {
  if (typeof window === 'undefined') return INITIAL_REGIONAL_DISTRICTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGIONAL_DISTRICTS));
      return INITIAL_REGIONAL_DISTRICTS;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REGIONAL_DISTRICTS;
  } catch {
    return INITIAL_REGIONAL_DISTRICTS;
  }
};

export const saveRegionalDistricts = (districts: RegionalDistrict[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(districts));
  } catch {
    // ignore
  }
};

export const addRegionalDistrict = (
  data: Omit<RegionalDistrict, 'id' | 'createdAt'>
): RegionalDistrict => {
  const current = getRegionalDistricts();
  const newDistrict: RegionalDistrict = {
    ...data,
    id: `dist-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newDistrict, ...current];
  saveRegionalDistricts(updated);
  return newDistrict;
};

export const updateRegionalDistrict = (
  id: string,
  updates: Partial<RegionalDistrict>
): RegionalDistrict[] => {
  const current = getRegionalDistricts();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveRegionalDistricts(updated);
  return updated;
};

export const deleteRegionalDistrict = (id: string): RegionalDistrict[] => {
  const current = getRegionalDistricts();
  const updated = current.filter((item) => item.id !== id);
  saveRegionalDistricts(updated);
  return updated;
};

// Backward-compatibility exports so older type imports compile cleanly
export type TamilNaduDistrict = RegionalDistrict;

export const TAMIL_NADU_DISTRICTS: RegionalDistrict[] = INITIAL_REGIONAL_DISTRICTS;

export const SYSTEM_ROLE_HIERARCHY_EXPLANATION = {
  title: 'VerdantIQ 8-Tier Governance Architecture',
  levels: [
    {
      level: 1,
      role: 'admin',
      name: 'Platform Admin',
      description: 'Top-tier global governance, system telemetry, cross-tenant security, RBAC schemas & database authority.',
    },
    {
      level: 2,
      role: 'mlops',
      name: 'ML Operations Admin',
      description: 'AI model registry, inference pipeline monitoring, MILP optimizer weights, data drift telemetry & feature store.',
    },
    {
      level: 3,
      role: 'audit',
      name: 'Auditor / Researcher',
      description: 'Read-only immutable audit trail access, compliance verification, redacted logs & scientific data lineage exports.',
    },
    {
      level: 4,
      role: 'region',
      name: 'Regional Admin (District Governance)',
      description: 'Governs regional districts and regional microgrids dynamically created by Regional Admin. Governs two primary downstream branches: (1) Educational Institutions and (2) Standard Household Citizens.',
      subBranches: [
        'Educational Institution Branch (Institution -> Department -> Student)',
        'Standard Household / Citizen Branch (Direct Residential District Microgrid Governance)',
      ],
    },
    {
      level: 5,
      role: 'institution',
      name: 'Institution Admin',
      description: 'University/College campus ESG reporting, capital energy projects, departmental oversight & student programs.',
    },
    {
      level: 6,
      role: 'dept',
      name: 'Department Admin / Moderator',
      description: 'Building HVAC scheduling, local carbon budget triage, department energy metrics & student account verification.',
    },
    {
      level: 7,
      role: 'student',
      name: 'Student User',
      description: 'Campus sustainability participant, dorm digital twin, academic eco-challenges & student cohort leaderboards.',
    },
    {
      level: 8,
      role: 'user',
      name: 'Standard User / Household',
      description: 'Individual residential citizen governed directly by the Regional District Admin for eco-footprint tracking & smart home energy.',
    },
  ],
};
