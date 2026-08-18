'use client';

export interface VerificationItem {
  id: string;
  departmentId: string;
  departmentName: string;
  submitterName: string;
  submitterRole: string;
  submitterEmail: string;
  subCohort: string;
  type: string;
  title: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  isolationForestScore: number; // Anomaly score 0.0 - 1.0
  validationGatewayStatus: 'borderline' | 'flagged' | 'low_confidence';
  geofenceStatus: 'inside' | 'borderline' | 'outside';
  geofenceDistanceMeters: number;
  lat: number;
  lng: number;
  photoUrl: string;
  ocrText: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  duplicateSimilarityPercent?: number;
  slaMinutesRemaining: number;
  slaStatus: 'on_track' | 'near_breach' | 'breached';
  decisionReason?: string;
  decisionNotes?: string;
  decisionBy?: string;
  decisionTimestamp?: string;
}

export interface EscalationRecord {
  id: string;
  itemId: string;
  departmentId: string;
  title: string;
  submitterName: string;
  escalatedBy: string;
  escalatedAt: string;
  priority: 'HIGH' | 'CRITICAL' | 'NORMAL';
  reasonCode: string;
  notes: string;
  evidencePacket: {
    photoUrl: string;
    ocrText: string;
    geotagCoords: string;
    anomalyScore: number;
    isolationForestFeatures: string[];
  };
  institutionAdminStatus: 'open' | 'under_review' | 'resolved';
}

export interface DeptMember {
  id: string;
  name: string;
  email: string;
  role: 'Moderator' | 'Senior Staff' | 'Lab Lead' | 'Faculty Rep';
  subCohort: string;
  status: 'Active' | 'Suspended' | 'Pending Approval';
  joinedDate: string;
  verificationsCompleted: number;
  domainMatchVerified: boolean;
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  subCohort: string;
  verifiedActionsCount: number;
  carbonOffsetKg: number;
  points: number;
  streakDays: number;
  domainStatus: 'matched' | 'ambiguous' | 'unverified';
  registeredDate: string;
}

export interface OnboardingRequest {
  id: string;
  studentName: string;
  email: string;
  requestedDepartment: string;
  subCohort: string;
  domainName: string;
  domainMatchConfidence: number; // e.g. 74%
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reasonCode?: string;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  category: 'Energy Efficiency' | 'Zero Waste' | 'Green Compute' | 'Transport';
  description: string;
  defaultDurationDays: number;
  baselineKPIType: string;
  recommendedReductionPercent: number;
  pointsReward: number;
  tags: string[];
}

export interface DecisionAuditLog {
  id: string;
  itemId: string;
  action: 'Approve' | 'Reject' | 'Escalate' | 'Bulk Approve';
  reasonCode: string;
  notes: string;
  moderatorName: string;
  timestamp: string;
  anomalyScore: number;
}

export interface SubCohortAnalytics {
  subCohort: string;
  memberCount: number;
  verifiedActions: number;
  energySavedKwh: number;
  anomalyResolutionRate: number; // %
  carbonOffsetKg: number;
}

// Initial Data Stores (Empty by default)

export interface TriggerSettings {
  autoEscalateEnabled: boolean;
  slaWindowThresholdPercent: number; // e.g. 50% of SLA window elapsed
  lowConfidenceScoreThreshold: number; // e.g. IsolationForest score >= 0.50 or validation status low_confidence/borderline
  targetAdminRole: string;
  escalationPriority: 'HIGH' | 'CRITICAL';
  notifyInstitutionAdminOnTrigger: boolean;
  lastAutoTriggerRunTime?: string;
  autoEscalatedCountTotal: number;
}

export const REASON_CODES = [
  { code: 'REASON_GEO_MATCH_VALID', label: 'Valid Geofence & Location Match' },
  { code: 'REASON_OCR_VERIFIED', label: 'OCR Meter/Receipt Text Confirmed' },
  { code: 'REASON_ANOMALY_CONFIRMED', label: 'Borderline Anomaly Verified Safe' },
  { code: 'REASON_IMAGE_BLURRY', label: 'Photo Evidence Unclear / Inlegible' },
  { code: 'REASON_GEO_OUT_OF_BOUNDS', label: 'Submission Outside Dept Geofence' },
  { code: 'REASON_DUPLICATE_CLAIM', label: 'Duplicate Submission Fingerprint' },
  { code: 'REASON_DOMAIN_MISMATCH', label: 'Ambiguous Domain or Unverified Account' },
  { code: 'REASON_HAZARD_THRESHOLD', label: 'Exceeds Dept Moderation Value Cap' },
  { code: 'REASON_OTHER', label: 'Other (Custom Notes Attached)' },
];
