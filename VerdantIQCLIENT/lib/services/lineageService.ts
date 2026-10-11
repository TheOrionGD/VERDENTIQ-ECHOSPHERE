import { RoleType } from './authService';

export interface InputLineageEntry {
  id: string;
  role: RoleType;
  inputField: string;
  inputLabel: string;
  collectionPoint: string; // Page route or UI component
  calculationStep: string; // Named model or service
  presentationSurface: string; // Chart, table, or page where output is rendered
  definedUse: string; // Business/technical justification
  traceableSourceModel: string; // Exact model ID or engine name
  isRawPersonalData: boolean;
  privacyLevel: 'Personal Raw PII' | 'Anonymized Telemetry' | 'Aggregated Regional Metric' | 'System Configuration';
}

export interface LineageValidationResult {
  totalInputs: number;
  unmappedInputsCount: number;
  orphanDisplaysCount: number;
  validCount: number;
  is100PercentConsistent: boolean;
  violations: string[];
  coverageByRole: Record<RoleType, { totalInputs: number; mappedCount: number; percentage: number }>;
}
