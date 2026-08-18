# VerdantIQ Complete API Contract Specification (v1.0)

This document establishes the official REST and Streaming API contract between the **VerdantIQ Next.js Client Application** and the backend microservices ecosystem (**Spring Boot API Gateway** and **FastAPI ML Service**).

---

## 1. Architecture Overview & Authentication Standard

### Backend Service Boundaries
1. **Spring Boot Gateway (`http://localhost:8080`)**:
   - Primary API Gateway & Auth Broker.
   - Primary database owner for MongoDB persistence (Users, Tenants, Institutions, Departments, Audit Logs, Notifications, Activity Records).
   - Responsible for Custom Claim validation, RBAC enforcement, rate limiting, and SSE streaming channels.
2. **FastAPI ML Service (`http://localhost:8000`)**:
   - High-performance asynchronous Python service for machine learning operations.
   - Responsible for XGBoost/LSTM EUI forecasting, Anomaly Detection, MILP load optimization, MLOps model registry, canary deployment controls, and LLM gateway routing.
3. **Gateway Proxy Pattern (`gateway → proxies to ML service`)**:
   - Client endpoints targeting ML workloads that require unified RBAC/tenant-scoping pass through Spring Boot Gateway first before forwarding to FastAPI. Direct FastAPI calls are reserved for high-frequency low-latency ML management.

### Security & Custom Claims Specification
- Every request (except unauthenticated auth endpoints) MUST transmit a valid **Firebase ID Token** in the HTTP `Authorization: Bearer <ID_TOKEN>` header.
- Custom claims embedded in the Firebase token MUST be verified on the gateway:
  - `role`: One of `['platform_admin', 'region_admin', 'institution_admin', 'dept_admin', 'student', 'user', 'mlops_admin', 'auditor']`
  - `tenant_id`: Institution or tenant identifier (e.g. `inst-cmu-01`, `tenant-xyz`).
  - `dept_id`: Department identifier within an institution (e.g. `dept-cs-01`).
  - `region_id` / `state_id`: Regional oversight scope (e.g. `IN-TN`, `US-CA`).

---

## 2. Auth API (`authApi`)

### `POST /api/v1/auth/send-otp`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Public / Unauthenticated
- **Token Required**: None
- **Request Payload**:
```json
{
  "email": "user@example.edu",
  "name": "Alex Johnson",
  "purpose": "registration_verification"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "message": "OTP verification code dispatched via transactional email",
  "otpSentAt": "2026-08-07T09:25:00Z"
}
```

### `POST /api/v1/auth/verify-otp`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Public / Unauthenticated
- **Token Required**: None
- **Request Payload**:
```json
{
  "email": "user@example.edu",
  "code": "582910"
}
```
- **Response Payload**:
```json
{
  "verified": true,
  "message": "OTP verified successfully",
  "token": "ey..."
}
```

### `POST /api/v1/auth/login`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Public / Unauthenticated
- **Token Required**: None
- **Request Payload**:
```json
{
  "email": "user@example.edu",
  "pass": "P@ssword123",
  "role": "institution_admin"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "user": {
    "uid": "usr_9981",
    "email": "user@example.edu",
    "name": "Alex Johnson",
    "role": "institution_admin",
    "tenantId": "inst-cmu-01"
  },
  "token": "ey..."
}
```

### `POST /api/v1/auth/sync-user`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**:
```json
{
  "uid": "usr_9981",
  "email": "user@example.edu",
  "name": "Alex Johnson",
  "role": "student",
  "tenantId": "inst-cmu-01",
  "departmentId": "dept-cs-01"
}
```
- **Response Payload**:
```json
{
  "synced": true,
  "user": {
    "uid": "usr_9981",
    "email": "user@example.edu",
    "name": "Alex Johnson",
    "role": "student",
    "tenantId": "inst-cmu-01",
    "departmentId": "dept-cs-01"
  }
}
```

### `GET /api/v1/auth/me`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**:
```json
{
  "uid": "usr_9981",
  "email": "user@example.edu",
  "name": "Alex Johnson",
  "role": "student",
  "tenantId": "inst-cmu-01"
}
```

---

## 3. Standard User & Household API (`userApi`)

### `GET /api/v1/user/dashboard`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User (`role === 'user'`)
- **Token Required**: Firebase ID Token (Claim check: `role === 'user'`)
- **Request Payload**: None
- **Response Payload**:
```json
{
  "monthlyKwh": 412.5,
  "monthlyCarbonKg": 185.2,
  "monthlySavingsUSD": 48.20,
  "ecoPoints": 1250,
  "rankTitle": "Eco Champion",
  "activeOptimizationCount": 3
}
```

### `GET /api/v1/user/digital-twin`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User, scoped to own `household_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `DigitalTwinHouse`
```json
{
  "id": "hh-dt-101",
  "version": "1.2",
  "timestamp": "2026-08-07T00:00:00Z",
  "note": "Single family 2-story home configuration",
  "houseSizeSqFt": 2100,
  "occupants": 4,
  "homeType": "single_family",
  "appliances": ["heat_pump", "ev_charger", "solar_inverter"],
  "solarCapacityKw": 6.5,
  "batteryCapacityKwh": 10.0,
  "evCharger": true,
  "heatPump": true,
  "estAnnualEmissionsKg": 2100.0,
  "estMonthlySavingsUSD": 85.0
}
```

### `PUT /api/v1/user/digital-twin`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User, scoped to own `household_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `DigitalTwinHouse`
- **Response Payload**: Updated `DigitalTwinHouse`

### `GET /api/v1/user/forecast`
- **Owner**: FastAPI ML Service (or Gateway → proxies to ML service)
- **Role & Scope**: Resident / Household User, scoped to own `household_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ForecastDataPoint`
```json
[
  {
    "day": 1,
    "date": "2026-08-08",
    "baselineKw": 14.2,
    "actualOrForecastKw": 12.8,
    "confidenceLower": 11.5,
    "confidenceUpper": 14.1,
    "carbonGco2e": 420.0,
    "isAnomaly": false
  }
]
```

### `GET /api/v1/user/optimization-actions`
- **Owner**: FastAPI ML Service (via Gateway)
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `OptimizationAction`
```json
[
  {
    "id": "opt-101",
    "title": "Shift EV Charging to Super Off-Peak",
    "category": "EV Charging",
    "rank": 1,
    "description": "Charge vehicle between 01:00 - 05:00 when grid carbon intensity is lowest.",
    "carbonDeltaKg": -4.2,
    "costDeltaUSD": -3.50,
    "ecoPointsBonus": 150,
    "easeScore": 95,
    "status": "recommended"
  }
]
```

### `GET /api/v1/user/devices`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User, scoped to own `household_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `LinkedDevice`

### `GET /api/v1/user/reports`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `UserReport`

### `GET /api/v1/user/rewards`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RewardItem`

### `GET /api/v1/user/history`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ActivityHistoryItem`

### `GET /api/v1/user/goals`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `UserGoal`

### `PUT /api/v1/user/goals`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Resident / Household User
- **Token Required**: Firebase ID Token
- **Request Payload**: Array of `UserGoal`
- **Response Payload**: Updated Array of `UserGoal`

---

## 4. Student API (`studentApi`)

### `GET /api/v1/student/dashboard`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student (`role === 'student'`), scoped to own `tenant_id`
- **Token Required**: Firebase ID Token (Claim check: `role === 'student'`)
- **Request Payload**: None
- **Response Payload**: `StudentDashboardData`

### `GET /api/v1/student/digital-twin`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student, scoped to own dorm room
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `DigitalTwinDorm`

### `PUT /api/v1/student/digital-twin`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student, scoped to own dorm room
- **Token Required**: Firebase ID Token
- **Request Payload**: `DigitalTwinDorm`
- **Response Payload**: Updated `DigitalTwinDorm`

### `GET /api/v1/student/academic-projects`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student, scoped to own department
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AcademicProject`

### `GET /api/v1/student/challenges`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student, scoped to campus geofence
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `GeofencedChallenge`

### `GET /api/v1/student/community`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student, scoped to institution
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `CommunityData`

### `GET /api/v1/student/forecast`
- **Owner**: FastAPI ML Service
- **Role & Scope**: Student, scoped to dorm
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ForecastDataPoint`

### `GET /api/v1/student/optimization-actions`
- **Owner**: FastAPI ML Service
- **Role & Scope**: Student
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `OptimizationAction`

### `GET /api/v1/student/rewards`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RewardItem`

### `GET /api/v1/student/history`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Student
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ActivityHistoryItem`

### `POST /api/v1/student/register`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Onboarding Student
- **Token Required**: Firebase ID Token
- **Request Payload**:
```json
{
  "name": "Priya Sharma",
  "email": "priya@university.edu",
  "studentIdNumber": "STU-2026-9921",
  "departmentId": "dept-cs-01",
  "institutionId": "inst-cmu-01"
}
```
- **Response Payload**:
```json
{
  "success": true,
  "ticketId": "REG-8821"
}
```

---

## 5. Department Admin API (`deptApi`)

### `GET /api/v1/dept/dashboard`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin (`role === 'dept_admin'`), scoped to own `tenant_id` and `dept_id`
- **Token Required**: Firebase ID Token (Claims: `role === 'dept_admin'`, `tenant_id`, `dept_id`)
- **Request Payload**: None
- **Response Payload**: `DeptDashboardData`

### `GET /api/v1/dept/verification-queue`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `VerificationItem`

### `POST /api/v1/dept/verification-queue/{id}/process`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**:
```json
{
  "action": "Approve",
  "reason": "Submitted lab power log meets verified parameters",
  "notes": "Verified against sub-meter reading"
}
```
- **Response Payload**: `boolean` or processed item

### `GET /api/v1/dept/escalations`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `EscalationCase`

### `POST /api/v1/dept/escalations/{id}/resolve`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "notes": "Re-calibrated HVAC setpoint in Server Room B" }`
- **Response Payload**: `{ "success": true, "resolvedAt": "2026-08-07T09:25:00Z" }`

### `GET /api/v1/dept/members`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DeptMember`

### `POST /api/v1/dept/members`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `Partial<DeptMember>`
- **Response Payload**: `DeptMember`

### `DELETE /api/v1/dept/members/{id}`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "success": true }`

### `GET /api/v1/dept/students`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `StudentRegistryRecord`

### `GET /api/v1/dept/onboarding-requests`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `OnboardingRequest`

### `POST /api/v1/dept/onboarding-requests/{id}/process`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin, scoped to `dept_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "action": "Approve", "reason": "Eligible student ID" }`
- **Response Payload**: `{ "success": true }`

### `GET /api/v1/dept/challenge-templates`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DeptChallengeTemplate`

### `GET /api/v1/dept/audit-logs`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DeptAuditLog`

### `GET /api/v1/dept/sub-cohorts`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `SubCohort`

### `GET /api/v1/dept/trigger-settings`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `DeptTriggerSettings`

### `PUT /api/v1/dept/trigger-settings`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Department Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `DeptTriggerSettings`
- **Response Payload**: Updated `DeptTriggerSettings`

---

## 6. Institution Admin API (`institutionApi`)

### `GET /api/v1/institution/dashboard`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin (`role === 'institution_admin'`), scoped to own `tenant_id`
- **Token Required**: Firebase ID Token (Claims: `role === 'institution_admin'`, `tenant_id`)
- **Request Payload**: None
- **Response Payload**: `InstitutionDashboardMetrics`

### `GET /api/v1/institution/departments`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `InstitutionDepartmentRecord`

### `POST /api/v1/institution/departments`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `Partial<InstitutionDepartmentRecord>`
- **Response Payload**: `InstitutionDepartmentRecord`

### `GET /api/v1/institution/challenges`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `InstitutionChallenge`

### `GET /api/v1/institution/geofence`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `GeofencePolygon`

### `POST /api/v1/institution/geofence`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: `GeofencePolygon`
- **Response Payload**: Updated `GeofencePolygon`

### `GET /api/v1/institution/reports`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `InstitutionReport`

### `GET /api/v1/institution/analytics`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `InstitutionAnalyticsData`

### `GET /api/v1/institution/settings`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `InstitutionSettings`

### `GET /api/v1/institution/milp-scenarios`
- **Owner**: Gateway → Proxies to FastAPI ML Service
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `MilpScenario`

### `GET /api/v1/institution/escalation-resolutions`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `EscalationResolution`

### `GET /api/v1/institution/challenge-approvals`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ChallengeApprovalItem`

### `GET /api/v1/institution/xgboost-kpi-suggestions`
- **Owner**: Gateway → Proxies to FastAPI ML Service
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `XGBoostKPISuggestion`

### `GET /api/v1/institution/executive-report-schedules`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ExecutiveReportSchedule`

### `GET /api/v1/institution/anomaly-trends`
- **Owner**: Gateway → Proxies to FastAPI ML Service
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AnomalyTrendItem`

### `GET /api/v1/institution/onboarding-funnel`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `OnboardingFunnelStep`

### `GET /api/v1/institution/accepted-domains`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Institution Admin, scoped to `tenant_id`
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `string`

---

## 7. Region & State Governance API (`regionApi`)

### `GET /api/v1/region/institutions`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin (`role === 'region_admin'`), scoped to `region_id`
- **Token Required**: Firebase ID Token (Claims: `role === 'region_admin'`, `region_id`)
- **Request Payload**: None
- **Response Payload**: Array of `InstitutionRecord`

### `GET /api/v1/region/states/{stateId}/institutions`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin / State Oversight Admin, scoped to `stateId`
- **Token Required**: Firebase ID Token
- **Request Payload**: Path param `stateId` (e.g. `IN-TN`)
- **Response Payload**: Array of `InstitutionRecord` filtered by state

### `GET /api/v1/region/states/{stateId}/households`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin / State Oversight Admin, scoped to `stateId`
- **Token Required**: Firebase ID Token
- **Request Payload**: Path param `stateId` (e.g. `IN-TN`)
- **Response Payload**: Array of `HouseholdRecord` registered in state

### `POST /api/v1/region/states/{stateId}/households`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin or Public Resident Registration
- **Token Required**: Optional for public onboarding
- **Request Payload**:
```json
{
  "name": "Kavitha Rajan",
  "email": "kavitha@example.in",
  "stateId": "IN-TN",
  "districtId": "Chennai",
  "address": "12 Anna Salai, Chennai"
}
```
- **Response Payload**:
```json
{
  "id": "hh-88102",
  "name": "Kavitha Rajan",
  "email": "kavitha@example.in",
  "stateId": "IN-TN",
  "districtId": "Chennai",
  "address": "12 Anna Salai, Chennai",
  "registeredAt": "2026-08-07",
  "status": "active"
}
```

### `GET /api/v1/region/states/{stateId}/aggregate`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin / State Oversight Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: Path param `stateId`
- **Response Payload**:
```json
{
  "stateId": "IN-TN",
  "institutionCount": 12,
  "householdCount": 1450,
  "totalEnergySavingsKwh": 845000.0,
  "totalCarbonOffsetKg": 380200.0,
  "aggregateEUI": 88.4,
  "status": "Active Monitoring",
  "notice": "Aggregate view only. Individual raw logs quarantined at municipal/household and campus tiers."
}
```

### `GET /api/v1/region/tenant-requests`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `TenantRequest`

### `POST /api/v1/region/tenant-requests/{requestId}/approve`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Approved `TenantRequest`

### `POST /api/v1/region/tenant-requests/{requestId}/reject`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "notes": "Accreditation documentation incomplete" }`
- **Response Payload**: Rejected `TenantRequest`

### `GET /api/v1/region/challenge-templates`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `SharedChallengeTemplate`

### `POST /api/v1/region/challenge-templates`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `Partial<SharedChallengeTemplate>`
- **Response Payload**: `SharedChallengeTemplate`

### `GET /api/v1/region/domains`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DomainOversightRecord`

### `GET /api/v1/region/support-tickets`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `SupportTicket`

### `POST /api/v1/region/support-tickets/{ticketId}/recommendations`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "recommendation": "Deploy peak-shaving battery optimization scenario" }`
- **Response Payload**: Updated `SupportTicket`

### `GET /api/v1/region/policy-config`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `RegionalPolicyConfig`

### `PUT /api/v1/region/policy-config`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `RegionalPolicyConfig`
- **Response Payload**: Updated `RegionalPolicyConfig`

### `GET /api/v1/region/growth-trend`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `GrowthTrendDataPoint`

### `GET /api/v1/region/benchmarks`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RegionalBenchmark`

### `POST /api/v1/region/institutions`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `Partial<InstitutionRecord>`
- **Response Payload**: `InstitutionRecord`

### `PUT /api/v1/region/institutions/{id}/status`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "status": "active", "reason": "Accreditation verified" }`
- **Response Payload**: Updated `InstitutionRecord`

### `PATCH /api/v1/region/institutions/{id}/support-flag`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Regional Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "supportFlagged": true, "recommendation": "Conduct energy audit" }`
- **Response Payload**: Updated `InstitutionRecord`

---

## 8. Platform Admin API (`platformAdminApi` / `adminApi`)

### `GET /api/v1/admin/tenant-requests`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin (`role === 'platform_admin'`), no tenant restriction
- **Token Required**: Firebase ID Token (Claims: `role === 'platform_admin'`)
- **Request Payload**: None
- **Response Payload**: Array of `TenantRequest`

### `GET /api/v1/admin/rbac-schema`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RBACSchemaRole`

### `GET /api/v1/admin/database-status`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "status": "Healthy", "activeConnections": 18, "storageUsedMb": 1042.5 }`

### `GET /api/v1/admin/audit-logs`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AdminAuditLog`

### `GET /api/v1/admin/access-grants`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AccessGrant`

### `GET /api/v1/admin/feature-flags`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `FeatureFlag`

### `GET /api/v1/admin/rate-limits`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RateLimitRule`

### `GET /api/v1/admin/broadcasts`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `SystemBroadcast`

### `GET /api/v1/admin/telemetry`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "services": [...], "metrics": [...] }`

### `GET /api/v1/admin/domains`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Platform Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DomainOversightRecord`

---

## 9. ML Operations API (`mlOpsApi`)

### `GET /api/v1/mlops/models`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin (`role === 'mlops_admin'`) / Platform Admin
- **Token Required**: Firebase ID Token (Claims: `role === 'mlops_admin'` or `platform_admin`)
- **Request Payload**: None
- **Response Payload**: Array of `MLModelRecord`

### `GET /api/v1/mlops/llm-gateway/routing-rules`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `LLMRoutingRule`

### `GET /api/v1/mlops/milp-weights`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `MilpWeights`

### `PUT /api/v1/mlops/milp-weights`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `MilpWeights`
- **Response Payload**: Updated `MilpWeights`

### `GET /api/v1/mlops/alert-rules`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AlertRule`

### `GET /api/v1/mlops/fastapi-config`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `FastApiServiceConfig`

### `PUT /api/v1/mlops/fastapi-config`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `FastApiServiceConfig`
- **Response Payload**: Updated `FastApiServiceConfig`

### `GET /api/v1/mlops/retrain-schedule`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `RetrainSchedule`

### `PUT /api/v1/mlops/retrain-schedule`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: `RetrainSchedule`
- **Response Payload**: Updated `RetrainSchedule`

### `GET /api/v1/mlops/labeled-batches`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `LabeledDataBatch`

### `GET /api/v1/mlops/canary-deployments`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `CanaryDeployment`

### `GET /api/v1/mlops/pipeline-nodes`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `PipelineNode`

### `GET /api/v1/mlops/experiments`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `MLExperiment`

### `GET /api/v1/mlops/registry-diff`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `RegistryDiffItem`

### `GET /api/v1/mlops/llm-gateway/config`
- **Owner**: FastAPI ML Service
- **Role & Scope**: MLOps Admin
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**:
```json
{
  "primaryProvider": "Gemini 3.5 Flash",
  "fallbackProvider": "Groq LPU",
  "maxLatencyMs": 250,
  "costCapPerRequest": 0.002
}
```

---

## 10. Auditor & Researcher API (`auditApi`)

### `GET /api/v1/audit/overview`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor (`role === 'auditor'`), read-only
- **Token Required**: Firebase ID Token (Claims: `role === 'auditor'`)
- **Request Payload**: None
- **Response Payload**: `{ "totalLogs": 48210, "complianceRate": 99.4, "verifiedChainLength": 12850 }`

### `GET /api/v1/audit/logs`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AuditLogRecord`

### `GET /api/v1/audit/requests`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `AuditRequest`

### `GET /api/v1/audit/domains`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DomainOversightRecord`

### `GET /api/v1/audit/data-flow`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `DataFlowNode`

### `GET /api/v1/audit/model-cards`
- **Owner**: Gateway → Proxies to FastAPI ML Service
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ModelCard`

### `GET /api/v1/audit/fairness-reports`
- **Owner**: Gateway → Proxies to FastAPI ML Service
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `FairnessReport`

### `GET /api/v1/audit/tenant-history`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `TenantHistoryEntry`

### `GET /api/v1/audit/export-config`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "format": "JSON", "redactionLevel": "Strict" }`

### `GET /api/v1/audit/settings`
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Auditor
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "auditRetentionDays": 365, "strictMode": true }`

---

## 11. Common Utilities & Real-Time Event Stream

### `GET /api/v1/activity` (`activityApi.getActivityLogs`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `ActivityHistoryItem`

### `POST /api/v1/activity` (`activityApi.logActivity`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: `ActivityHistoryItem`
- **Response Payload**: Logged `ActivityHistoryItem`

### `GET /api/v1/notifications` (`notificationsApi.getNotifications`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: Array of `Notification`

### `PATCH /api/v1/notifications/{id}/read` (`notificationsApi.markAsRead`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "success": true }`

### `POST /api/v1/notifications/mark-all-read` (`notificationsApi.markAllAsRead`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: None
- **Response Payload**: `{ "success": true }`

### `POST /api/v1/notifications` (`notificationsApi.addNotification`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: System / Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: `Partial<Notification>`
- **Response Payload**: `Notification`

### `GET /api/v1/tenant-privacy/check?tenantId={tenantId}` (`tenantPrivacyApi.checkTenantPrivacy`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: Query param `tenantId`
- **Response Payload**: `boolean`

### `POST /api/v1/tenant-privacy/verify-access` (`tenantPrivacyApi.verifyAccess`)
- **Owner**: Spring Boot Gateway
- **Role & Scope**: Authenticated User
- **Token Required**: Firebase ID Token
- **Request Payload**: `{ "userRole": "institution_admin", "targetTenant": "inst-cmu-01" }`
- **Response Payload**: `{ "allowed": true, "reason": "Claim matches target tenant" }`

---

### Real-Time Notification SSE Channel (`GET /api/v1/notifications/stream`)
- **Owner**: Spring Boot Gateway
- **Protocol**: Server-Sent Events (SSE / `text/event-stream`)
- **Type**: Persistent HTTP streaming connection
- **Token Required**: Firebase ID Token passed as query parameter `?token=<id_token>` or via `Authorization` header
- **Role & Scope**: Scoped to user's assigned `tenant_id` and `role`
- **Event Schema**:
```json
{
  "id": "sse-9011",
  "timestamp": "2026-08-07T09:25:00Z",
  "type": "FORECAST_DRIFT",
  "severity": "warning",
  "institutionName": "West Coast Institute of Technology",
  "message": "HVAC load variance detected in Science Wing C (+4.2% error drift)."
}
```
- **Client Handling**: Connected via `subscribeToNotifications(onMessage, onError)` in `/lib/api/client.ts`. Closes connection gracefully and falls back to cached/empty feed if backend gateway is unreachable.

---

## 12. Internal Gateway-to-ML-Service Contract

> **Internal Note:** The following documents the internal Service-to-Service payload shape. While the public client-facing API defines endpoints like GET /api/v1/user/forecast with no payload, the Spring Boot Gateway internally intercepts these calls, queries MongoDB for the required historical logs and digital twin data, and proxies the request to the FastAPI ML service as a POST request with a fully hydrated payload.

### Payload Shapes for ML Proxies

#### Forecast & Anomaly Trends (POST /user/forecast, POST /student/forecast, POST /user/anomaly-trends, etc.)
- **Gateway Action**: Fetches ActivityLog records scoped to the caller.
- **ML Service Payload (MLPayloadRequest)**:
  ``json
  {
    "history": [
      {
        "timestamp": "2026-08-01T00:00:00Z",
        "kwhSaved": 12.5,
        "carbonKgSaved": 5.2,
        "savingsUSD": 1.4,
        "ecoPointsEarned": 10
      }
    ]
  }
  ``

#### Optimization Actions (POST /user/optimization-actions, POST /institution/milp-scenarios)
- **Gateway Action**: Fetches the user's DigitalTwinHouse (or DigitalTwinDorm), generates candidate actions based on available appliances (e.g., EV Charger, Heat Pump), and defines the objective weights.
- **ML Service Payload (OptimizationRequest)**:
  ``json
  {
    "weights": { "cost": 1.0, "carbon": 1.0, "comfort": 1.0 },
    "max_actions": 5,
    "candidates": [
      {
        "id": "opt-ev-1",
        "title": "Shift EV Charging to Super Off-Peak",
        "category": "EV Charging",
        "description": "Charge vehicle between 01:00 - 05:00",
        "base_carbon_delta": -4.2,
        "base_cost_delta": -3.50,
        "base_ease_score": 95,
        "base_eco_points": 150
      }
    ]
  }
  ``

