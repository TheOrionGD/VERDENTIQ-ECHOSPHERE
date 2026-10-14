# VerdantIQ Ecosphere: Pure JavaScript (React 19 + Express.js + MongoDB + AI) Implementation Plan

## 1. Core Architecture Principles
1. **100% Pure JavaScript (Zero Java, Zero Python)**:
   - Client: React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts + Windows 11 Fluent UI / Mica Design.
   - Server: Express.js (Node.js) + Native `mongodb` driver connecting to MongoDB Atlas (`VerdantIQ` database).
   - Machine Learning & Statistics: Pure JS implementations for Holt-Winters exponential smoothing, Ordinary Least Squares trend regression, and multi-objective Pareto Frontier candidate solving.
   - Cryptographic Audit: Tamper-evident SHA-256 hash chaining on the server using Node's `crypto` module.
2. **Realistic Institutional Data Boundary**:
   - The **Institution Admin** manages **total campus-wide electricity consumption** and utility billing records.
   - Purchased electricity strictly maps to **Scope 2 emissions** calculated via documented regional grid factors (kg CO₂e/kWh).
   - Department-level oversight focuses strictly on **operational facility/HVAC schedules, maintenance/waste observations, and student EcoPoint challenge verification** (no fabricated department sub-meter data).
3. **Role-Tailored AI Integration (Groq & Google Gemini)**:
   - **Institution Admin**: Executive ESG action plans and energy efficiency recommendations.
   - **MLOps Admin**: Technical model variance and parameter tuning diagnostics.
   - **Department Moderator**: AI student proof review assistant.
   - **Standard User**: Personalized smart home schedule adjustments and off-peak cost savings advice.

---

## 2. 8-Role Realistic Matrix & UI Specifications

| Role | Role ID | Genuine JavaScript & API Capabilities | Windows Fluent UI Components |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin` | Manage institutional accounts; assign RBAC roles; view backend Express & MongoDB health status; monitor system activity and audit logs; global settings. | Fluent CommandBar, Institution DataGrid, Server Status Cards, Role Modal |
| **ML Ops Admin** | `mlops` | View registered models (Holt-Winters, Regression, Pareto Solver); execute demand forecasts; compute cost/carbon trade-offs with configurable weights; review MAE/RMSE metrics; AI model diagnostics. | Model Registry Grid, Forecast Comparison Chart, Pareto Trade-off Curve, Diagnostic Dialog |
| **Auditor / Researcher**| `audit` | View authorized read-only audit records; mathematically verify SHA-256 hash chain integrity; export campus records to CSV or JSON; generate documented Scope 2 emissions report. | Audit DataGrid, Hash Chain Verification Panel, CSV/JSON Export Dialog, Report Preview |
| **Regional Admin** | `region` | Compare participating institutions using normalized campus-level metrics (kWh/student, kWh/sq.ft); track regional targets; identify institutions with missing periodic reports. | Institution Comparison Grid, Normalized Benchmark Chart, Target Progress Cards |
| **Institution Admin** | `institution`| Enter or import total campus electricity readings; record billing period, units (kWh), and tariff costs; review multi-month consumption trends; calculate Scope 2 emissions; generate AI ESG action plan. | ESG Summary Cards, Bill Intake & Review Form, Consumption Chart, Scope 2 Emissions Card, AI Advice Modal |
| **Department Moderator**| `dept` | Publish sustainability challenges; manage lab/library/HVAC operating schedules; submit energy-waste / maintenance observations; review student EcoPoint submissions with Approve/Reject reasons; AI verification assistance. | Schedule Matrix, Waste Alert List, EcoPoint Verification Queue, Challenge Manager, AI Review Helper |
| **Student** | `student` | Browse active eco-challenges; submit photo evidence & notes; track approval status and earned EcoPoints; view badges and campus cohort leaderboards; view institution-wide sustainability summaries. | Challenge Cards, Proof Submission Dialog, Points Dashboard, Cohort Leaderboard, Badge Gallery |
| **Standard User** | `user` | Enter household appliance inventory and tariff rate; estimate monthly bills; simulate appliance usage schedules; view a 7-day demand estimate based on input hours; benchmark against average household usage; AI savings tips. | Appliance Scheduler, 7-Day Demand Forecast Chart, Bill Estimator, Usage Summary Cards, AI Tips Modal |

---

## 3. Technology Stack & Directory Structure

```text
VerdantIQReactClient/
├── .env.server             # MongoDB Atlas URI, JWT, Gemini & Groq API Keys
├── package.json            # Scripts: dev (concurrently frontend + backend)
├── server/                 # Pure JS Express API Backend
│   ├── index.js            # Express REST routes for all 8 roles & system health
│   ├── db.js               # Native MongoDB Atlas connection driver
│   ├── seed.js             # Initial database seeder for institutions, readings, challenges
│   ├── auditEngine.js      # Cryptographic SHA-256 hash chaining & verification
│   ├── mlEngine.js         # Pure JS Holt-Winters, OLS Regression, and Pareto Solver
│   └── aiService.js        # Groq LLaMA 3 & Google Gemini API integrations
├── src/                    # React 19 Frontend (Vite)
│   ├── index.css           # Windows 11 Fluent UI / Mica Design styling tokens
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Shell & Router integration
│   ├── components/
│   │   ├── shell/
│   │   │   ├── WindowsTaskbar.jsx      # Windows 11 centered taskbar & system tray
│   │   │   ├── WindowsStartMenu.jsx    # Start menu with role launcher & search
│   │   │   ├── WindowsWindow.jsx       # Window container with Windows caption buttons
│   │   │   └── WindowsActionCenter.jsx # Action center & toast notifications
│   │   └── roles/
│   │       ├── AdminDashboard.jsx
│   │       ├── MlopsDashboard.jsx
│   │       ├── AuditDashboard.jsx
│   │       ├── RegionDashboard.jsx
│   │       ├── InstitutionDashboard.jsx
│   │       ├── DeptDashboard.jsx
│   │       ├── StudentDashboard.jsx
│   │       └── UserDashboard.jsx
│   └── lib/
│       ├── api.js          # Unified fetch client communicating with /api/*
│       └── authContext.jsx # React context for active role, user state, and auth
```

---

## 4. Execution Phases

### Phase 1: Backend & Database Foundation (Completed)
- [x] Configured native MongoDB Atlas connection in `server/db.js`.
- [x] Implemented SHA-256 cryptographic audit chaining in `server/auditEngine.js`.
- [x] Implemented pure JS Holt-Winters and Pareto optimization solver in `server/mlEngine.js`.
- [x] Connected Groq and Google Gemini AI services in `server/aiService.js`.
- [x] Built complete REST endpoints across all 8 roles with database auto-seeding in `server/index.js`.

### Phase 2: Windows 11 Fluent UI Foundation & Shell
- [ ] Configure Windows 11 Mica & Acrylic glass styling in `src/index.css`.
- [ ] Build Windows 11 Taskbar, Start Menu (8-role launcher), and Window frame with Windows caption buttons (`─`, `□`, `✕`).
- [ ] Wire `AuthContext` to manage the active session and role transitions.

### Phase 3: The 8 Role Dashboards Implementation
- [ ] Platform Admin & MLOps Dashboards.
- [ ] Auditor & Regional District Dashboards.
- [ ] Institution & Department Moderator Dashboards.
- [ ] Student & Household Dashboards.

### Phase 4: Verification & Polish
- [ ] Verify concurrent launch (`npm run dev`) runs Vite + Express seamlessly.
- [ ] Validate MongoDB Atlas live persistence across all forms, approvals, and logs.
