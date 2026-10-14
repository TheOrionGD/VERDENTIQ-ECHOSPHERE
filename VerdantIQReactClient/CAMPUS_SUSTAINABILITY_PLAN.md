# VerdantIQ Ecosphere — Higher Education Campus Sustainability Implementation Plan

Based on research into global university sustainability practices (**AASHE STARS 3.0**, **UNH SIMAP**, **Cornell/UC Berkeley Living Labs**, **1R1C Reduced-Order Thermodynamic Modeling**, and **AI-Driven Gamification Fraud Prevention**), this plan establishes the roadmap to align the VerdantIQ Ecosphere architecture with actual campus operations.

---

## 1. Industry Benchmarks & University Operating Models

### A. Carbon & Utility Accounting (AASHE STARS 3.0 & SIMAP)
1. **Organizational Boundary**:
   - Higher education institutions operate on **Operational Control** boundaries.
   - **Scope 1**: Direct stationary combustion (natural gas central heating plants, campus fleet fuel, backup generators, fugitive refrigerant leaks).
   - **Scope 2**: Purchased grid electricity, steam, and chilled water. Must support both **Location-Based** (regional eGRID factor, e.g., 0.42 kg/kWh) and **Market-Based** (adjusting for purchased Renewable Energy Certificates / RECs).
   - **Scope 3**: Campus commuting modal splits (transit, EV, bike, solo drive), official institution travel, solid waste diversion, and water wastewater treatment.
2. **RECs vs. Carbon Offsets vs. Sinks**:
   - In accordance with AASHE STARS rules, RECs apply solely to Scope 2 market calculations; offsets balance residual gross emissions after efficiency gains.

### B. Student Gamification & Proof Fraud Prevention
1. **Multi-Modal Verification**:
   - **Geofencing**: GPS coordinate verification within campus facility boundary polygons (lat/long radius check).
   - **OCR & Computer Vision**: Auto-detection of utility meter digits, cafeteria compost receipts, and recycling bin categories.
   - **Perceptual Hashing (pHash)**: Rejection of duplicate photo proofs uploaded by friends or taken weeks earlier.
   - **Velocity & Rate Limiting**: Cooldown limits preventing unrealistic point farming (e.g., max 2 bike commutes per day, 6 water bottle refills).

### C. Pure JavaScript Campus Building Digital Twins
1. **1R1C Lumped-Parameter Thermodynamic Physics Engine**:
   - Lightweight browser-executable physics using the First Law of Thermodynamics:
     $$\frac{dT_{in}}{dt} = \frac{1}{C_{th}} \left( \frac{T_{out} - T_{in}}{R_{th}} + Q_{solar} + Q_{hvac} + Q_{internal} \right)$$
   - Runs client-side at 60 FPS in pure JavaScript without server-side compute bottlenecks, simulating HVAC setback curves, solar gain, and thermal comfort bounds.

---

## 2. Implementation Phasing Matrix

### Phase 1: Standards-Compliant Utility & Carbon Models
- Enrich `server/validators.js` and DB collections with Scope 1/2/3 categorization, REC tracking, and eGRID regional subregion factor selectors.
- Implement dual Location-Based vs. Market-Based carbon computations in `server/routes/institutionRoutes.js`.
- Connect AASHE STARS credit readiness tracker (Air & Climate OP-1, Energy OP-2, Waste OP-19) in `InstitutionAnalyticsView.jsx`.

### Phase 2: Physics-Based Building Digital Twin (Pure JavaScript)
- Create `src/lib/physics/buildingThermalModel.js` featuring pure JS Euler integration for indoor air temperature, thermal capacitance ($C_{th}$), envelope resistance ($R_{th}$), and HVAC power.
- Enhance `UserDigitalTwinParametricView.jsx` and campus dormitory twin with dynamic temperature curves, solar irradiance sliders, and comfort band indicators.

### Phase 3: Anti-Fraud Verification Pipeline (Dept Moderator & Student)
- Add client-side canvas perceptual hash generation (`pHash`) to student evidence uploads.
- Wire geotag polygon distance checking to campus coordinates.
- Update `DeptVerificationQueueView.jsx` with duplicate hash alert banners, SLA countdown alarms, and reason code audit logs.

### Phase 4: Multi-Tenant Regional Benchmarking & Cryptographic Auditing
- In `RegionBenchmarkView.jsx`, calculate normalized Energy Use Intensity (EUI in kWh/m²/year) and carbon intensity per student FTE across participating campuses.
- Maintain the SHA-256 tamper-evident log in `AuditDashboard.jsx` verifying immutable utility entries.

---

## 3. Technology Stack & Quality Constraints

- **Strict Pure JavaScript**: 100% `.js` and `.jsx` ES modules. No TypeScript files or types.
- **Vite 8 & React 19**: Clean builds with zero linter warnings.
- **Native MongoDB Driver**: Direct connection to Atlas collections with schema validation.
- **AI Integrations**: Groq LPU primary with Gemini Flash fallback for diagnostic commentary.
