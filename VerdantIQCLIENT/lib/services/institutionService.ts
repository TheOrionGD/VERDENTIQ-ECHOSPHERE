'use client';

export interface GeofencePolygon {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  vertices: Array<{ lat: number; lng: number }>;
  centroid: { lat: number; lng: number };
  areaSqMeters: number;
  bufferMeters: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  moderatorName: string;
  moderatorEmail: string;
  budgetAnnualUsd: number;
  budgetSpentUsd: number;
  carbonTargetKg: number;
  carbonActualKg: number;
  memberCount: number;
  ecoScore: number;
  status: 'Active' | 'Under Review' | 'Inactive';
  headCount: number;
  locationBuilding: string;
}

export interface MilpScenario {
  id: string;
  name: string;
  costWeight: number;
  carbonWeight: number;
  coverageWeight: number;
  solverStatus: 'Optimal' | 'Feasible' | 'Unbounded';
  totalCostUsd: number;
  totalCarbonOffsetKg: number;
  coveragePercent: number;
  executionTimeMs: number;
  recommendedAction: string;
}

export interface HeatmapDataPoint {
  departmentId: string;
  departmentName: string;
  energySavedKwh: number;
  carbonReducedKg: number;
  verificationPassRate: number; // %
  budgetVariancePercent: number; // + or - %
  anomalyRatePercent: number; // %
  overallEcoScore: number; // 0 - 100
}

export interface EscalationResolutionItem {
  id: string;
  itemId: string;
  departmentName: string;
  title: string;
  submitterName: string;
  escalatedBy: string;
  escalatedAt: string;
  priority: 'HIGH' | 'CRITICAL' | 'NORMAL';
  anomalyScore: number;
  status: 'open' | 'under_review' | 'resolved';
  groundTruthLabel?: 'TRUE_POSITIVE' | 'FALSE_POSITIVE' | 'ADJUSTED_THRESHOLD';
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  fedToMlPipeline: boolean;
  evidencePacket: {
    photoUrl: string;
    ocrText: string;
    geotagCoords: string;
    isolationForestFeatures: string[];
  };
}

export interface ChallengeApprovalItem {
  id: string;
  title: string;
  departmentName: string;
  proposedBy: string;
  category: 'Energy Efficiency' | 'Zero Waste' | 'Green Compute' | 'Transport';
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Active Campaign';
  rewardPoints: number;
  targetCarbonSavingKg: number;
  startDate: string;
  endDate: string;
  description: string;
  submittedAt: string;
}

export interface XGBoostKPIAutoSuggestion {
  id: string;
  metricName: string;
  currentBaselineValue: number;
  unit: string;
  xgboostPredictedBaseline: number;
  suggestedTargetConservative: number;
  suggestedTargetRecommended: number;
  suggestedTargetStretch: number;
  modelConfidencePercent: number;
  estimatedCostSavingsUsd: number;
  estimatedCarbonReductionKg: number;
  departmentScope: string;
}

export interface ExecutiveReportSchedule {
  id: string;
  title: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly';
  templateName: string;
  recipients: string[];
  lastGeneratedAt: string;
  nextScheduledAt: string;
  status: 'Scheduled' | 'Generating' | 'Completed';
  reportParameters: {
    includeMILPOptimization: boolean;
    includeHeatmap: boolean;
    includeAuditLogs: boolean;
    includeFinancialVariance: boolean;
  };
}

export interface AnomalyTrendPoint {
  week: string;
  totalSubmissions: number;
  geofenceViolations: number;
  ocrDiscrepancies: number;
  duplicateFingerprints: number;
  hardwareSensorAnomalies: number;
  overallAnomalyRatePercent: number;
}

export interface OnboardingFunnelData {
  step: string;
  userCount: number;
  conversionPercent: number;
  dropOffCount: number;
}

export interface AcceptedDomainItem {
  id: string;
  domainName: string;
  institutionName: string;
  autoVerify: boolean;
  status: 'Active' | 'Pending Review' | 'Disabled';
  addedAt: string;
  studentCount: number;
  contactEmail: string;
}

export interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  department: string;
  subCohort: string;
  verifiedActions: number;
  carbonOffsetKg: number;
  status: 'Active' | 'Flagged' | 'Pending Domain';
  joinedDate: string;
  ecoRank: number;
}

export interface InstitutionAdminAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionCategory: 'GEOFENCE' | 'DEPARTMENT' | 'CHALLENGE' | 'ESCALATION' | 'DOMAIN' | 'REPORT' | 'SETTINGS';
  description: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface TenantBrandingConfig {
  institutionName: string;
  systemTitle: string;
  primaryColor: string;
  logoUrl: string;
  notificationPolicy: {
    digestFrequency: 'Daily' | 'Weekly' | 'Realtime';
    emailEscalations: boolean;
    smsAlerts: boolean;
    criticalAnomalyThreshold: number;
  };
}

export interface SmartMeterGateway {
  id: string;
  name: string;
  protocol: 'Modbus TCP' | 'MQTT Broker' | 'BACnet/IP' | 'REST Gateway';
  endpointUrl: string;
  departmentName: string;
  lastHeartbeat: string;
  packetsPerMinute: number;
  status: 'Online' | 'Warning' | 'Offline';
  latencyMs: number;
}

// Default Initial State (Clean state defaults)
