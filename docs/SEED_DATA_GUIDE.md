# VerdantIQ Ecosphere - Comprehensive Role Seed Data & Performed Actions Guide

> **Target Database:** MongoDB Atlas / Local MongoDB (`VerdantIQ`)  
> **Total Provisioned Personas:** 8 Distinct System Personas  
> **Total Domain Collections:** 46 Collections  
> **Total Seed Documents:** 206+ Real-World Documents with Performed Actions & Audit Trails  

---

## 1. Quick Execution Guide

### Option A: From Workspace Root (CLI)
```bash
node seed_all_roles.js
```

### Option B: From Next.js Frontend (`VerdantIQCLIENT`)
```bash
cd VerdantIQCLIENT
npm run seed
```

### Option C: Trigger via REST API
```bash
# Seed or Reset database via Next.js API route
curl -X POST http://localhost:3000/api/db/seed -H "Content-Type: application/json" -d "{\"reset\": true}"
```

---

## 2. All 8 User Role Logins & Performed Action Matrix

| # | Role | Email | Password | Tenant ID | Display Name & Organization | Primary Performed Actions Seeded |
|---|------|-------|----------|-----------|-----------------------------|----------------------------------|
| **1** | `ADMIN` | `admin@verdantiq.io` | `AdminPassword2026!` | `tenant_verdantiq_core` | **Alexander Vance**<br/>VerdantIQ Core System | • Defined 8 Granular RBAC Role Schemas<br/>• Configured 6 API Gateway Rate Limit Rules<br/>• Published 4 System Broadcasts & Emergency Alerts<br/>• Toggled Feature Flags (`enable_xgboost_forecast_v2`)<br/>• Approved Temporary Elevated Access Grants<br/>• Logged 6 Global Execution Audit Trails |
| **2** | `REGION` | `region@tn.gov.in` | `RegionPassword2026!` | `tenant_tn_district_board` | **Dr. K. Senthil Nathan**<br/>State District Board 1 | • Monitored 4 Campus Domains (`pacific.edu`, `stanford.edu`, etc.)<br/>• Configured State Net-Zero 2026 Policy & Water Codes<br/>• Established EUI Baselines ($110.0\text{ kWh/m}^2$) & Carbon Factors<br/>• Created Inter-Campus Net-Zero Spring Cup Challenge<br/>• Approved New Tenant Onboarding Requests<br/>• Handled High-Priority Campus Support Tickets |
| **3** | `INSTITUTION` | `admin@institution.org` | `InstitutionPassword2026!` | `tenant_institution_org` | **Dr. Eleanor Vance**<br/>Pacific State University System | • Mapped GPS Geofence Boundary Polygons (North Quad & Dorm Village)<br/>• Aggregated 4 Department Resource Consumption Dashboards<br/>• Scheduled Automated Monthly ISO 50001 & GRI PDF Reports<br/>• Configured Whitelisted Email Domains (`@pacific.edu`)<br/>• Approved Campus Dormitory Energy Setback Challenges<br/>• Resolved High-Voltage Chiller Bypass Valve Escalations |
| **4** | `DEPT` | `dept@institution.org` | `DeptPassword2026!` | `tenant_institution_org` | **Prof. Marcus Sterling**<br/>Facility Science & CS Labs | • Formed 3 Department Sub-Cohorts (CS HPC Lab, Robotics Squad)<br/>• Verified Student Action Proof Photos (36.0 kWh Lab Shutdown)<br/>• Awarded 460+ EcoPoints to Students<br/>• Launched Department Server Power-Down Challenges<br/>• Configured Temperature Triggers ($21.5^\circ\text{C}$ to $23.5^\circ\text{C}$)<br/>• Logged Equipment Maintenance Escalation Cases |
| **5** | `AUDIT` | `auditor@esg-verify.org` | `AuditorPassword2026!` | `tenant_institution_org` | **Elena Rostova**<br/>External ESG Verification Directorate | • Submitted Formal Audit Data Requests for Sub-Meter Logs<br/>• Audited Redacted Immutable Logs with Automated PII Scrubbing<br/>• Verified End-to-End Data Lineage Flow Nodes (Smart Meter $\to$ OCR $\to$ GRI)<br/>• Verified Cryptographic SHA-256 Hash Chains<br/>• Formatted Export Profiles (GRI 302 & ISO 50001 Packages)<br/>• Digitally Signed Off Annual Institutional ESG Statements |
| **6** | `MLOPS` | `mlops@verdantiq.io` | `MlopsPassword2026!` | `tenant_verdantiq_core` | **Tariq Al-Mansoor**<br/>Applied AI & ML Systems | • Registered XGBoost v2.4 Forecaster & IsolationForest Anomaly Models<br/>• Configured Automated Cron Retraining Schedules (`0 2 * * 0`)<br/>• Set 90/10 Canary Deployment Traffic Splitting<br/>• Tuned MILP SCIP Optimization Weights ($w_{\text{carbon}}=0.5, w_{\text{cost}}=0.3$)<br/>• Configured Model Drift and P99 Latency Alert Rules<br/>• Managed AI Omnibar Provider Routing (Gemini & Groq) |
| **7** | `STUDENT` | `student@institution.org` | `StudentPassword2026!` | `tenant_institution_org` | **Maya Lin**<br/>West Village Dorm 304B | • Monitored Digital Twin Dorm Room (142W, 22.1°C, Active Eco Mode)<br/>• Joined 3 Geofenced Campus Challenges (Reusable Mug Week, Stairway Sprint)<br/>• Published Academic Sustainability Project on Dorm Photovoltaic Arrays<br/>• Posted Dorm Power Saving Guides to Student Community Hub<br/>• Logged 30 Daily Eco-Actions (84.5 kWh saved, $42.3\text{ kg CO}_2$ reduced)<br/>• Earned 1,450 EcoPoints with Active 14-Day Streak |
| **8** | `HOUSEHOLD` | `user@verdantiq.org` | `UserPassword2026!` | `tenant_res_user` | **David & Sarah Chen**<br/>Eco-Residence hh-101 | • Configured Home Digital Twin (2,400 sq ft, Rooftop Solar, Heat Pump, EV)<br/>• Linked 4 Smart Devices (Emporia Vue Smart Meter, Ecobee Pro, Tesla Charger)<br/>• Set Monthly Reduction Goals (25% Grid Draw Cut, Zero Overnight Vampire Load)<br/>• Received Monthly Audit Statements (Grade A+, $89.20 USD saved)<br/>• Browsed Green Marketplace Rewards (LEDs, Organic Market Vouchers)<br/>• Logged 30 Daily Actions (286.0 kWh saved, 2,800 EcoPoints earned) |

---

## 3. Seeded MongoDB Collections & Schemas

| Collection | Schema Key / Model | Record Count | Role Alignment |
|---|---|---|---|
| `users` | `User.java` / Next.js Auth | 8 | All 8 User Roles |
| `institutions` | `InstitutionRecord.java` | 4 | System / Region / Executive |
| `rbacschemaroles` | `RBACSchemaRole.java` | 8 | Admin Role Governance |
| `ratelimitrules` | `RateLimitRule.java` | 6 | Admin Security |
| `systembroadcasts` | `SystemBroadcast.java` | 4 | Admin Communications |
| `featureflags` | `FeatureFlag.java` | 6 | Admin Dynamic Configuration |
| `accessgrants` | `AccessGrant.java` | 2 | Admin Elevated Access |
| `admin_audit_logs` | `AdminAuditLog.java` | 6 | Admin Unredacted Audit Trail |
| `domainoversightrecords` | `DomainOversightRecord.java` | 4 | Regional Authority |
| `regionalpolicyconfigs` | `RegionalPolicyConfig.java` | 2 | Regional Governance |
| `regionalbenchmarks` | `RegionalBenchmark.java` | 3 | Regional Energy Baselines |
| `growthtrenddatapoints` | `GrowthTrendDataPoint.java` | 6 | Regional Trend Curves |
| `sharedchallengetemplates` | `SharedChallengeTemplate.java` | 2 | Regional Inter-Campus Competitions |
| `tenantrequests` | `TenantRequest.java` | 2 | Regional Onboarding Approvals |
| `supporttickets` | `SupportTicket.java` | 2 | Regional Support Escalations |
| `geofencepolygons` | `GeofencePolygon.java` | 2 | Institutional Executive Geofencing |
| `institutiondepartmentrecords` | `InstitutionDepartmentRecord.java` | 4 | Campus Cross-Dept Metrics |
| `executivereportschedules` | `ExecutiveReportSchedule.java` | 2 | Executive PDF Delivery |
| `accepteddomains` | `AcceptedDomain.java` | 3 | Institutional Domain Whitelists |
| `challengeapprovalitems` | `ChallengeApprovalItem.java` | 2 | Campus Challenge Approvals |
| `escalationresolutions` | `EscalationResolution.java` | 1 | Institutional Maintenance Resolutions |
| `subcohorts` | `SubCohort.java` | 3 | Department Lab & Class Squads |
| `studentregistryrecords` | `StudentRegistryRecord.java` | 3 | Department Student Registry |
| `verificationitems` | `VerificationItem.java` | 4 | Student Proof Inspections |
| `deptchallengetemplates` | `DeptChallengeTemplate.java` | 2 | Departmental Energy Challenges |
| `escalationcases` | `EscalationCase.java` | 2 | Departmental Facility Maintenance |
| `auditrequests` | `AuditRequest.java` | 2 | ESG Auditor Data Requests |
| `redactedauditlogs` | `RedactedAuditLog.java` | 3 | Immutable Sanitized Audit Records |
| `dataflownodes` | `DataFlowNode.java` | 6 | End-to-End Data Lineage Graph |
| `exportconfigs` | `ExportConfig.java` | 2 | Regulatory Export Formats |
| `ml_models` | `MLModelRecord` | 5 | MLOps Model Registry |
| `retrain_schedules` | `RetrainSchedule` | 2 | Automated Retraining Jobs |
| `canary_deployments` | `CanaryDeployment` | 1 | Canary Traffic Splitting |
| `ml_alert_rules` | `AlertRule` | 2 | ML Model Drift & Latency Rules |
| `llm_routing_rules` | `LLMRoutingRule` | 2 | AI Omnibar Routing |
| `digitaltwindorms` | `DigitalTwinDorm.java` | 1 | Student Dorm Room Digital Twin |
| `geofencedchallenges` | `GeofencedChallenge.java` | 3 | Student Campus Challenges |
| `academicprojects` | `AcademicProject.java` | 2 | Student Sustainability Research |
| `communitydatas` | `CommunityData.java` | 2 | Campus Eco-Forums & Discussions |
| `Households` | `DigitalTwinHouse.java` | 1 | Household Digital Twin |
| `linkeddevices` | `LinkedDevice.java` | 4 | Smart Meters, Thermostats, EV Chargers |
| `user_goals` | `UserGoal.java` | 3 | Household Sustainability Targets |
| `user_reports` | `UserReport.java` | 2 | Household Monthly Statements |
| `reward_items` | `RewardItem.java` | 4 | EcoPoint Reward Catalog |
| `activity_logs` | `ActivityLog.java` | 60 | Performed Actions for Students & Residents |
| `AuditLogs` | `AuditLog.java` | 6 | Cryptographic Platform Audit Trail |
