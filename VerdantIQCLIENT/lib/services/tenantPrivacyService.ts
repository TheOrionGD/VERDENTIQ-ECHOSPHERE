import { RoleType } from './authService';

export interface FirebaseCustomClaims {
  userId: string;
  role: RoleType;
  tenantId: string;
  isPlatformAuthority: boolean; // true for dept, institution, region, admin, mlops, audit
  crossTenantRawDataGranted?: boolean; // false by default; requires explicit audit override grant
  grantId?: string;
  grantExpiresAt?: string;
}

export interface AccessCheckRequest {
  requestingRole: RoleType;
  requestingTenantId: string;
  targetTenantId: string;
  isRawPersonalDataRequested: boolean;
  claims: FirebaseCustomClaims;
}

export interface AccessCheckResult {
  allowed: boolean;
  statusCode: 200 | 403;
  reason: string;
  enforcementLayer: 'Firebase Custom-Claims Check' | 'MongoDB Query Layer' | 'Tenant Scope Guard';
  sanitizationApplied?: string[];
  mongoQueryProjection?: Record<string, number>;
  mongoAggregationFilter?: Record<string, unknown>;
}

export interface RawPersonalDataField {
  field: string;
  description: string;
  actionOnCrossTenantQuery: 'STRIPPED_BY_PROJECTION' | 'ANONYMIZED_K_ANONYMITY' | 'BLOCKED';
}

export const RAW_PERSONAL_DATA_FIELDS: RawPersonalDataField[] = [
  { field: 'email', description: 'User personal email address', actionOnCrossTenantQuery: 'STRIPPED_BY_PROJECTION' },
  { field: 'fullName', description: 'Student / User full real name', actionOnCrossTenantQuery: 'STRIPPED_BY_PROJECTION' },
  { field: 'exactAddress', description: 'Residential address / dorm room number', actionOnCrossTenantQuery: 'STRIPPED_BY_PROJECTION' },
  { field: 'rawGpsCoordinate', description: 'Exact GPS location lat/long', actionOnCrossTenantQuery: 'ANONYMIZED_K_ANONYMITY' },
  { field: 'rawMeterReadings', description: 'Sub-second individual appliance wattage', actionOnCrossTenantQuery: 'ANONYMIZED_K_ANONYMITY' },
  { field: 'creditCardHash', description: 'Payment method tokens', actionOnCrossTenantQuery: 'BLOCKED' },
];

export const ELEVATED_AUTHORITY_ROLES: RoleType[] = [
  'dept',
  'institution',
  'region',
  'admin',
  'mlops',
  'audit',
];
