# VerdantIQ Ecosphere — Pure JavaScript Sustainability Intelligence Platform

A high-performance full-stack campus and district sustainability intelligence platform.
Built with **React 19 + Vite 8 + Express.js + MongoDB Atlas + Groq LPU + Google Gemini**, utilizing **100% Pure JavaScript** (Zero Python services, Zero Java services, Zero TypeScript source files).

---

## 1. System Architecture Overview

- **Frontend Tier**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons, Windows 11 Fluent UI / Mica desktop shell.
- **Backend Tier**: Node.js & Express API, native MongoDB driver, Node.js `crypto` module for tamper-evident SHA-256 hash chains.
- **Pure JavaScript Analytics & Forecasting**:
  - **Holt-Winters Exponential Smoothing**: Level (α) & Trend (β) campus electricity load projections.
  - **Multi-Objective Pareto Solver**: Evaluates non-dominated cost ($), carbon (kg CO₂e), and thermal comfort trade-offs.
  - **Forecast Accuracy Evaluator**: Statistical metrics including Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE).
- **Dual AI Integration**:
  - **Primary**: Hardware-accelerated Groq LPU (`llama-3.3-70b-versatile`).
  - **Standby Fallback**: Google Gemini (`gemini-3.6-flash`).

---

## 2. The 8 System Roles & Complete 85 Screen Allocation

| Role | Role ID | Screens | Key Workflows & Routes |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin` | **11** | `/admin-dashboard`, `/admin/telemetry`, `/admin/database`, `/admin/audit-logs`, `/admin/tenant-requests`, `/admin/domains`, `/admin/feature-flags`, `/admin/rate-limits`, `/admin/rbac-schema`, `/admin/access-grants`, `/admin/broadcasts` |
| **ML Ops Admin** | `mlops` | **11** | `/mlops-dashboard`, `/mlops/models`, `/mlops/optimizer`, `/mlops/llm-gateway`, `/mlops/experiments`, `/mlops/data-pipeline`, `/mlops/alerts`, `/mlops/registry-diff`, `/mlops/canary`, `/mlops/fallback-console`, `/mlops/settings` |
| **Auditor / Researcher** | `audit` | **11** | `/audit-dashboard`, `/audit/overview`, `/audit/logs`, `/audit/export`, `/audit/domains`, `/audit/tenant-history`, `/audit/requests`, `/audit/model-cards`, `/audit/data-flow`, `/audit/fairness-reports`, `/audit/settings` |
| **Regional Admin** | `region` | **10** | `/region/dashboard`, `/region/institutions`, `/region/benchmark`, `/region/reports`, `/region/tenant-requests`, `/region/domains`, `/region/analytics`, `/region/settings`, `/region/students`, `/region/support-tickets` |
| **Institution Admin** | `institution` | **10** | `/institution-dashboard`, `/institution/analytics`, `/institution/departments`, `/institution/domains`, `/institution/geofence`, `/institution/students`, `/institution/challenges`, `/institution/verify`, `/institution/reports`, `/institution/settings` |
| **Department Moderator** | `dept` | **10** | `/dept/dashboard`, `/dept/verify`, `/dept/escalate`, `/dept/members`, `/dept/students`, `/dept/onboarding-requests`, `/dept/challenges/templates`, `/dept/analytics`, `/dept/reports`, `/dept/settings` |
| **Student** | `student` | **11** | `/student/register`, `/student/dashboard`, `/student/digital-twin`, `/student/forecast`, `/student/optimization`, `/student/assistant`, `/student/challenges`, `/student/community`, `/student/academic-projects`, `/student/rewards`, `/student/history` |
| **Household / User** | `user` | **11** | `/user/dashboard`, `/user/digital-twin`, `/user/forecast`, `/user/optimization`, `/user/assistant`, `/user/community`, `/user/reports`, `/user/goals`, `/user/devices`, `/user/history`, `/user/rewards` |
| **Total** | | **85** | Complete allocated feature screens fully functional |

---

## 3. Environment Setup & Configuration

Create or update `.env.server` in the `VerdantIQReactClient` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Cluster URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB_NAME="VerdantIQ"

# JWT Authentication
JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server-Side AI API Keys (Never exposed to client bundles)
GROQ_API_KEY="gsk_..."
GEMINI_API_KEY="AIzaSy..."
```

---

## 4. Running the Application

### Install Dependencies
```bash
npm install
```

### Run Full Stack (Frontend + Backend Concurrently)
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Server API runs on `http://localhost:5000`

### Build Production Bundle
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```
