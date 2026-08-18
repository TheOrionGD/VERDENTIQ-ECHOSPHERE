export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  domain: string;
  regionDistrict: string;
  lat: number;
  lng: number;
  status: 'active' | 'onboarding' | 'needs_support' | 'deactivated';
  studentCount: number;
  deptCount: number;
  currentEUI: number; // kBtu / sq ft
  targetEUI: number;
  carbonIntensity: number; // gCO2e / kWh
  targetCarbonIntensity: number;
  forecastAccuracyPct: number; // e.g. 94.2%
  forecastErrorMapePct: number; // e.g. 5.8%
  targetDistanceScore: number; // 0 - 100 (100 = target met)
  complianceRate: number; // %
  supportFlagged: boolean;
  supportRecommendation?: string;
  offboardReason?: string;
  deactivatedAt?: string;
  provisioningStatus: 'provisioned' | 'pending_spring_boot' | 'provisioning' | 'failed';
  createdAt: string;
}

export interface TenantRequest {
  id: string;
  institutionName: string;
  applicantName: string;
  applicantEmail: string;
  domainRequested: string;
  regionDistrict: string;
  estimatedStudents: number;
  accreditationDoc: string;
  status: 'pending' | 'approved' | 'rejected' | 'provisioning';
  submittedAt: string;
  notes?: string;
  springBootLog?: string[];
}

export interface SharedChallengeTemplate {
  id: string;
  title: string;
  category: 'Energy' | 'Waste' | 'Water' | 'Mobility' | 'HVAC';
  description: string;
  targetMetric: string;
  durationDays: number;
  sharedCount: number;
  createdByRegionAdmin: boolean;
  activeInstitutions: string[]; // institution IDs
  createdAt: string;
}

export interface DomainOversightRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  domainName: string;
  primaryMX: string;
  sslStatus: 'valid' | 'expiring_soon' | 'invalid';
  sslExpiryDays: number;
  dnsVerified: boolean;
  cnameConfigured: boolean;
  lastAudited: string;
}

export interface SupportTicket {
  id: string;
  institutionId: string;
  institutionName: string;
  title: string;
  category: 'HVAC Drift' | 'Forecast Mismatch' | 'Domain DNS' | 'Budget Deficit' | 'Sensor Network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'triaged' | 'recommendation_sent' | 'resolved';
  submittedBy: string;
  description: string;
  regionalRecommendation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegionalPolicyConfig {
  defaultEUIThreshold: number; // kBtu/sq ft
  defaultCarbonCap: number; // gCO2e/kWh
  forecastAuditIntervalDays: number; // e.g. 30
  autoFlagNeedsSupportThreshold: number; // e.g. target distance > 25% or accuracy < 85%
  enableSpringAutoProvisioning: boolean;
  studentGamificationAutoEnroll: boolean;
  springBootEndpoint: string;
  regionalGridIsoName: string;
  privacyRawLogEnforcement: boolean;
}

export interface RegionalSSEEvent {
  id: string;
  timestamp: string;
  type: 'BENCHMARK_UPDATE' | 'TENANT_REQUEST' | 'SUPPORT_FLAG' | 'SPRING_PROVISION' | 'FORECAST_DRIFT';
  institutionName?: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface RegionalGrowthPoint {
  yearQuarter: string;
  activeInstitutions: number;
  totalStudents: number;
  aggregateCarbonOffsetTons: number;
  avgForecastAccuracy: number;
}

// Initial Data Stores (Empty by default)
