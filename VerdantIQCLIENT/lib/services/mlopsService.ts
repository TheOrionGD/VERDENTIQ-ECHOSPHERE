'use client';

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  framework: string;
  status: 'LIVE' | 'STAGING' | 'DEPRECATED' | 'CANARY';
  deployedAt: string;
  rmse: number;
  mae: number;
  latencyMs: number;
  memoryMb: number;
  accuracy: number;
  description: string;
  featureImportance: { feature: string; importance: number }[];
}

export interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  primaryProvider: 'Groq LPU' | 'Gemini 3.5 Flash' | 'Local Rule Engine';
  fallbackProvider: 'Gemini 3.5 Flash' | 'Local Rule Engine' | 'Groq LPU';
  maxLatencyMs: number;
  maxCostCapDollars: number;
  enabled: boolean;
}

export interface MilpWeights {
  energyCost: number;
  thermalComfort: number;
  equipmentWear: number;
  carbonEmissions: number;
}

export interface AlertRule {
  id: string;
  modelName: string;
  metric: 'RMSE' | 'Latency P99' | 'Drift PSI' | 'Error Rate';
  operator: '>' | '<' | '>=';
  threshold: number;
  duration: string;
  channel: 'Slack' | 'Email' | 'Webhook' | 'PagerDuty';
  enabled: boolean;
}

export interface FastApiConfig {
  workers: number;
  maxConcurrency: number;
  timeoutSeconds: number;
  cacheTtlSeconds: number;
  healthEndpoint: string;
  logLevel: 'INFO' | 'DEBUG' | 'WARN';
}

export interface RetrainSchedule {
  cronSchedule: string;
  driftThresholdPsi: number;
  escalationCountTrigger: number;
  autoDeployIfRmseLower: boolean;
  webhookUrl: string;
}

export interface LabeledDataBatch {
  id: string;
  source: string;
  recordCount: number;
  labelType: string;
  dateCollected: string;
  qualityScore: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}

// Default Initial State (Clean state defaults)
