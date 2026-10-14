
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  tenantId: string;
  institution?: string;
  institutionId?: string;
  department?: string;
  isVerifiedStudent?: boolean;
  avatarUrl?: string;
  createdAt: string;
  provider?: 'email' | 'google' | 'outlook' | 'dev_mock';
  dbClaims?: {
    isPlatformAuthority: boolean;
    crossTenantRawDataGranted: boolean;
  };
}

export type RoleType =
  | 'admin'
  | 'mlops'
  | 'audit'
  | 'region'
  | 'institution'
  | 'dept'
  | 'student'
  | 'user';

export const ROLE_HIERARCHY_ORDER: RoleType[] = [
  'admin',
  'mlops',
  'audit',
  'region',
  'institution',
  'dept',
  'student',
  'user',
];

export interface RoleConfig {
  id: RoleType;
  label: string;
  dashboardPath: string;
  description: string;
  badgeColor: 'emerald' | 'amber' | 'coral' | 'stone' | 'neutral';
  permissions: string[];
  requiredDomainNotice?: string;
  hierarchyLevel: number;
}

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  admin: {
    id: 'admin',
    label: 'Platform Admin',
    dashboardPath: '/admin-dashboard',
    description: 'Tier 1 Global Governance: System health monitoring, RBAC schema, global audit logs & cross-tenant platform administration.',
    badgeColor: 'coral',
    permissions: ['manage:users', 'manage:system-roles', 'view:global-logs', 'configure:integrations'],
    requiredDomainNotice: 'Platform Corporate Domain',
    hierarchyLevel: 1,
  },
  mlops: {
    id: 'mlops',
    label: 'ML Ops Admin',
    dashboardPath: '/mlops-dashboard',
    description: 'Tier 2 AI Infrastructure: Predictive model registry, HVAC solver weights, inference pipelines, drift alerts & feature store.',
    badgeColor: 'amber',
    permissions: ['manage:ml-models', 'view:inference-telemetry', 'retrain:pipelines', 'manage:feature-store'],
    requiredDomainNotice: 'ML Operations / Engineering Domain',
    hierarchyLevel: 2,
  },
  audit: {
    id: 'audit',
    label: 'Auditor / Researcher',
    dashboardPath: '/audit-dashboard',
    description: 'Tier 3 Independent Compliance: Read-only immutable audit trail access, carbon protocol verification & scientific data exports.',
    badgeColor: 'stone',
    permissions: ['export:raw-telemetry', 'verify:carbon-claims', 'view:immutable-logs'],
    requiredDomainNotice: 'Auditing Agency / Research Institute Domain',
    hierarchyLevel: 3,
  },
  region: {
    id: 'region',
    label: 'Regional Admin',
    dashboardPath: '/region/dashboard',
    description: 'Tier 4 Regional District Governance: Regional authority governing 2 branches: (1) Educational Institutions & (2) Standard Household Citizens.',
    badgeColor: 'emerald',
    permissions: ['view:multi-campus', 'benchmark:regional-grids', 'publish:regional-targets', 'govern:districts', 'manage:households'],
    requiredDomainNotice: 'Regional Board or State Government Email Domain',
    hierarchyLevel: 4,
  },
  institution: {
    id: 'institution',
    label: 'Institution Admin',
    dashboardPath: '/institution/dashboard',
    description: "Tier 5 Institution Admin: Enters or imports the institution's total electricity consumption, electricity bills, and campus sustainability targets.",
    badgeColor: 'emerald',
    permissions: [
      'manage:institution-esg',
      'import:electricity-bills',
      'manage:electricity-consumption',
      'manage:campus-sustainability-targets',
      'allocate:capital-funds',
      'export:compliance-data'
    ],
    requiredDomainNotice: 'Requires Institutional Educational Domain (.edu, institution.org, etc.)',
    hierarchyLevel: 5,
  },
  dept: {
    id: 'dept',
    label: 'Department Moderator',
    dashboardPath: '/dept/dashboard',
    description: 'Tier 6 Department Moderator: Manages local HVAC schedules, equipment usage, energy-wasting alerts, and student EcoPoint verification. No department-wise electricity data entry.',
    badgeColor: 'amber',
    permissions: [
      'manage:dept-schedules',
      'manage:equipment-usage',
      'triage:dept-alerts',
      'verify:ecopoints',
      'approve:local-budgets'
    ],
    requiredDomainNotice: 'Department or Organizational Email Domain',
    hierarchyLevel: 6,
  },
  student: {
    id: 'student',
    label: 'Student',
    dashboardPath: '/student/dashboard',
    description: 'Tier 7 Student: Participates in eco-challenges, submits proof of sustainable actions, and views permitted campus sustainability information.',
    badgeColor: 'emerald',
    permissions: [
      'view:campus-metrics',
      'participate:eco-challenges',
      'submit:sustainability-proof',
      'join:initiatives'
    ],
    requiredDomainNotice: 'Requires Educational Domain (.edu, .ac.uk, institution.org, etc.)',
    hierarchyLevel: 7,
  },
  user: {
    id: 'user',
    label: 'Standard User (Household)',
    dashboardPath: '/user/dashboard',
    description: 'Tier 8 Standard User / Household: Manages their own household electricity consumption independently of the institution.',
    badgeColor: 'stone',
    permissions: [
      'view:personal-metrics',
      'manage:household-consumption',
      'submit:eco-suggestions',
      'view:public-reports'
    ],
    requiredDomainNotice: 'Open to all personal or corporate email domains',
    hierarchyLevel: 8,
  },
};
export const SESSION_COOKIE_NAME = 'verdantiq_session';

export interface StoredSession {
  token: string;
  role: RoleType;
  email: string;
  userId: string;
  provider?: string;
}
