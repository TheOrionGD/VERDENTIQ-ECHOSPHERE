# VerdantIQ Ecosphere

<div align="center">

![VerdantIQ Ecosphere Banner](https://img.shields.io/badge/VerdantIQ-Ecosphere-0A1F2C?style=for-the-badge&logo=github)

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.7-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_/_v7.5-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square&logo=openjdk)](https://openjdk.java.net/)
[![Electron](https://img.shields.io/badge/Electron-v44.5-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-Android_v8.5-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

## Tagline

AI-powered governance, operations, digital twin ecosystems, and decision intelligence platform for institutions, departments, students, households, and regional authorities.

## Overview

VerdantIQ Ecosphere is an enterprise-grade multi-service platform engineered to unify institutional oversight, operations management, student engagement, residential digital twin tracking, ML-driven forecasting, security controls, and ESG compliance into a single software ecosystem. The system features a Windows 11-inspired multi-morphism user experience with desktop (Electron) and mobile (Capacitor Android) cross-platform distributions, an enterprise Java Spring Boot API Gateway for secure orchestration and RBAC, and a high-performance Python FastAPI ML Gateway for XGBoost forecasting, IsolationForest anomaly detection, MILP SCIP optimization, OCR pipeline execution, and LLM gateway routing.

The repository contains a full-stack, tri-service architecture with strict separation of concerns:

- **Frontend & Cross-Platform Client ([`VerdantIQCLIENT`](VerdantIQCLIENT))**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Lucide icons, Three.js 3D visualizations, and an 8-style Morphism Engine (Obsidian Glassmorphism, Neumorphism, Claymorphism, etc.) deployed across Web, Desktop (Electron v44), and Android (Capacitor v8.5).
- **Enterprise API Gateway ([`VerdantIQServices/sb-gateway`](VerdantIQServices/sb-gateway))**: Java 17 + Spring Boot 4.0.7 coordinating 15 domain subpackages (RBAC, Rate Limiting, Audit trails, Actuator health, MongoDB Atlas persistence, and internal service proxying).
- **ML Intelligence Gateway ([`VerdantIQServices/ml-gateway`](VerdantIQServices/ml-gateway))**: Python 3.11 + FastAPI delivering microsecond inference for energy & resource forecasting (`forecast_v1.0.0` / `forecast_v1.1.0`), OCR document intake, MILP optimization, and AI Omnibar LLM routing (Gemini 2.4 & Groq SDK).
- **Multi-Tenant MongoDB Data Layer**: 46 distinct collections spanning 8 authenticated personas with cryptographic SHA-256 audit chaining and granular tenant isolation.
- **Automated Operations Scripts ([`script/`](script/))**: One-click orchestration batch scripts for development, production multi-service launches, Electron Windows installer packaging, and Android APK builds.

This platform is architected for institutional campuses, regional governance directorates, ESG compliance auditors, facility managers, student cohorts, and modern eco-conscious households.

---

## Developer Story

When building digital systems for modern educational and institutional organizations, we repeatedly encountered the same systemic problem: fragmented systems built around separate tools for reporting, operations, access management, workflow governance, and AI analytics. Teams ended up connecting spreadsheets, internal portals, legacy dashboards, and one-off scripts to compensate for gaps in a shared operating model.

VerdantIQ Ecosphere was built as a response to that fragmentation. The goal was to design a platform that could support real operational workflows without sacrificing clarity, security, or usability. Instead of treating each module as an isolated feature, the system was designed as a coherent product with common identity, data integrity, policy controls, and decision intelligence shared across all layers.

The project reflects a product mindset: build a system that is not only technically capable but also operationally useful to real teams. From the first wireframe to the current architecture, the emphasis has remained on reliability, data flow clarity, and ability to serve multiple stakeholders with different access needs.

### Why We Built It

We built VerdantIQ Ecosphere to solve a practical problem in modern organizations: the lack of a single command surface for operational oversight, academic/departmental processes, security reporting, AI reasoning, and domain intelligence.

Organizations need more than isolated dashboards; they need systems that can:

- track institutional performance and operational status,
- route tasks and approvals through clear actions,
- govern access and policy boundaries,
- detect anomalies and risk signals early,
- support complex decision workflows with explanation,
- preserve strong privacy and auditability controls.

The platform aims to close those gaps by combining workflow orchestration, AI, and governance under a common product architecture.

### Who We Are

This project represents a collaborative engineering effort focused on building software that can support operationally complex environments with strong user accountability and modern AI integrations. The work combines product design, software engineering, systems architecture, security, and data operations.

### Challenges Faced

The design and implementation process involved several key challenges:

1. Creating a clean multi-service architecture across multiple ecosystems.
2. Balancing user productivity with policy enforcement and auditability.
3. Integrating AI services without introducing ungoverned decision paths.
4. Supporting multiple access patterns for admins, students, departments, and institutions.
5. Managing real-world operational data integrity in a distributed service model.
6. Keeping the platform understandable for both developers and non-technical stakeholders.

### How We Built It

The platform was designed around a layered, service-oriented architecture:

- The frontend provides a polished, dashboard-led user experience.
- The gateway handles routing, authentication policies, and security enforcement.
- The ML service focuses on prediction and optimization tasks.
- Datastores preserve long-term state and relationship records.

This separation allows each domain to evolve independently while maintaining a single operational model for customers.

### Security & UX

Security and usability were treated as first-class concerns. The platform includes access boundaries, role-aware patterns, API-level controls, environment separation, and an attention to workflow clarity. The design supports both technical governance and product usability, rather than balancing them as separate goals.

### Key Learnings

The project reinforced several engineering lessons:

- clear boundaries reduce failure modes,
- observability is essential in distributed systems,
- AI features are more effective when grounded in explicit operational workflows,
- governance is a product feature, not just a technical checkbox,
- strong user design is required for operational adoption.

### Future Roadmap

The roadmap includes continued production hardening, deeper reporting automation, more advanced policy orchestration, stronger model governance, and expanded compatibility across broader institutional workflows.

### Developer Message

This project is designed for developers who care about maintainability, clarity, and systems thinking. It reflects a practical understanding that strong software is not only made of clean code but also of sensible boundaries, thoughtful security design, and realistic operational constraints.

---

## Table of Contents
 
- [1. Project Overview](#project-overview)
- [2. Product Vision and Goals](#product-vision-and-goals)
- [3. Platform Capabilities & 8 Stakeholder Personas](#platform-capabilities)
- [4. Solution Architecture & Microservice Topology](#solution-architecture)
- [5. Services and Components](#services-and-components)
- [6. Windows 11 Multi-Morphism Design System](#windows-11-multi-morphism-design-system)
- [7. Repository Layout](#repository-layout)
- [8. Technology Stack](#technology-stack)
- [9. Seed Data & Performed Actions Guide](#seed-data--performed-actions-guide)
- [10. Desktop (Electron) & Mobile (Android) Distributions](#desktop-electron--mobile-android-distributions)
- [11. Local Development Setup](#local-development-setup)
- [12. Configuration and Environment Variables](#configuration-and-environment-variables)
- [13. Running the Full System (Local & Cloud Render)](#running-the-full-system)
- [14. Frontend Application & UI Shell](#frontend-application)
- [15. API Gateway (Spring Boot 4)](#api-gateway)
- [16. ML Gateway (FastAPI & MLOps)](#ml-gateway)
- [17. Data, Persistence & 46 MongoDB Collections](#data-and-persistence)
- [18. Authentication, RBAC and Security](#authentication-and-authorization)
- [19. Security and Privacy](#security-and-privacy)
- [20. API Contract and Integration Model](#api-contract-and-integration-model)
- [21. Workflow Documentation](#workflow-documentation)
- [22. Testing Strategy](#testing-strategy)
- [23. Deployment and Operations](#deployment-and-operations)
- [24. Monitoring and Observability](#monitoring-and-observability)
- [25. Troubleshooting](#troubleshooting)
- [26. Community and Contribution](#community-and-contribution)
- [27. GitHub CLI Workflow](#github-cli-workflow)
- [28. Roadmap](#roadmap)
- [29. FAQ](#faq)
- [30. License](#license)

---

## Project Overview

VerdantIQ Ecosphere is a multi-layer software system providing a complete operational and intelligence layer for institutions and related stakeholders. It is not just a dashboard—it is an operating system for data-driven decision flows, governance, and AI-enabled operations.

### Core Product Principles

- User-centered workflow design
- Clear domain boundaries
- Human-readable operational data
- Secure and auditable access
- AI assistance grounded in real process logic
- Reliable, maintainable multi-service architecture

### Strategic Goals

1. Develop a unified digital operations surface for institutional ecosystems.
2. Reduce operational inefficiency caused by fragmented systems.
3. Bring analytics and decision support closer to actual workflows.
4. Provide system-level observability for administrators and support teams.
5. Make AI utilities trustworthy and actionable rather than isolated experiments.

### Business Problems Solved

| Problem Area | Existing Pain | VerdantIQ Approach |
| --- | --- | --- |
| Operational visibility | Separate data sources and static reporting | Unified dashboards and real-time operational contexts |
| Access governance | Scattered permissions and unclear role boundaries | Centralized policy-aware authorization |
| Reporting complexity | Manual aggregation across sources | Shared data model and service-layer orchestration |
| AI adoption | Isolated models disconnected from tasks | Embedded workflow-aware ML features |
| Student and institutional coordination | Disjoint communication paths | Shared workflow and dashboard experience |
| Security and compliance | Hard-to-audit processes | Logging, policy enforcement, and audit artifacts |

---

## Product Vision and Goals

### Vision

To create a digital platform that gives institutions, departments, students, and administrators a unified way to understand operational realities, make informed decisions, and act on them with confidence.

### Mission

Build a platform that combines operational intelligence, governance, AI support, and accessible user workflows into a single cohesive software experience.

### Goals

- Provide useful operational dashboards for multiple audience types
- Support multi-tenant and domain-aware data handling
- Maintain strict boundaries for authentication and access control
- Empower operators with ML-driven forecasting and anomaly detection
- Scale cleanly from local implementation to larger production environments

---

## Platform Capabilities

### Core Capabilities

| Capability | Description | Example Usage |
| --- | --- | --- |
| Dashboard intelligence | Unified overview of operational information | Department-level performance review |
| Access and role control | Secure user interaction and domain-aware access | Admin, staff, student segmentation |
| Data workflows | Structured operations and event-driven processes | Approval and escalation management |
| Forecasting | Predictive models for planning and operations | Demand or performance forecasting |
| Anomaly detection | Identify abnormal trends and outliers | Risk or operational anomaly review |
| OCR and document processing | Extract information from uploaded documents | Document intake and validation |
| Optimization | Solve planning and scheduling issues | Resource and workload optimization |
| LLM gateway integration | Connect to AI reasoning services | Assistant and analytics support |
| Auditability | Capture traceable operational records | Compliance and review processes |
| Notification flows | Keep stakeholders informed | Alerts, updates, and escalation events |

### Stakeholder View & 8 Core Personas
 
| Persona / Role | Target Tenant | Primary Needs & Focus | Codebase Workspace & Route | Visual Identity Profile |
|---|---|---|---|---|
| **System Administrator** (`ADMIN`) | `tenant_verdantiq_core` | System-wide RBAC, rate-limiting, feature flags, emergency broadcasts, audit oversight | `/admin`, `/admin-dashboard` | Obsidian Glassmorphism + Flat Design |
| **Regional Authority** (`REGION`) | `tenant_tn_district_board` | Inter-campus benchmarks, EUI net-zero baselines, regional policy enforcement, campus support tickets | `/region`, `/region-dashboard` | Flat Design + Material Design |
| **Institution Executive** (`INSTITUTION`) | `tenant_institution_org` | Campus geofence polygons, cross-dept analytics, ISO 50001 PDF reports, chiller bypass escalations | `/institution`, `/institution-dashboard` | Material Design + Layered Glassmorphism |
| **Department Lead** (`DEPT`) | `tenant_institution_org` | Sub-cohort labs (HPC/Robotics), student proof photo verification, EcoPoints awards, facility cases | `/dept`, `/dept-dashboard` | Neumorphism + Flat Design |
| **ESG Auditor** (`AUDIT`) | `tenant_institution_org` | Data lineage graph (Meter $\to$ OCR $\to$ GRI), immutable SHA-256 hash chains, PII-scrubbed logs | `/audit`, `/audit-dashboard` | Flat Design + Frosted Glassmorphism |
| **MLOps Architect** (`MLOPS`) | `tenant_verdantiq_core` | XGBoost v2.4 forecasters, IsolationForest models, canary traffic splits (90/10), AI Omnibar routing | `/mlops`, `/mlops-dashboard` | Material Design + Glassmorphism |
| **Student** (`STUDENT`) | `tenant_institution_org` | West Village Dorm digital twin (142W), campus green challenges, EcoPoints streaks, academic projects | `/student`, `/student-dashboard` | Claymorphism + Soft Neumorphism |
| **Household Resident** (`HOUSEHOLD`/`USER`) | `tenant_res_user` | Eco-Residence digital twin, smart meter & EV charger telemetry, vampire load reduction, green marketplace | `/dashboard`, `/household-dashboard` | Polymorphic Glassmorphism + Material |

---

## Solution Architecture

### High-Level Architecture

```mermaid
flowchart LR
    User[Users / Admins / Students / Staff] --> FE[Next.js Frontend\nVerdantIQCLIENT]
    FE --> GW[Spring Boot API Gateway\nVerdantIQServices/sb-gateway]
    GW --> AUTH[Auth & Policy Layer]
    GW --> ML[FastAPI ML Gateway\nVerdantIQServices/ml-gateway]
    GW --> DB[(MongoDB / Atlas)]
    ML --> MODELS[Model Store / Forecasting / OCR / Optimization]
    ML --> LLM[LLM / AI Services]
    GW --> NOTIF[Notifications / Audit / Logs]
```

### Layered System Model

```mermaid
flowchart TB
    subgraph Presentation
        A[Web UI\nNext.js + React]
    end

    subgraph Application
        B[Gateway Services\nSpring Boot REST APIs]
        C[Workflow / Metrics / Security]
    end

    subgraph Intelligence
        D[Python ML Services\nFastAPI]
        E[Forecast / OCR / Optimization]
    end

    subgraph Data
        F[(MongoDB)]
        G[Object/Blob Storage]
    end

    A --> B
    B --> D
    B --> F
    D --> F
    D --> G
    B --> C
```

### Deployment Topology

```mermaid
graph TD
    Browser[Web Browser] --> FE[Frontend: localhost:3000]
    FE --> GW[Gateway: localhost:8080]
    GW --> ML[ML Service: localhost:8000]
    GW --> MONGO[(MongoDB Atlas / Local)]
    ML --> MODELSTORE[Model artifacts]
    ML --> OCR[OCR pipeline]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Next.js Client
    participant GW as Spring Gateway
    participant AUTH as Auth / Policy
    participant ML as ML Service
    participant DB as MongoDB

    U->>FE: Request dashboard or action
    FE->>GW: API request with token
    GW->>AUTH: Validate identity and permissions
    AUTH-->>GW: Access result
    alt Authorized
        GW->>DB: Load relevant institutional records
        GW->>ML: Trigger forecast / analysis / OCR
        ML-->>GW: Model response
        GW-->>FE: Structured data payload
        FE-->>U: Render dashboard / result
    else Forbidden
        GW-->>FE: 401/403 response
        FE-->>U: Access denied
    end
```

---

## Services and Components

### 1. Frontend Application

The frontend is implemented in the [VerdantIQCLIENT](VerdantIQCLIENT) directory. It is a Next.js application built around route-driven dashboards, institutional modules, and feature-specific UI experiences.

It includes:

- landing pages and authentication screens,
- role-aware dashboards,
- institutional and department views,
- audit and reporting sections,
- admin and monitoring modules,
- AI and ML operational surfaces.

### 2. API Gateway

The Java gateway lives in [VerdantIQServices/sb-gateway](VerdantIQServices/sb-gateway). It coordinates most application traffic and provides:

- dependency injection for service boundaries,
- route management,
- JWT/Firebase-based validation patterns,
- security configuration,
- database access and document models,
- audit and activity record infrastructure,
- notification and SSE support,
- proxying to ML workloads and support services.

### 3. ML Gateway

The Python service is in [VerdantIQServices/ml-gateway](VerdantIQServices/ml-gateway). It provides:

- FastAPI route exposure,
- model loading and metadata handling,
- forecasting endpoints,
- anomaly detection logic,
- OCR-related operational routes,
- optimization and scheduling endpoints,
- AI and LLM gateway services.

### 4. Shared Product Domain Boundary

The product is organized around business domains such as:

- admin,
- institution,
- department,
- region,
- student,
- audit,
- security,
- notifications,
- tenant privacy,
- MLOps.

These domain modules are intentionally separated to improve maintainability and domain clarity.

---

---
 
+## Windows 11 Multi-Morphism Design System
+
+VerdantIQ Ecosphere implements a native Windows 11-inspired desktop computing experience with an **8-Style Multi-Morphism Design Engine** that dynamically adapts its visual and tactile language based on the authenticated user's role, task, and security context:
+
+### 1. The 8 Morphism Styles
+
+- **Obsidian Glassmorphism (`admin`)**: Premium dark smoked-glass backgrounds, semi-transparent obsidian/graphite surfaces, backdrop blur, inner reflections, and crisp silver-white borders for high-security administrative command.
+- **Material Design (`mlops`, `institution`)**: Structured elevation, surface depth, clear motion choreography, and tactile cards for complex operations and metrics.
+- **Neumorphism (`dept`)**: Soft debossed/embossed surfaces and tactile toggle switches for department lab controllers and approval workflows.
+- **Claymorphism (`student`)**: Soft, rounded, friendly inflated surfaces and vivid accents for student challenges, badges, and streaks.
+- **Flat Design (`audit`, `region`)**: High-contrast, two-dimensional, maximum-density tables and data grids for ESG verification and legal data lineage.
+- **Skeuomorphism**: Realistic physical metaphors, dials, and hardware meter displays utilized in digital twin telemetry widgets.
+- **Neubrutalism**: High-contrast, bold borders, and stark warning shadows for emergency system broadcasts and critical incident overrides.
+- **Polymorphism (`user`)**: Adaptive UI blending glassmorphism, responsive density, and material surfaces for residential digital twin dashboards.
+
+### 2. Desktop Shell Architecture
+
+- **Windows 11 App Header & Action Center**: Native title bar with minimize/maximize/close actions, Mica material backdrop, system notifications flyout, and quick settings toggles (`WindowsQuickSettings.tsx`, `WindowsActionCenter.tsx`).
+- **Global Command Palette (`Ctrl + K`)**: Universal keyboard-first search, role action triggering, system routing, and Omnibar execution (`WindowsCommandPalette.tsx`).
+- **Mobile Rotary Navigation (`WindowsMobileWheelNav.tsx`)**: Touch-optimized radial wheel navigation for Android and mobile web interfaces.
+- **Voice Command Engine**: Integrated voice recognition widget supporting spoken navigation and operational telemetry queries (`VoiceCommandWidget.tsx`).
+
+---
+
 ## Repository Layout
 
 ```text
 Ecosphere/
 ├── .env                                  # Root environment variables
 ├── .env.example                          # Root environment template
 ├── .gitignore                            # Workspace git ignore rules
 ├── LICENSE                               # MIT License
 ├── README.md                             # Comprehensive system architecture & developer guide
 ├── VerdantIQ_System_Tracker_and_Roadmap.xlsx # Detailed system tracker & delivery roadmap
 ├── DESIGN                                # Windows 11 Multi-Morphism master design spec
 ├── ICON                                  # Lucide & iconography mapping specifications
 ├── script/                               # Automated multi-service operational scripts
 │   ├── build_android_app.bat             # Compiles Capacitor Android debug & release APKs
 │   ├── build_release.bat                 # Packages Electron desktop Windows installers (NSIS/ZIP)
 │   ├── run_production_app.bat            # Quick prod runner for local testing
 │   ├── start_all.bat                     # Interactive Dev/Prod tri-service microservice launcher
 │   └── start_electron_desktop.bat        # Launches native Electron desktop connected to live services
 ├── Software/                             # Packaged distribution artifacts & seed guides
 │   ├── SEED_DATA_GUIDE.md                # 8 Persona logins, 46 collections, 206+ seed docs
 │   ├── VerdantIQ 1.0.3.exe               # Windows desktop installer
 │   ├── VerdantIQ-1.0.3-win.zip           # Windows portable desktop release bundle
 │   └── VerdantIQ-1.0.3-android-release-signed.apk # Android mobile application release package
 ├── VerdantIQCLIENT/                      # Next.js 15 + Electron + Capacitor Frontend Client
 │   ├── .env                              # Client API connection & environment config
 │   ├── capacitor.config.ts               # Capacitor Android bridge configuration
 │   ├── electron/                         # Native Electron desktop process
 │   │   ├── main.js                       # Electron window lifecycle & IPC handler
 │   │   ├── preload.js                    # Secure desktop context bridge
 │   │   └── icon.ico                      # Application icon asset
 │   ├── android/                          # Native Android Gradle workspace
 │   ├── app/                              # Next.js App Router (33 role-based route directories)
 │   │   ├── admin/ & admin-dashboard/     # System Administrator Obsidian workspace
 │   │   ├── region/ & region-dashboard/   # Regional Authority Net-Zero workspace
 │   │   ├── institution/ & institution-dashboard/ # Institutional Executive analytics
 │   │   ├── dept/ & dept-dashboard/       # Department Lead & lab verification
 │   │   ├── audit/ & audit-dashboard/     # ESG Auditor data lineage & GRI exports
 │   │   ├── mlops/ & mlops-dashboard/     # MLOps Model Registry, Canaries & SCIP
 │   │   ├── student/ & student-dashboard/ # Student Dorm digital twin & green quests
 │   │   ├── dashboard/ & household-dashboard/ # Residential Eco-Home digital twin
 │   │   ├── api/                          # Next.js serverless API routes (db/seed, etc.)
 │   │   ├── globals.css                   # Tailwind CSS v4 + Multi-Morphism engine styles
 │   │   └── providers.tsx                 # Auth, Theme, Morphism, & Desktop contexts
 │   ├── components/                       # Modular UI Component Library
 │   │   ├── auth/                         # Multi-role authentication & onboarding
 │   │   ├── dashboard/                    # Role-specific dashboard layouts & analytics
 │   │   ├── dev/                          # Seed data & dev tool modals
 │   │   ├── landing/                      # High-converting glassmorphic landing surface
 │   │   ├── mlops/                        # Model registry, inference monitors, SCIP sliders
 │   │   ├── region/                       # GIS map layers & inter-campus leaderboards
 │   │   ├── shared/                       # Data tables, KPI cards, PDF export buttons
 │   │   ├── shell/                        # Windows 11 AppHeader, Command Palette, WheelNav
 │   │   └── ui/                           # Reusable morphism primitives (buttons, dialogs)
 │   ├── context/                          # Global React context providers
 │   │   ├── AuthContext.tsx               # 8-Persona state, tenant switching & token storage
 │   │   ├── MorphismContext.tsx           # 8-Style Morphism Engine state & class resolver
 │   │   ├── DesktopContext.tsx            # Electron window management & native controls
 │   │   └── VoiceCommandContext.tsx       # Spoken voice command routing engine
 │   ├── docs/API_CONTRACT.md              # Client-to-Gateway API contract definitions
 │   └── scripts/seed_database.js          # MongoDB seed automation script
 │
 ├── VerdantIQServices/                    # Backend Microservices
 │   ├── ml-gateway/                       # Python 3.11 + FastAPI ML Gateway (Port 8000)
 │   │   ├── pyproject.toml                # Dependencies (XGBoost, OR-Tools, Tesseract, etc.)
 │   │   ├── app/
 │   │   │   ├── main.py                   # FastAPI initialization & CORS middleware
 │   │   │   ├── api/endpoints/            # Forecast, Anomaly, MLOps, OCR, Optimization, LLM
 │   │   │   ├── core/                     # Internal service key auth & logging config
 │   │   │   ├── model_store/              # Versioned XGBoost forecast models (v1.0.0, v1.1.0)
 │   │   │   └── schemas/                  # Pydantic request & response validation schemas
 │   │   └── test_fastapi_routes.py        # Automated test suite
 │   │
 │   └── sb-gateway/                       # Java 17 + Spring Boot 4.0.7 API Gateway (Port 8080)
 │       ├── pom.xml                       # Maven POM (Spring Data MongoDB, Security, Actuator)
 │       ├── src/main/java/com/verdantiq/gateway/
 │       │   ├── GatewayApplication.java   # Spring Boot bootstrap
 │       │   ├── activity/                 # Performed action tracking & student activity logs
 │       │   ├── admin/                    # System RBAC schemas, rate limits, broadcasts
 │       │   ├── audit/ & auditor/         # Cryptographic SHA-256 audit chaining & data lineage
 │       │   ├── auth/                     # JWT authentication, token validation & security
 │       │   ├── config/                   # CORS, Security filter chain, MongoDB Atlas config
 │       │   ├── dept/                     # Sub-cohorts, verification items & escalations
 │       │   ├── institution/              # Geofence polygons, department records & reports
 │       │   ├── mlops/                    # ML model records, canary deployments & alert rules
 │       │   ├── notifications/            # SSE and system notification dispatch
 │       │   ├── region/                   # Regional policy configs, benchmarks & tenant requests
 │       │   ├── student/                  # Digital twin dorms, challenges & academic projects
 │       │   ├── tenantprivacy/            # Tenant isolation & PII sanitization filters
 │       │   └── user/                     # Household digital twins, linked smart meters & goals
 │       └── src/main/resources/
 │           └── application.yaml          # Port 8080, MongoDB URI, ML service URL & JWT secret
 └── ...
 ```

---

## Technology Stack
 
 ### Frontend & Cross-Platform
 
 | Component | Technology | Version | Purpose in Codebase |
 | --- | --- | --- | --- |
 | Web Framework | Next.js App Router | `15.1.7` (Turbopack) | Server & client routing across 33 role directories |
 | UI Library | React | `19.0.0` | React 19 concurrent features & server components |
 | Language | TypeScript | `5.7.3` | End-to-end typed contracts, DTOs & state interfaces |
 | Styling Engine | Tailwind CSS | `v4.0.0` | Modern CSS `@theme` tokens, glassmorphism utilities |
 | Desktop Runtime | Electron & Electron Builder | `44.5.1` / `26.15.3` | Native Windows desktop installer (`.exe`) & portable bundle |
 | Mobile Bridge | Capacitor Android | `8.5.3` | Native Android build integration, Gradle packaging |
 | 3D Visualization | Three.js | `0.174.0` | Digital twin campus and interactive energy visualizers |
 | Animation | Motion (`motion/react`) | `12.4.7` | Fluid micro-interactions, spring transitions |
 | Iconography | Lucide React | `0.475.0` | 100+ Windows 11-inspired iconography mappings |
 | AI Omnibar SDKs | `@google/genai` & `groq-sdk` | `2.4.0` / `1.5.0` | Client-side intelligent assistant & voice command processing |
 
 ### Backend Microservices
 
 | Component | Technology | Version | Purpose in Codebase |
 | --- | --- | --- | --- |
 | Core API Gateway | Spring Boot (Java) | `4.0.7` (Java 17) | Enterprise orchestration, Actuator metrics, RBAC, proxying |
 | Gateway Build Tool | Apache Maven | `3.9+` (`mvnw.cmd`) | Multi-dependency Java lifecycle management |
 | ML Gateway | FastAPI (Python) | `0.100+` (Python 3.11) | High-speed async REST endpoints for inference & OCR |
 | ML ASGI Server | Uvicorn | `0.23+` | Asynchronous worker process management on port 8000 |
 | Database Driver | Spring Data MongoDB / `mongodb` | `Spring Data` / `v7.5` | Reactive document mapping & seed data execution |
 
 ### AI, Optimization & ML Services
 
 | Component | Technology | Version | Usage in ML Gateway |
 | --- | --- | --- | --- |
 | Forecasting | XGBoost & Scikit-learn | `xgboost>=2.0`, `scikit-learn>=1.3` | Energy load, demand forecasting (`forecast_v1.0.0`, `v1.1.0`) |
 | Anomaly Detection | IsolationForest | `scikit-learn` | Real-time outlier detection in sub-meter readings |
 | Optimization | Google OR-Tools | `ortools>=9.7.0` | Mixed Integer Linear Programming (MILP SCIP) resource solver |
 | Document OCR | Tesseract OCR & Pillow | `pytesseract>=0.3.10`, `PIL>=10.0` | Digitization and intake of utility receipts & ESG audit forms |
 | LLM Orchestration | Groq & Gemini Gateway | Custom REST Adapters | Multi-provider AI Omnibar prompt routing and assistant responses |
 
 ### Persistence & Security
 
 | Component | Technology | Purpose in System |
 | --- | --- | --- |
 | Primary Database | MongoDB Atlas / Local MongoDB (`VerdantIQ`) | 46 specialized domain collections, GeoJSON polygons |
 | Authentication | JWT + Custom Spring Security Filters | HMAC-SHA256 signed stateless tokens (`JWT_SECRET`) |
 | Internal Auth | `INTERNAL_SERVICE_KEY` | Header-based secure communication between Gateway and ML Service |
 | Audit Chaining | SHA-256 Cryptographic Hash Chaining | Immutable audit trails preventing historical log tampering |
 
 ---
 
 ## Seed Data & Performed Actions Guide
 
 The codebase includes a comprehensive seed architecture creating **8 fully-realized user roles**, **46 collections**, and **206+ real-world documents with pre-performed operational actions** across institutional campuses, research labs, student dorms, and residential homes.
 
 ### The 8 User Personas & Test Credentials
 
 | Role | Login Email | Default Password | Tenant Context | Seeded Name & Organization | Primary Performed Actions Seeded |
 |---|---|---|---|---|---|
 | **`ADMIN`** | `admin@verdantiq.io` | `AdminPassword2026!` | `tenant_verdantiq_core` | **Alexander Vance**<br/>Core System Authority | Defined 8 RBAC schemas, 6 rate-limit rules, published 4 system broadcasts, approved elevated grants, logged 6 unredacted audit trails |
 | **`REGION`** | `region@tn.gov.in` | `RegionPassword2026!` | `tenant_tn_district_board` | **Dr. K. Senthil Nathan**<br/>State District Board 1 | Monitored 4 campus domains, established Net-Zero 2026 EUI baselines ($110\text{ kWh/m}^2$), created Spring Cup Challenge, approved tenants |
 | **`INSTITUTION`** | `admin@institution.org` | `InstitutionPassword2026!` | `tenant_institution_org` | **Dr. Eleanor Vance**<br/>Pacific State University | Mapped GPS geofence boundary polygons, aggregated 4 department metrics, scheduled automated ISO 50001 PDF delivery |
 | **`DEPT`** | `dept@institution.org` | `DeptPassword2026!` | `tenant_institution_org` | **Prof. Marcus Sterling**<br/>Facility Science & CS Labs | Formed 3 sub-cohorts (CS HPC Lab), verified student action proof photos (36 kWh saved), awarded 460+ EcoPoints, resolved equipment cases |
 | **`AUDIT`** | `auditor@esg-verify.org` | `AuditorPassword2026!` | `tenant_institution_org` | **Elena Rostova**<br/>ESG Verification Directorate | Requested sub-meter logs, verified data lineage nodes (Meter $\to$ OCR $\to$ GRI), checked SHA-256 hash chains, signed annual ESG statements |
 | **`MLOPS`** | `mlops@verdantiq.io` | `MlopsPassword2026!` | `tenant_verdantiq_core` | **Tariq Al-Mansoor**<br/>Applied AI Systems | Registered XGBoost v2.4 forecasters, set 90/10 canary deployments, tuned MILP SCIP optimization weights ($w_{\text{carbon}}=0.5, w_{\text{cost}}=0.3$) |
 | **`STUDENT`** | `student@institution.org` | `StudentPassword2026!` | `tenant_institution_org` | **Maya Lin**<br/>West Village Dorm 304B | Monitored digital twin dorm room (142W, 22.1°C), joined 3 campus challenges, published PV research paper, logged 30 daily eco-actions |
 | **`HOUSEHOLD`** | `user@verdantiq.org` | `UserPassword2026!` | `tenant_res_user` | **David & Sarah Chen**<br/>Eco-Residence hh-101 | Configured 2,400 sq ft smart home, linked Emporia Vue meter & Tesla EV charger, reduced vampire load by 25%, earned 2,800 EcoPoints |
 
 ### How to Seed the Database
 
 ```bash
 # Option 1: Using the Frontend Seed Script
 cd VerdantIQCLIENT
 npm run seed
 
 # Option 2: Using the REST API
 curl -X POST http://localhost:3000/api/db/seed -H "Content-Type: application/json" -d "{\"reset\": true}"
 ```
 
 ---
 
 ## Desktop (Electron) & Mobile (Android) Distributions
 
 The platform is fully packaged for desktop and mobile environments beyond standard browser deployment:
 
 ### Windows Desktop Application (Electron v44)
 - **Pre-built Installers**: Located in [`Software/`](Software/):
   - [`VerdantIQ 1.0.3.exe`](Software/VerdantIQ%201.0.3.exe) (NSIS Windows Installer)
   - [`VerdantIQ-1.0.3-win.zip`](Software/VerdantIQ-1.0.3-win.zip) (Portable distribution)
 - **Desktop Launcher**: Double-click [`script/start_electron_desktop.bat`](script/start_electron_desktop.bat) to launch the native desktop window connected to live cloud services.
 - **Build from Source**:
   ```bash
   cd VerdantIQCLIENT
   npm run desktop:build
   ```
 
 ### Android Mobile Application (Capacitor v8.5)
 - **Pre-built APK**: [`Software/VerdantIQ-1.0.3-android-release-signed.apk`](Software/VerdantIQ-1.0.3-android-release-signed.apk)
 - **Build from Source**: Run [`script/build_android_app.bat`](script/build_android_app.bat) to auto-detect the Android SDK, sync Capacitor web assets, and compile debug and release APKs via Gradle:
   ```bash
   script\build_android_app.bat
   ```
   Install on a connected device via ADB:
   ```bash
   adb install VerdantIQCLIENT\android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

## Local Development Setup

### Prerequisites

Before running the project locally, ensure the following are installed:

- Git
- Node.js 20+
- npm
- Python 3.11+
- Java 17+
- Maven wrapper included in the Java project
- MongoDB access capability for the configured Atlas URI

### Clone

```bash
git clone https://github.com/TheOrionGD/VERDENTIQ-ECHOSPHERE.git
cd VERDENTIQ-ECHOSPHERE
```

### Install Frontend Dependencies

```bash
cd VerdantIQCLIENT
npm install
```

### Install Python Dependencies

```bash
cd VerdantIQServices/ml-gateway
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\activate  # Windows
pip install -U pip
pip install -e .
```

### Build Java Gateway

```bash
cd VerdantIQServices/sb-gateway
./mvnw clean install
```

### Verify Tools

```bash
node -v
npm -v
python --version
java -version
```

---

## Configuration and Environment Variables

### Frontend

The frontend uses environment variables for external access configuration. Example values:

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
NEXT_PUBLIC_ML_GATEWAY_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

### ML Gateway

Example configuration file:

```env
INTERNAL_SERVICE_KEY=<set-in-process-environment>
APP_ENV=development
MODEL_PATH=./app/model_store
LOG_LEVEL=INFO
```

### Spring Boot Gateway

The gateway reads its runtime configuration from application properties/yaml. Example:

```yaml
server:
  port: 8080

spring:
  data:
    mongodb:
      uri: ${MONGODB_URI}
```

### Security Notes

- Do not commit secrets to source control.
- Use environment variables or local secret management for production credentials.
- Keep service keys different across local, test, and production environments.

---

## Running the Full System

The repository provides automated startup scripts inside the [`script/`](script/) directory for both development and production operations.

### Quick Start: Automated Multi-Service Launcher

To launch all 3 microservices simultaneously in separate console windows:

```cmd
script\start_all.bat
```

This interactive launcher prompts for execution mode:
- **`[1] Production Mode`**: Builds Next.js frontend, runs Spring Boot with `-Dspring.profiles.active=prod`, and starts Uvicorn production server.
- **`[2] Development Mode`**: Launches Next.js dev server with Turbopack, Spring Boot with `local` profile, and Uvicorn with auto-reload.

### Service Port Allocation & Live Cloud Deployments

| Service | Architecture | Local Port | Live Cloud Deployment (Render) | Swagger / Health |
| --- | --- | --- | --- | --- |
| **Frontend Client** | Next.js 15 / React 19 | `http://localhost:3000` | [https://verdantiq-client.onrender.com](https://verdantiq-client.onrender.com) | `/api/health` |
| **API Gateway** | Java 17 / Spring Boot 4.0.7 | `http://localhost:8080` | [https://verdantiq-sb-gateway.onrender.com](https://verdantiq-sb-gateway.onrender.com) | `/actuator/health` |
| **ML Gateway** | Python 3.11 / FastAPI | `http://localhost:8000` | [https://verdantiq-ml-gateway.onrender.com](https://verdantiq-ml-gateway.onrender.com) | `/docs`, `/health` |

### Manual Startup Sequence (Individual Services)

If you prefer launching each microservice manually in separate terminals:

```powershell
# 1. ML Gateway (FastAPI — Port 8000)
cd VerdantIQServices/ml-gateway
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Spring Boot Gateway (Java — Port 8080)
cd VerdantIQServices/sb-gateway
.\mvnw.cmd spring-boot:run

# 3. Next.js Client (Port 3000)
cd VerdantIQCLIENT
npm run dev
```

#### 2. Start Spring Boot Gateway

```bash
cd VerdantIQServices/sb-gateway
./mvnw spring-boot:run
```

#### 3. Start Frontend

```bash
cd VerdantIQCLIENT
npm run dev
```

### Health Endpoints

| Service | Endpoint | Purpose |
| --- | --- | --- |
| ML Service | http://localhost:8000/docs | Swagger docs |
| ML Health | http://localhost:8000/health | Basic health check |
| Gateway | http://localhost:8080 | API gateway entry |
| Frontend | http://localhost:3000 | App UI |

---

## Frontend Application

### Frontend Structure

The frontend uses a modular route architecture built around dashboard flows and domain-specific sections. The root app contains sections for:

- admin operations,
- institution dashboards,
- department workflows,
- student contexts,
- security policy surfaces,
- MLOps and model oversight,
- help and documentation,
- notifications and settings.

### UI Architecture Patterns

The application uses reusable patterns such as:

- shell layout,
- provider wrappers,
- dashboard cards,
- data tables,
- shared service layers,
- route-based feature organization,
- contextual providers for authentication and theme.

### Frontend Development Workflow

```bash
cd VerdantIQCLIENT
npm run dev
npm run build
npm run lint
```

### Common Frontend Notes

- UI routes are organized by business role and domain.
- Shared assets live under [VerdantIQCLIENT/components](VerdantIQCLIENT/components).
- Service-layer logic is separated into [VerdantIQCLIENT/lib](VerdantIQCLIENT/lib).
- Context providers centralize state concerns for auth, theme, and voice interactions.

---

## API Gateway

The Spring Boot gateway acts as the central orchestration layer between the UI and service backends.

### Gateway Responsibilities

- expose public REST endpoints,
- secure and validate traffic,
- provide routing and proxy behaviors,
- manage audit and activity logging,
- coordinate access to MongoDB-backed entities,
- connect to ML workflows,
- support notification and operational streaming patterns.

### Gateway Features

- MongoDB integration
- Firebase-related auth flows
- OpenAPI documentation support
- security and validation layers
- domain-based controllers and services
- notifications and alerts
- PDF and document-processing support where needed

### Basic Run Command

```bash
cd VerdantIQServices/sb-gateway
./mvnw spring-boot:run
```

### Observability

The project includes actuator support, so health and runtime diagnostics can be leveraged for operational visibility.

---

## ML Gateway

The ML service provides model-based intelligence to the broader system. It is intentionally separated from the main web application so model logic can evolve independently and remain focused on inference and optimization tasks.

### ML Gateway Responsibilities

- expose ML inference routes,
- serve model artifacts,
- support forecasting,
- detect anomalies,
- run optimization routines,
- enable LLM-related orchestration,
- support OCR and document workflows,
- provide health and diagnostics endpoints.

### ML Gateway Endpoints

| Endpoint Route | HTTP Method | Handler Module | Description & Capability |
| --- | --- | --- | --- |
| `/api/v1/forecast/predict` | `POST` | `endpoints/forecast.py` | Generates multi-horizon resource consumption forecasts using XGBoost |
| `/api/v1/anomaly/detect` | `POST` | `endpoints/anomaly.py` | Detects outliers and consumption anomalies via IsolationForest |
| `/api/v1/optimization/solve` | `POST` | `endpoints/optimization.py` | Solves Mixed-Integer Linear Programs (MILP SCIP) for carbon/cost weighting |
| `/api/v1/ocr/extract` | `POST` | `endpoints/ocr.py` | Extracts text and tables from utility bills & documents using Tesseract OCR |
| `/api/v1/llm/query` | `POST` | `endpoints/llm_gateway.py` | Multi-provider AI Omnibar query orchestrator (Gemini 2.4 & Groq) |
| `/api/v1/mlops/models` | `GET`, `POST` | `endpoints/mlops.py` | Model registry management, retraining schedules, and canary deployments |
| `/api/v1/audit/verify` | `POST` | `endpoints/audit.py` | Cryptographic data lineage node & proof validation |
| `/health` | `GET` | `endpoints/health.py` | High-speed health diagnostic check |

### Model Store Hierarchy

```text
VerdantIQServices/ml-gateway/app/model_store/
├── forecast_v1.0.0/
│   ├── metadata.json       # Version, training metrics (MAE/RMSE), feature schema
│   └── model.pkl           # Trained Scikit-Learn/XGBoost estimator
└── forecast_v1.1.0/
    ├── metadata.json       # Updated hyperparameter weights & seasonal features
    └── model.pkl           # Retrained production candidate model
```

---

## Data and Persistence

### Database Strategy & 46 MongoDB Collections

The system utilizes MongoDB Atlas (and local MongoDB) with database name `VerdantIQ` across **46 domain-separated collections**, organized by persona and operational governance:

| Domain / Category | Collections | Key Entity Models (`com.verdantiq.gateway`) |
| --- | --- | --- |
| **System Governance & RBAC** | `users`, `rbacschemaroles`, `ratelimitrules`, `featureflags`, `accessgrants` | `User.java`, `RBACSchemaRole.java`, `RateLimitRule.java`, `FeatureFlag.java` |
| **Regional Administration** | `institutions`, `domainoversightrecords`, `regionalpolicyconfigs`, `regionalbenchmarks`, `growthtrenddatapoints`, `sharedchallengetemplates`, `tenantrequests`, `supporttickets` | `InstitutionRecord.java`, `DomainOversightRecord.java`, `RegionalPolicyConfig.java`, `RegionalBenchmark.java` |
| **Institutional Campus** | `geofencepolygons`, `institutiondepartmentrecords`, `executivereportschedules`, `accepteddomains`, `challengeapprovalitems`, `escalationresolutions` | `GeofencePolygon.java`, `InstitutionDepartmentRecord.java`, `ExecutiveReportSchedule.java` |
| **Department Operations** | `subcohorts`, `studentregistryrecords`, `verificationitems`, `deptchallengetemplates`, `escalationcases` | `SubCohort.java`, `StudentRegistryRecord.java`, `VerificationItem.java`, `EscalationCase.java` |
| **ESG Audit & Lineage** | `auditrequests`, `redactedauditlogs`, `dataflownodes`, `exportconfigs`, `AuditLogs`, `admin_audit_logs` | `AuditRequest.java`, `RedactedAuditLog.java`, `DataFlowNode.java`, `AuditLog.java` |
| **MLOps & AI Tracking** | `ml_models`, `retrain_schedules`, `canary_deployments`, `ml_alert_rules`, `llm_routing_rules` | `MLModelRecord`, `RetrainSchedule`, `CanaryDeployment`, `AlertRule` |
| **Student Ecosystem** | `digitaltwindorms`, `geofencedchallenges`, `academicprojects`, `communitydatas` | `DigitalTwinDorm.java`, `GeofencedChallenge.java`, `AcademicProject.java` |
| **Residential Digital Twin** | `Households`, `linkeddevices`, `user_goals`, `user_reports`, `reward_items` | `DigitalTwinHouse.java`, `LinkedDevice.java`, `UserGoal.java`, `UserReport.java` |
| **Activity Telemetry** | `activity_logs`, `systembroadcasts` | `ActivityLog.java`, `SystemBroadcast.java` |

### Persistence Principles

- **Tenant Isolation**: Strict tenant scoping (`tenant_id`) enforced across all documents to prevent cross-organization data leakage.
- **Data Lineage Graphing**: Complete traceable path from hardware smart meter readings through OCR document intake to final ESG regulatory reports.
- **Cryptographic Hash Chaining**: Immutable SHA-256 block hashing on audit entries to guarantee tamper-evident compliance.

### Data Flow Pattern

```mermaid
flowchart LR
    UI[Frontend] --> API[Gateway]
    API --> DB[(MongoDB)]
    API --> ML[ML Gateway]
    ML --> STORE[Model Store]
    API --> AUDIT[Audit Logs]
    AUDIT --> DB
```

---

## Authentication and Authorization

Authentication and authorization are critical for the system because different user groups and operational domains require different permissions.

### Current Patterns

- Firebase-style identity integration,
- authentication checks in gateway and service layers,
- policy enforcement around API routes,
- token validation in request processing,
- role-aware access boundaries for dashboards and features.

### Access Model & RBAC Enforcement

| Role / Persona | Route Access | Typical Permissions & Security Context |
| --- | --- | --- |
| **`ADMIN`** | `/admin`, `/admin-dashboard` | Full system governance, RBAC schema manipulation, API gateway rate limiting, feature flag toggles, unredacted audit trails |
| **`REGION`** | `/region`, `/region-dashboard` | Regional policy creation, net-zero EUI baseline management, inter-campus challenge templates, tenant onboarding approvals |
| **`INSTITUTION`** | `/institution`, `/institution-dashboard` | Campus geofence polygon management, cross-department metric reviews, executive ISO 50001 PDF report deliveries, chiller bypass resolutions |
| **`DEPT`** | `/dept`, `/dept-dashboard` | Department lab sub-cohort oversight, student proof photo inspections, EcoPoint allocations, equipment maintenance case escalation |
| **`AUDIT`** | `/audit`, `/audit-dashboard` | Sub-meter data request audits, PII-scrubbed redacted log inspection, data lineage node validation, cryptographic SHA-256 hash checks |
| **`MLOPS`** | `/mlops`, `/mlops-dashboard` | Model registry management, automated cron retraining, 90/10 canary traffic splitting, MILP SCIP optimization tuning |
| **`STUDENT`** | `/student`, `/student-dashboard` | Dormitory digital twin monitoring, campus geofenced challenges, EcoAction logging with proof uploads, EcoPoint streak tracking |
| **`HOUSEHOLD`** (`USER`) | `/dashboard`, `/household-dashboard` | Residential home digital twin, Emporia Vue smart meter & EV charger telemetry, vampire load reduction goals, reward marketplace |

### Recommended Best Practice

Use least-privilege access and manage role definitions centrally instead of scattering permission checks across UI-only flows.

---

## Security and Privacy

As a platform that handles institutional data and operational workflows, security is treated as a product requirement rather than an afterthought.

### Security Controls

- environment-based secret management,
- token validation and route authorization,
- audit logging of action paths,
- domain-aware data boundaries,
- restricted exposure between services,
- local versus production environment separation,
- secure API design and structured routing patterns.

### Privacy Considerations

- minimize unnecessary retention of sensitive data,
- separate personally identifiable records from operational logs where possible,
- maintain explicit access boundaries for sensitive institutional records,
- avoid exposure of internal system metadata in UI responses,
- clearly document data usage for users and administrators.

### Security Checklist

- [ ] verify all secrets are in environment variables
- [ ] review all route-level auth guards
- [ ] validate external service access policies
- [ ] confirm MongoDB access is safe and restricted
- [ ] ensure logs exclude sensitive personal data
- [ ] validate secure session/token handling

---

## API Contract and Integration Model

The system exposes a mix of frontend-driven requests and service-to-service interactions.

### API Style

- REST-style endpoints
- JSON payloads
- token-based validation in gateway layer
- structured error responses
- resource-oriented route organization

### Example Request

```bash
curl -X GET "http://localhost:8080/api/health" \
  -H "Authorization: Bearer <token>"
```

### Example Response

```json
{
  "status": "ok",
  "service": "gateway",
  "timestamp": "2026-08-18T00:00:00Z"
}
```

### API Documentation

- Frontend-facing API documentation is present in [VerdantIQCLIENT/docs/API_CONTRACT.md](VerdantIQCLIENT/docs/API_CONTRACT.md)
- FastAPI automatically serves OpenAPI docs at the Python service
- Spring Boot integrates with OpenAPI tooling for gateway docs

---

## Workflow Documentation

### Institutional Workflow Example

```mermaid
flowchart TD
    A[User request] --> B[Frontend captures workflow]
    B --> C[Gateway validates identity]
    C --> D[Policy checks]
    D --> E[Business service logic]
    E --> F[Database persistence]
    E --> G[AI / ML analysis]
    G --> H[Response and audit log]
    H --> I[Dashboard update / notifications]
```

### Decision Flow Example

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gateway
    participant Service
    participant AI
    participant DB

    User->>Frontend: submits form or action
    Frontend->>Gateway: POST /api/action
    Gateway->>Service: validate business rules
    Service->>DB: persist state
    Service->>AI: run contextual insight
    AI-->>Service: prediction / recommendation
    Service-->>Gateway: enriched response
    Gateway-->>Frontend: result payload
    Frontend-->>User: user-facing update
```

---

## Testing Strategy

### Testing Philosophy

The project is built around layered validation to ensure quality from the UI to the service boundary.

### Current Test Coverage

| Layer | Focus | Examples |
| --- | --- | --- |
| Frontend | UI build integrity, linting | Next.js build, TypeScript validation |
| Gateway | application startup and service behavior | Spring Boot tests |
| ML service | API health and middleware | FastAPI route tests |
| Integration | cross-service behavior | local startup verification |

### Validation Commands

```bash
cd VerdantIQCLIENT
npx tsc --noEmit
npm run build
npm run lint
```

```bash
cd VerdantIQServices/ml-gateway
python -m pytest
```

```bash
cd VerdantIQServices/sb-gateway
./mvnw test
```

### What Good Testing Looks Like

- health checks for each service,
- API contract validity,
- environment-specific validation,
- regression testing when workflows evolve,
- safe handling of off-network database conditions.

---

## Deployment and Operations

### Local Development

The project is designed for local startup and debugging. A root-level launcher script is included to start multiple dependency paths in one workflow.

### Production Considerations

For production deployment, consider:

- environment separation,
- reverse proxy layers,
- TLS termination,
- secret management,
- health checks and graceful startup,
- managed MongoDB or Atlas isolation,
- centralized logs,
- backup and restore strategy,
- load balancing for service scaling.

### Deployment Model Example

```mermaid
flowchart TB
    LB[Load Balancer] --> FE[Next.js Frontend]
    FE --> GW[Gateway Cluster]
    GW --> ML[ML Services]
    GW --> MONGO[(MongoDB)]
    GW --> OBS[Monitoring / Logs]
```

---

## Monitoring and Observability

### Key Monitoring Areas

- service startup health,
- request failures,
- database connectivity and latency,
- model inference runtime,
- anomaly or error rates,
- frontend API calls,
- user flows and adoption signals.

### Recommended Observability Stack

| Concern | Recommended Tooling |
| --- | --- |
| Logging | structured app logs |
| Metrics | uptime and latency tracking |
| Health checks | service readiness endpoints |
| Error tracking | centralized exception logs |
| Alerts | notification service / incident routing |

---

## Troubleshooting

### Common Issues

#### 1. MongoDB connection problems

Symptoms:

- Spring gateway fails to start
- database-related exceptions appear in logs
- application context initialization fails

Root cause:

- network access to Atlas or configured database endpoint is unavailable,
- credentials or URI formatting are invalid,
- firewall or network policy blocks outbound DB access.

Recommended action:

- verify DB connectivity from the host,
- confirm the configured MongoDB URI is valid,
- ensure the environment allows outbound access,
- keep the connection string intentional and avoid altering it without justification.

#### 2. Frontend build or TypeScript issues

Symptoms:

- `baseUrl` deprecation warnings,
- compiler warnings,
- missing configuration in TypeScript.

Typical fix:

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}
```

#### 3. ML service not starting

Check:

- Python version compatibility,
- virtual environment activation,
- dependency install status,
- missing environment variables,
- port conflicts.

#### 4. Gateway not responding

Check:

- Java version is 17,
- Maven wrapper is executable,
- environment variables are set,
- database and authentication dependencies are reachable,
- port 8080 is free.

### Useful Commands

```bash
curl http://localhost:8000/health
curl http://localhost:8080/actuator/health
```

```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :8000
```

---

## Community and Contribution

Contributions are welcomed from developers, designers, data specialists, security reviewers, and testers.

### Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests where appropriate
4. Validate the relevant stack layers
5. Submit a pull request with clear summary and impact notes

### Contribution Expectations

- keep commit history readable,
- use clear and descriptive commit messages,
- avoid introducing debug-only changes to production code,
- document new config requirements,
- include validation evidence in pull requests.

### Code Review Expectations

- architecture and design review,
- security review for auth flow changes,
- performance review for new APIs,
- logging and observability review for service changes,
- data/privacy review for new features.

---

## GitHub CLI Workflow

The repository supports a straightforward GitHub CLI workflow for day-to-day maintenance and collaboration.

### Small Project Description

```bash
gh repo edit --description "VerdantIQ Ecosphere is an AI-powered institutional operations and decision intelligence platform built with Next.js, Spring Boot, FastAPI, and MongoDB."
```

### Add Topics

```bash
gh repo edit --add-topic "nextjs,react,typescript,fastapi,spring-boot,mongodb,ai,analytics,education"
```

### View Repository

```bash
gh repo view --web
```

### Create an Issue

```bash
gh issue create --title "Add production deployment checklist" --body "Document runtime prerequisites and environment configuration for production rollout."
```

### Create a Pull Request

```bash
gh pr create --base main --head feature/branch-name --title "Add dashboard improvements" --body "Summary of UI changes and validation steps."
```

### Open a Branch

```bash
git checkout -b feature/my-update
```

### Check Remote Status

```bash
git remote -v
git status
```

### Push with GitHub CLI Support

```bash
gh auth login
```

Then standard Git commands continue to work:

```bash
git add .
git commit -m "Improve backend and documentation"
git push origin HEAD
```

### Release Notes Workflow

```bash
gh release create v0.1.0 --title "Initial system release" --notes "Initial multi-service platform release with frontend, gateway, and ML capabilities."
```

### Workflow Execution

```bash
gh workflow list
gh run list
```

These commands are especially useful when the repository is used as a shared product or academic project repository.

---

## Roadmap

### Near-Term

- formalize production deployment environment files,
- improve service health checks and readiness criteria,
- expand route-level documentation,
- add deeper ML model governance and metadata tracking,
- verify end-to-end path across the full stack in stable conditions.

### Medium-Term

- stronger analytics and decision workflows,
- operational dashboards with richer drilldowns,
- role-aware reporting and policy controls,
- expanded assistant and LLM workflows,
- broader observability and debugging surfaces.

### Long-Term

- enterprise-scale deployment support,
- multi-region or multi-tenant architecture readiness,
- advanced automation, event-driven processing, and AI orchestration,
- deeper audit and compliance tooling,
- stronger product integrations with external institutional systems.

---

## FAQ

### What is VerdantIQ Ecosphere?

VerdantIQ Ecosphere is a multi-service software platform for institutional operations, governance, AI assistance, and decision support.

### Why does it use multiple services?

Service separation allows domain clarity, maintainability, and independent evolution of the frontend, API layer, and ML logic.

### Is this suitable for production?

The codebase is structured for production-minded development, but production deployment still requires environment hardening, strong secret management, and infrastructure validation.

### Can I run it locally?

Yes. The repo includes scripts and direct run instructions for local development.

### Why is MongoDB important?

It provides the persistent document store for operational state, users, records, and domain-related data.

### Why does the system include AI features?

AI features are useful when tied to business workflows such as forecasting, anomaly detection, optimization, and operational insight.

### Do I need Docker?

Not necessarily for local development. The project currently supports a straightforward local startup model.

### Can the frontend and backend be run separately?

Yes. Each subsystem is designed to run independently in a development environment.

---

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## Project Status and Notes

This repository is actively structured as a full-stack, multi-service product platform. It is designed for local development and progressive scaling toward broader deployment scenarios.

The work currently emphasizes:

- service separation,
- multi-domain product architecture,
- secure API design,
- operational observability,
- AI-enriched workflows,
- institutional decision support.

---

## Appendix: Screenshots and Product UI Placeholders

The following placeholders are reserved for product documentation and demo screenshots.

```markdown
![Dashboard Overview](docs/screenshots/dashboard-overview.png)
![Institution Analytics](docs/screenshots/institution-analytics.png)
![Admin Security View](docs/screenshots/admin-security-view.png)
![ML Ops Console](docs/screenshots/mlops-console.png)
![Notification Center](docs/screenshots/notifications.png)
```

Add these assets under a `docs/screenshots/` directory to keep product documentation visually rich and release-ready.

---

## Quick Reference

### Core Commands

```bash
# frontend
cd VerdantIQCLIENT && npm install && npm run dev

# ML service
cd VerdantIQServices/ml-gateway && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# gateway
cd VerdantIQServices/sb-gateway && ./mvnw spring-boot:run
```

### Git Commands

```bash
git status
git add .
git commit -m "Update system documentation"
git push origin theoriongd
```

### GitHub CLI Commands

```bash
gh repo view --web
gh issue create --title "Describe the issue" --body "Detailed description"
gh pr create --base main --head feature/branch-name --title "Feature update" --body "Summary"
```

---

## Final Message

VerdantIQ Ecosphere is a platform built around practical operational intelligence. It combines a strong frontend experience, a backend coordination layer, and ML-powered capabilities to support modern institutional and decision-driven work. The project is designed to be extensible, maintainable, and production-aware while remaining approachable for contributors and stakeholders alike.

The architecture and documentation in this repository are intended to make it easier to understand the system, operate it locally, contribute responsibly, and evolve it into a stronger product over time.

---

## Repository Summary

- **Project**: VerdantIQ Ecosphere
- **Type**: Enterprise-grade AI operations, governance & digital twin multi-service ecosystem
- **Frontend & Clients**: Next.js 15 (React 19, TypeScript, Tailwind CSS v4, Three.js) + Native Windows Desktop (Electron v44.5) + Native Mobile (Capacitor Android v8.5)
- **UI Architecture**: Windows 11 Multi-Morphism Engine (Obsidian Glassmorphism, Neumorphism, Claymorphism, Material, Flat) + Command Palette (`Ctrl + K`) + Rotary Navigation
- **Enterprise API Gateway**: Java 17 + Spring Boot 4.0.7 (15 domain subpackages, Actuator health, Spring Security JWT, Rate Limiting)
- **ML Intelligence Gateway**: Python 3.11 + FastAPI (XGBoost forecasting, IsolationForest anomaly detection, MILP SCIP optimization, Tesseract OCR, Gemini/Groq LLM Gateway)
- **Persistence Layer**: MongoDB Atlas / Local (`VerdantIQ`) spanning 46 collections with cryptographic SHA-256 audit chaining
- **Pre-provisioned Personas**: 8 distinct roles (`ADMIN`, `REGION`, `INSTITUTION`, `DEPT`, `AUDIT`, `MLOPS`, `STUDENT`, `HOUSEHOLD`) with 206+ seeded real-world actions

This README has been fully synchronized against the active codebase architecture, real package dependencies, and production deployment topologies.
