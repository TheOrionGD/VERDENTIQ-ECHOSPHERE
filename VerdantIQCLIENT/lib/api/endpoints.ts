/**
 * Unified API Endpoints Layer for VerdantIQ
 * 
 * All components route data reads and writes through these typed API domain endpoints.
 * Endpoints invoke real REST endpoints on Spring Boot Gateway or FastAPI ML Service via apiClient.
 * When backends are offline, apiClient catches errors gracefully and returns fallback states.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, useApiLoading } from '@/lib/api/client';

export { useApiLoading };

/**
 * Custom React hook for running query functions in endpoints.ts with state tracking
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<T | null>;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await queryFn();
      setData(res);
      return res;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, isFetching, error, refetch: execute };
}

/**
 * Custom React hook for running mutation functions in endpoints.ts with loading state
 */
export function useApiMutation<TArgs extends any[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>
): {
  mutate: (...args: TArgs) => Promise<TResult | null>;
  isLoading: boolean;
  error: Error | null;
} {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (...args: TArgs) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mutationFn(...args);
      return res;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}


// Auth API
export const authApi = {
  sendOtp: async (email: string, name: string, purpose?: string) =>
    apiClient({
      path: '/api/v1/auth/send-otp',
      method: 'POST',
      body: { email, name, purpose }
    }),
  verifyOtp: async (email: string, code: string) =>
    apiClient({
      path: '/api/v1/auth/verify-otp',
      method: 'POST',
      body: { email, code }
    }),
  login: async (email: string, pass: string, role: any) =>
    apiClient({
      path: '/api/v1/auth/login',
      method: 'POST',
      body: { email, pass, role }
    }),
  syncUser: async (user: any) =>
    apiClient({
      path: '/api/v1/auth/sync-user',
      method: 'POST',
      body: user
    }),
  getCurrentUser: async () =>
    apiClient({
      path: '/api/v1/auth/me',
      method: 'GET'
    }),
};

// Standard User & Household API
export const userApi = {
  getDashboard: async () =>
    apiClient({
      path: '/api/v1/user/dashboard',
      method: 'GET'
    }),
  getDigitalTwinHouse: async () =>
    apiClient({
      path: '/api/v1/user/digital-twin',
      method: 'GET'
    }),
  saveDigitalTwinHouse: async (data: any) =>
    apiClient({
      path: '/api/v1/user/digital-twin',
      method: 'PUT',
      body: data
    }),
  getForecast: async () =>
    apiClient({
      path: '/api/v1/user/forecast',
      method: 'GET'
    }),
  getOptimizationActions: async () =>
    apiClient({
      path: '/api/v1/user/optimization-actions',
      method: 'GET'
    }),
  getDevices: async () =>
    apiClient({
      path: '/api/v1/user/devices',
      method: 'GET'
    }),
  getReports: async () =>
    apiClient({
      path: '/api/v1/user/reports',
      method: 'GET'
    }),
  getRewards: async () =>
    apiClient({
      path: '/api/v1/user/rewards',
      method: 'GET'
    }),
  getHistory: async () =>
    apiClient({
      path: '/api/v1/user/history',
      method: 'GET'
    }),
  getGoals: async () =>
    apiClient({
      path: '/api/v1/user/goals',
      method: 'GET'
    }),
  updateGoals: async (goals: any) =>
    apiClient({
      path: '/api/v1/user/goals',
      method: 'PUT',
      body: goals
    }),
};

// Student API
export const studentApi = {
  getDashboard: async () =>
    apiClient({
      path: '/api/v1/student/dashboard',
      method: 'GET'
    }),
  getDigitalTwinDorm: async () =>
    apiClient({
      path: '/api/v1/student/digital-twin',
      method: 'GET'
    }),
  saveDigitalTwinDorm: async (data: any) =>
    apiClient({
      path: '/api/v1/student/digital-twin',
      method: 'PUT',
      body: data
    }),
  getAcademicProjects: async () =>
    apiClient({
      path: '/api/v1/student/academic-projects',
      method: 'GET'
    }),
  getChallenges: async () =>
    apiClient({
      path: '/api/v1/student/challenges',
      method: 'GET'
    }),
  getCommunityData: async () =>
    apiClient({
      path: '/api/v1/student/community',
      method: 'GET'
    }),
  getForecast: async () =>
    apiClient({
      path: '/api/v1/student/forecast',
      method: 'GET'
    }),
  getOptimizationActions: async () =>
    apiClient({
      path: '/api/v1/student/optimization-actions',
      method: 'GET'
    }),
  getRewards: async () =>
    apiClient({
      path: '/api/v1/student/rewards',
      method: 'GET'
    }),
  getHistory: async () =>
    apiClient({
      path: '/api/v1/student/history',
      method: 'GET'
    }),
  registerStudent: async (data: any) =>
    apiClient({
      path: '/api/v1/student/register',
      method: 'POST',
      body: data
    }),
};

// Department Admin & Verification API
export const deptApi = {
  getDashboardData: async () =>
    apiClient({
      path: '/api/v1/dept/dashboard',
      method: 'GET'
    }),
  getVerificationQueue: async () =>
    apiClient({
      path: '/api/v1/dept/verification-queue',
      method: 'GET'
    }),
  processVerificationItem: async (
    id: string,
    action: 'Approve' | 'Reject' | 'Escalate',
    reason?: string,
    notes?: string
  ) =>
    apiClient({
      path: `/api/v1/dept/verification-queue/${id}/process`,
      method: 'POST',
      body: { action, reason, notes }
    }),
  getEscalationCases: async () =>
    apiClient({
      path: '/api/v1/dept/escalations',
      method: 'GET'
    }),
  resolveEscalation: async (id: string, notes: string) =>
    apiClient({
      path: `/api/v1/dept/escalations/${id}/resolve`,
      method: 'POST',
      body: { notes }
    }),
  getDeptMembers: async () =>
    apiClient({
      path: '/api/v1/dept/members',
      method: 'GET'
    }),
  addDeptMember: async (mem: any) =>
    apiClient({
      path: '/api/v1/dept/members',
      method: 'POST',
      body: mem
    }),
  removeDeptMember: async (id: string) =>
    apiClient({
      path: `/api/v1/dept/members/${id}`,
      method: 'DELETE'
    }),
  getStudentRegistry: async () =>
    apiClient({
      path: '/api/v1/dept/students',
      method: 'GET'
    }),
  getOnboardingRequests: async () =>
    apiClient({
      path: '/api/v1/dept/onboarding-requests',
      method: 'GET'
    }),
  processOnboardingRequest: async (id: string, action: 'Approve' | 'Reject', reason?: string) =>
    apiClient({
      path: `/api/v1/dept/onboarding-requests/${id}/process`,
      method: 'POST',
      body: { action, reason }
    }),
  getChallengeTemplates: async () =>
    apiClient({
      path: '/api/v1/dept/challenge-templates',
      method: 'GET'
    }),
  getAuditLogs: async () =>
    apiClient({
      path: '/api/v1/dept/audit-logs',
      method: 'GET'
    }),
  getSubCohorts: async () =>
    apiClient({
      path: '/api/v1/dept/sub-cohorts',
      method: 'GET'
    }),
  getTriggerSettings: async () =>
    apiClient({
      path: '/api/v1/dept/trigger-settings',
      method: 'GET'
    }),
  updateTriggerSettings: async (settings: any) =>
    apiClient({
      path: '/api/v1/dept/trigger-settings',
      method: 'PUT',
      body: settings
    }),
};

// Institution Admin API
export const institutionApi = {
  getDashboard: async () =>
    apiClient({
      path: '/api/v1/institution/dashboard',
      method: 'GET'
    }),
  getDepartments: async () =>
    apiClient({
      path: '/api/v1/institution/departments',
      method: 'GET'
    }),
  addDepartment: async (dept: any) =>
    apiClient({
      path: '/api/v1/institution/departments',
      method: 'POST',
      body: dept
    }),
  getChallenges: async () =>
    apiClient({
      path: '/api/v1/institution/challenges',
      method: 'GET'
    }),
  getGeofencePolygons: async () =>
    apiClient({
      path: '/api/v1/institution/geofence',
      method: 'GET'
    }),
  saveGeofencePolygon: async (polygon: any) =>
    apiClient({
      path: '/api/v1/institution/geofence',
      method: 'POST',
      body: polygon
    }),
  getReports: async () =>
    apiClient({
      path: '/api/v1/institution/reports',
      method: 'GET'
    }),
  getAnalytics: async () =>
    apiClient({
      path: '/api/v1/institution/analytics',
      method: 'GET'
    }),
  getSettings: async () =>
    apiClient({
      path: '/api/v1/institution/settings',
      method: 'GET'
    }),
  getMilpScenarios: async () =>
    apiClient({
      path: '/api/v1/institution/milp-scenarios',
      method: 'GET'
    }),
  getEscalationResolutions: async () =>
    apiClient({
      path: '/api/v1/institution/escalation-resolutions',
      method: 'GET'
    }),
  getChallengeApprovals: async () =>
    apiClient({
      path: '/api/v1/institution/challenge-approvals',
      method: 'GET'
    }),
  getXGBoostKPIAutoSuggestions: async () =>
    apiClient({
      path: '/api/v1/institution/xgboost-kpi-suggestions',
      method: 'GET'
    }),
  getExecutiveReportSchedules: async () =>
    apiClient({
      path: '/api/v1/institution/executive-report-schedules',
      method: 'GET'
    }),
  getAnomalyTrends: async () =>
    apiClient({
      path: '/api/v1/institution/anomaly-trends',
      method: 'GET'
    }),
  getOnboardingFunnel: async () =>
    apiClient({
      path: '/api/v1/institution/onboarding-funnel',
      method: 'GET'
    }),
  getAcceptedDomains: async () =>
    apiClient({
      path: '/api/v1/institution/accepted-domains',
      method: 'GET'
    }),
};

// Region & State Governance API
export const regionApi = {
  getInstitutions: async () =>
    apiClient({
      path: '/api/v1/region/institutions',
      method: 'GET'
    }),
  getInstitutionsInState: async (stateId: string) =>
    apiClient({

      path: `/api/v1/region/states/${encodeURIComponent(stateId)}/institutions`,
      method: 'GET'
    }),
  getHouseholdsInState: async (stateId: string) =>
    apiClient({

      path: `/api/v1/region/states/${encodeURIComponent(stateId)}/households`,
      method: 'GET'
    }),
  registerHousehold: async (household: {
    name: string;
    email: string;
    stateId: string;
    districtId: string;
    address?: string;
  }) =>
    apiClient({

      path: `/api/v1/region/states/${encodeURIComponent(household.stateId)}/households`,
      method: 'POST',
      body: household
    }),
  getStateAggregate: async (stateId: string) =>
    apiClient({

      path: `/api/v1/region/states/${encodeURIComponent(stateId)}/aggregate`,
      method: 'GET'
    }),
  getTenantRequests: async () =>
    apiClient({
      path: '/api/v1/region/tenant-requests',
      method: 'GET'
    }),
  approveTenantRequest: async (requestId: string) =>
    apiClient({
      path: `/api/v1/region/tenant-requests/${requestId}/approve`,
      method: 'POST'
    }),
  rejectTenantRequest: async (requestId: string, notes?: string) =>
    apiClient({
      path: `/api/v1/region/tenant-requests/${requestId}/reject`,
      method: 'POST',
      body: { notes }
    }),
  getChallengeTemplates: async () =>
    apiClient({
      path: '/api/v1/region/challenge-templates',
      method: 'GET'
    }),
  createChallengeTemplate: async (tpl: any) =>
    apiClient({
      path: '/api/v1/region/challenge-templates',
      method: 'POST',
      body: tpl
    }),
  getDomainOversight: async () =>
    apiClient({
      path: '/api/v1/region/domains',
      method: 'GET'
    }),
  getSupportTickets: async () =>
    apiClient({
      path: '/api/v1/region/support-tickets',
      method: 'GET'
    }),
  addSupportRecommendation: async (ticketId: string, recommendation: string) =>
    apiClient({
      path: `/api/v1/region/support-tickets/${ticketId}/recommendations`,
      method: 'POST',
      body: { recommendation }
    }),
  getPolicyConfig: async () =>
    apiClient({
      path: '/api/v1/region/policy-config',
      method: 'GET'
    }),
  savePolicyConfig: async (cfg: any) =>
    apiClient({
      path: '/api/v1/region/policy-config',
      method: 'PUT',
      body: cfg
    }),
  getSSEEvents: async () =>
    apiClient({
      path: '/api/v1/notifications/stream',
      method: 'GET'
    }),
  getGrowthTrend: async () =>
    apiClient({
      path: '/api/v1/region/growth-trend',
      method: 'GET'
    }),
  getAggregateRegionalBenchmarks: async () =>
    apiClient({
      path: '/api/v1/region/benchmarks',
      method: 'GET'
    }),
  addInstitution: async (inst: any) =>
    apiClient({
      path: '/api/v1/region/institutions',
      method: 'POST',
      body: inst
    }),
  updateInstitutionStatus: async (id: string, status: any, reason?: string) =>
    apiClient({
      path: `/api/v1/region/institutions/${id}/status`,
      method: 'PUT',
      body: { status, reason }
    }),
  flagNeedsSupport: async (id: string, supportFlagged: boolean, recommendation?: string) =>
    apiClient({
      path: `/api/v1/region/institutions/${id}/support-flag`,
      method: 'PATCH',
      body: { supportFlagged, recommendation }
    }),
};

// Platform Admin API
export const adminApi = {
  getTenantRequests: async () =>
    apiClient({
      path: '/api/v1/admin/tenant-requests',
      method: 'GET'
    }),
  getRBACSchema: async () =>
    apiClient({
      path: '/api/v1/admin/rbac-schema',
      method: 'GET'
    }),
  getDatabaseStatus: async () =>
    apiClient({
      path: '/api/v1/admin/database-status',
      method: 'GET'
    }),
  getAuditLogs: async () =>
    apiClient({
      path: '/api/v1/admin/audit-logs',
      method: 'GET'
    }),
  getAccessGrants: async () =>
    apiClient({
      path: '/api/v1/admin/access-grants',
      method: 'GET'
    }),
  getFeatureFlags: async () =>
    apiClient({
      path: '/api/v1/admin/feature-flags',
      method: 'GET'
    }),
  getRateLimits: async () =>
    apiClient({
      path: '/api/v1/admin/rate-limits',
      method: 'GET'
    }),
  getBroadcasts: async () =>
    apiClient({
      path: '/api/v1/admin/broadcasts',
      method: 'GET'
    }),
  getTelemetry: async () =>
    apiClient({
      path: '/api/v1/admin/telemetry',
      method: 'GET'
    }),
  getDomains: async () =>
    apiClient({
      path: '/api/v1/admin/domains',
      method: 'GET'
    }),
};

// ML Operations API
export const mlopsApi = {
  getModelRegistry: async () =>
    apiClient({
      path: '/api/v1/mlops/models',
      method: 'GET'
    }),
  getRoutingRules: async () =>
    apiClient({
      path: '/api/v1/mlops/llm-gateway/routing-rules',
      method: 'GET'
    }),
  getMilpWeights: async () =>
    apiClient({
      path: '/api/v1/mlops/milp-weights',
      method: 'GET'
    }),
  saveMilpWeights: async (weights: any) =>
    apiClient({
      path: '/api/v1/mlops/milp-weights',
      method: 'PUT',
      body: weights
    }),
  getAlertRules: async () =>
    apiClient({
      path: '/api/v1/mlops/alert-rules',
      method: 'GET'
    }),
  getFastApiConfig: async () =>
    apiClient({
      path: '/api/v1/mlops/fastapi-config',
      method: 'GET'
    }),
  saveFastApiConfig: async (config: any) =>
    apiClient({
      path: '/api/v1/mlops/fastapi-config',
      method: 'PUT',
      body: config
    }),
  getRetrainSchedule: async () =>
    apiClient({
      path: '/api/v1/mlops/retrain-schedule',
      method: 'GET'
    }),
  saveRetrainSchedule: async (schedule: any) =>
    apiClient({
      path: '/api/v1/mlops/retrain-schedule',
      method: 'PUT',
      body: schedule
    }),
  getLabeledDataBatches: async () =>
    apiClient({
      path: '/api/v1/mlops/labeled-batches',
      method: 'GET'
    }),
  getCanaryDeployments: async () =>
    apiClient({
      path: '/api/v1/mlops/canary-deployments',
      method: 'GET'
    }),
  getDataPipelineNodes: async () =>
    apiClient({
      path: '/api/v1/mlops/pipeline-nodes',
      method: 'GET'
    }),
  getExperiments: async () =>
    apiClient({
      path: '/api/v1/mlops/experiments',
      method: 'GET'
    }),
  getRegistryDiff: async () =>
    apiClient({
      path: '/api/v1/mlops/registry-diff',
      method: 'GET'
    }),
  getLLMGatewayConfig: async () =>
    apiClient({
      path: '/api/v1/mlops/llm-gateway/config',
      method: 'GET'
    }),
};

// Auditor & Researcher API
export const auditApi = {
  getOverview: async () =>
    apiClient({
      path: '/api/v1/audit/overview',
      method: 'GET'
    }),
  getLogs: async () =>
    apiClient({
      path: '/api/v1/audit/logs',
      method: 'GET'
    }),
  getRequests: async () =>
    apiClient({
      path: '/api/v1/audit/requests',
      method: 'GET'
    }),
  getDomains: async () =>
    apiClient({
      path: '/api/v1/audit/domains',
      method: 'GET'
    }),
  getDataFlowNodes: async () =>
    apiClient({
      path: '/api/v1/audit/data-flow',
      method: 'GET'
    }),
  getModelCards: async () =>
    apiClient({
      path: '/api/v1/audit/model-cards',
      method: 'GET'
    }),
  getFairnessReports: async () =>
    apiClient({
      path: '/api/v1/audit/fairness-reports',
      method: 'GET'
    }),
  getTenantHistory: async () =>
    apiClient({
      path: '/api/v1/audit/tenant-history',
      method: 'GET'
    }),
  getExportConfig: async () =>
    apiClient({
      path: '/api/v1/audit/export-config',
      method: 'GET'
    }),
  getSettings: async () =>
    apiClient({
      path: '/api/v1/audit/settings',
      method: 'GET'
    }),
};

// Activity API
export const activityApi = {
  getActivityLogs: async () =>
    apiClient({
      path: '/api/v1/activity',
      method: 'GET'
    }),
  logActivity: async (activity: any) =>
    apiClient({
      path: '/api/v1/activity',
      method: 'POST',
      body: activity
    }),
};

// Notifications API
export const notificationsApi = {
  getNotifications: async () =>
    apiClient({
      path: '/api/v1/notifications',
      method: 'GET'
    }),
  markAsRead: async (id: string) =>
    apiClient({
      path: `/api/v1/notifications/${id}/read`,
      method: 'PATCH'
    }),
  markAllAsRead: async () =>
    apiClient({
      path: '/api/v1/notifications/mark-all-read',
      method: 'POST'
    }),
  addNotification: async (notif: any) =>
    apiClient({
      path: '/api/v1/notifications',
      method: 'POST',
      body: notif
    }),
};

// Tenant Privacy API
export const tenantPrivacyApi = {
  checkTenantPrivacy: async (tenantId: string) =>
    apiClient({
      path: `/api/v1/tenant-privacy/check?tenantId=${encodeURIComponent(tenantId)}`,
      method: 'GET'
    }),
  verifyAccess: async (userRole: any, targetTenant: string) =>
    apiClient({
      path: '/api/v1/tenant-privacy/verify-access',
      method: 'POST',
      body: { userRole, targetTenant }
    }),
};
