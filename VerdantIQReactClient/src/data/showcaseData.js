export const PERSONAS = [
  {
    id: 'admin',
    num: '01',
    name: 'ADMIN',
    role: 'Central Governance & Policy Authority',
    badge: 'SYSTEM CONTROL',
    description: 'Oversees global tenant orchestration, compliance thresholds, role access boundaries, and enterprise-wide sustainability quotas.',
    stats: {
      activeTenants: '14 Active Clusters',
      complianceRate: '99.98% Cryptographic Integrity',
      health: 'Optimal',
      governanceMode: 'Strict SHA-256 Chaining'
    },
    demoMetrics: [
      { label: 'System Uptime', value: '99.99%', trend: '+0.01%' },
      { label: 'Policy Adherence', value: '100%', trend: 'Verified' },
      { label: 'Audited Nodes', value: '1,428', trend: 'Synced' },
      { label: 'Carbon Abatement', value: '412.8 tCO2e', trend: '-14.2%' }
    ],
    sampleLog: 'ADMIN_CLUSTER: Tenant namespace verified. Cross-region isolation enforced via dynamic RBAC matrix.'
  },
  {
    id: 'region',
    num: '02',
    name: 'REGION',
    role: 'Cross-Jurisdictional Resource Coordinator',
    badge: 'MACRO TOPOLOGY',
    description: 'Manages regional microgrids, cross-border carbon accounting, institutional benchmarks, and localized energy distribution grids.',
    stats: {
      activeTenants: '4 Municipal Zones',
      complianceRate: '98.7% Peak Shaving Compliance',
      health: 'Stable',
      governanceMode: 'Multi-Jurisdiction Aggregate'
    },
    demoMetrics: [
      { label: 'Grid Renewable Ratio', value: '74.2%', trend: '+6.1%' },
      { label: 'Peak Load Shaved', value: '2.84 MW', trend: 'Optimized' },
      { label: 'Regional Facilities', value: '68 Sites', trend: 'Active' },
      { label: 'Offset Portfolio', value: '18,400 t', trend: 'Retiring' }
    ],
    sampleLog: 'REGION_FEED: Regional MILP solver dispatched demand response signals across 12 institutional hubs.'
  },
  {
    id: 'institution',
    num: '03',
    name: 'INSTITUTION',
    role: 'Campus & Facility Operations Director',
    badge: 'CAMPUS DIGITAL TWIN',
    description: 'Coordinates physical building subsystems, HVAC schedules, central chillers, smart metering telemetry, and departmental allocations.',
    stats: {
      activeTenants: '8 Campus Complexes',
      complianceRate: '96.4% HVAC Optimization',
      health: 'Active',
      governanceMode: 'Sub-metered Isolation'
    },
    demoMetrics: [
      { label: 'Chiller COP', value: '6.42', trend: '+12.4%' },
      { label: 'Real-time Draw', value: '840 kW', trend: '-85 kW' },
      { label: 'Comfort Score', value: '94.8 / 100', trend: 'Balanced' },
      { label: 'Daily Energy Cost', value: '$3,180', trend: '-18.5%' }
    ],
    sampleLog: 'INSTITUTION_ENGINE: Digital twin updated with 4,200 sensor telemetry points. HVAC pre-cooling active.'
  },
  {
    id: 'dept',
    num: '04',
    name: 'DEPARTMENT',
    role: 'Unit-Level Operational Resource Custodian',
    badge: 'DEPT LEVEL',
    description: 'Executes localized efficiency initiatives, equipment power telemetry, departmental carbon budgets, and behavioral incentivization.',
    stats: {
      activeTenants: '24 Academic Depts',
      complianceRate: '94.1% Budget Compliance',
      health: 'Normal',
      governanceMode: 'Departmental Ledger'
    },
    demoMetrics: [
      { label: 'Lab Equipment Load', value: '182 kW', trend: 'Base' },
      { label: 'Department Budget Used', value: '68.2%', trend: 'On Track' },
      { label: 'Waste Diversion', value: '89.4%', trend: '+4.2%' },
      { label: 'Plug Load Anomalies', value: '0 Critical', trend: 'Zeroed' }
    ],
    sampleLog: 'DEPT_MONITOR: Physics cleanroom ventilation modulated to high-efficiency idle cycle.'
  },
  {
    id: 'audit',
    num: '05',
    name: 'AUDIT',
    role: 'ESG & Cryptographic Verification Assessor',
    badge: 'VERIFICATION',
    description: 'Inspects immutable telemetry ledgers, SHA-256 chained transaction blocks, statutory ESG reporting, and OCR-extracted supplier bills.',
    stats: {
      activeTenants: 'Complete Read-Only Scope',
      complianceRate: '100% Chain Validated',
      health: 'Certified',
      governanceMode: 'Zero-Knowledge Trace'
    },
    demoMetrics: [
      { label: 'Chained Blocks', value: '842,190', trend: 'Continuous' },
      { label: 'OCR Bill Verification', value: '99.4%', trend: 'Tesseract 5' },
      { label: 'Audit Exceptions', value: '0 Open', trend: 'Cleared' },
      { label: 'GHG Scope 1/2/3', value: 'Verified', trend: 'ISO 14064' }
    ],
    sampleLog: 'AUDIT_CHAIN: Block #842189 verified. Merkle root hash matches statutory utility billing feed.'
  },
  {
    id: 'mlops',
    num: '06',
    name: 'MLOPS',
    role: 'Model Performance & Pipeline Reliability Engineer',
    badge: 'INFERENCE FABRIC',
    description: 'Monitors inference latency, model drift, XGBoost forecast accuracy, Isolation Forest contamination ratios, and MILP SCIP solver convergence.',
    stats: {
      activeTenants: 'FastAPI Gateway v3.11',
      complianceRate: '0.04% Inference Drift',
      health: 'Hyper-responsive',
      governanceMode: 'Automated Retraining'
    },
    demoMetrics: [
      { label: 'Inference Latency', value: '14.2 ms', trend: '-2.1 ms' },
      { label: 'XGBoost RMSE', value: '0.038', trend: 'Optimal' },
      { label: 'Isolation Forest Anomaly Rate', value: '1.24%', trend: 'Calibrated' },
      { label: 'SCIP Solver Time', value: '184 ms', trend: 'Feasible' }
    ],
    sampleLog: 'MLOPS_TELEMETRY: Hourly retrain of 48-hour forward thermal load model completed. No drift detected.'
  },
  {
    id: 'student',
    num: '07',
    name: 'STUDENT',
    role: 'Eco-Champion & Campus Living Participant',
    badge: 'LIVING LAB',
    description: 'Engages in dormitory energy challenges, monitors personal carbon footprint, views digital twin campus heatmaps, and redeems sustainability badges.',
    stats: {
      activeTenants: '18,500 Mobile Users',
      complianceRate: '88% Challenge Completion',
      health: 'Gamified',
      governanceMode: 'Anonymized Peer View'
    },
    demoMetrics: [
      { label: 'Dorm Energy Saved', value: '14.8%', trend: 'Floor 3 Rank #1' },
      { label: 'Green Eco-Tokens', value: '450 pts', trend: '+50 pts' },
      { label: 'Dining Waste Index', value: '-22%', trend: 'Top Quartile' },
      { label: 'Daily Commute Carbon', value: '0.2 kg', trend: 'Micro-mobility' }
    ],
    sampleLog: 'STUDENT_APP: Residence Hall Green Sprint week 3 live. North Tower energy draw down 18%.'
  },
  {
    id: 'household',
    num: '08',
    name: 'HOUSEHOLD',
    role: 'Residential Digital Twin & Tariff Optimizer',
    badge: 'SMART DWELLING',
    description: 'Connects home solar inverters, battery storage, smart heat pumps, dynamic time-of-use tariffs, and simulated conservation routines.',
    stats: {
      activeTenants: 'Edge Gateway Sync',
      complianceRate: '92% Peak Tariff Avoidance',
      health: 'Self-sufficient',
      governanceMode: 'Local Edge Privacy'
    },
    demoMetrics: [
      { label: 'Solar Self-Consumption', value: '88.4%', trend: '+14%' },
      { label: 'Battery Reserve', value: '94%', trend: 'Pre-charged' },
      { label: 'Grid Export Revenue', value: '$42.10/mo', trend: 'Positive' },
      { label: 'Smart Thermostat Delta', value: '-1.5 kW', trend: 'Eco-Mode' }
    ],
    sampleLog: 'HOUSEHOLD_EDGE: EV charging deferred to 02:00 UTC off-peak green surplus pricing window.'
  }
];

export const CORE_FEATURES = [
  {
    num: '01',
    code: 'MOD_XGB_01',
    title: 'Predictive Intelligence Engine',
    subtitle: 'High-dimensional time-series demand forecasting with gradient boosting.',
    description: 'Trained on historical meteorological inputs, occupancy patterns, and dynamic thermal inertia, VerdantIQ’s XGBoost forecasting pipeline predicts future resource draw up to 72 hours ahead with sub-4% mean error rates, driving proactive rather than reactive energy dispatch.',
    specs: ['XGBoost 2.0 Core', '72-Hour Horizon', 'Multi-variate Weather Matrix', 'Quantile Loss Boundaries'],
    pill: 'FORECASTING',
    diagramType: 'forecast'
  },
  {
    num: '02',
    code: 'MOD_ISO_02',
    title: 'Anomaly Intelligence & Isolation Forests',
    subtitle: 'Unsupervised telemetry contamination isolation at microsecond frequencies.',
    description: 'Operating on continuous sensor streams, multi-dimensional Isolation Forests identify equipment degradation, water line leaks, simultaneous heating-and-cooling conflicts, and power anomalies before catastrophic outages or wasted expenditure occur.',
    specs: ['Isolation Forest Ensemble', 'Zero-Label Bootstrapping', 'Sub-20ms Contamination Scoring', 'False-Positive Suppression'],
    pill: 'ANOMALY DETECTION',
    diagramType: 'anomaly'
  },
  {
    num: '03',
    code: 'MOD_OPT_03',
    title: 'Decision Optimization (MILP / SCIP)',
    subtitle: 'Mathematical constraint programming for cost & carbon abatement trade-offs.',
    description: 'Real-world physical operations require rigorous mathematical balancing. Using Mixed-Integer Linear Programming (MILP) solved via high-performance SCIP libraries, the engine determines optimal chiller sequencing, battery dispatch, and microgrid loads under complex tariffs.',
    specs: ['SCIP Mathematical Solver', 'Mixed-Integer Convex Sets', 'Dynamic TOU Tariff Models', 'Carbon-Cost Pareto Frontier'],
    pill: 'OPTIMIZATION',
    diagramType: 'optimization'
  },
  {
    num: '04',
    code: 'MOD_OCR_04',
    title: 'Document & Utility Intelligence',
    subtitle: 'Automated invoice parsing and billing verification with Tesseract OCR.',
    description: 'Utility invoices and supplier billing sheets frequently arrive as unstructured PDFs. VerdantIQ utilizes Tesseract optical character recognition alongside structural regex and token normalization to parse kilowatt-hours, peak demand surcharges, and municipal water volumes directly into audit ledgers.',
    specs: ['Tesseract OCR Engine', 'Automated Table Parsing', 'Variance Reconciliation', 'Billed vs Metered Delta Engine'],
    pill: 'DOCUMENT PARSING',
    diagramType: 'ocr'
  },
  {
    num: '05',
    code: 'MOD_LLM_05',
    title: 'Contextual AI Workflows & Orchestration',
    subtitle: 'Synthesized reasoning and natural language diagnostics via Gemini & Groq.',
    description: 'Bridging deep telemetry with actionable operational insights, fast inference models synthesize multi-sensor reports, compose compliance summaries for facility managers, and answer natural language diagnostic queries with deterministic citations.',
    specs: ['Dual Gemini / Groq Runtimes', 'Deterministic Grounded Citations', 'Zero Hallucination Telemetry Links', 'Automated ESG Briefing Generation'],
    pill: 'AI ASSISTANCE',
    diagramType: 'llm'
  },
  {
    num: '06',
    code: 'MOD_OPS_06',
    title: 'Connected Operational Intelligence',
    subtitle: 'Unified telemetry streaming across physical assets, submeters, and distributed nodes.',
    description: 'Eliminates operational silos by aggregating distributed submetering, building management systems (BMS), weather stations, and mobile citizen inputs into a synchronized real-time operational state fabric.',
    specs: ['Reactive Event Streams', '46 MongoDB Unified Collections', 'Distributed Edge Synchronization', 'End-to-End Latency < 100ms'],
    pill: 'OPERATIONS',
    diagramType: 'operations'
  }
];

export const MORPHISM_STYLES = [
  {
    id: 'glass',
    name: 'Obsidian Glassmorphism',
    tag: 'WIN 11 FLUENT',
    desc: 'Deep translucent dark emerald backdrop with optical refraction, backdrop blur, and frosted rim lighting.',
    cardStyle: {
      background: 'rgba(16, 41, 35, 0.65)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(166, 217, 106, 0.25)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    },
    buttonStyle: {
      background: 'rgba(166, 217, 106, 0.2)',
      border: '1px solid rgba(166, 217, 106, 0.5)',
      color: '#A6D96A',
      backdropFilter: 'blur(8px)'
    }
  },
  {
    id: 'material',
    name: 'Material Design 3',
    tag: 'GOOGLE M3',
    desc: 'Elevation-based surface hierarchy with tonal surfaces, crisp drop shadows, and expressive geometric radii.',
    cardStyle: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-light)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      borderRadius: '16px'
    },
    buttonStyle: {
      background: '#267A58',
      color: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 2px 6px rgba(38, 122, 88, 0.3)'
    }
  },
  {
    id: 'neumorphism',
    name: 'Soft Neumorphism',
    tag: 'DUAL SHADOW',
    desc: 'Extruded tactile relief using dual offset ambient and specular shadows mimicking molded physical surfaces.',
    cardStyle: {
      background: '#EAEFE9',
      border: 'none',
      boxShadow: '9px 9px 18px #cbd2ca, -9px -9px 18px #ffffff',
      borderRadius: '20px',
      color: '#17221E'
    },
    buttonStyle: {
      background: '#EAEFE9',
      boxShadow: '4px 4px 8px #cbd2ca, -4px -4px 8px #ffffff',
      color: '#123D32',
      borderRadius: '12px'
    }
  },
  {
    id: 'claymorphism',
    name: 'Tactile Claymorphism',
    tag: '3D CLAY',
    desc: 'Inflatable matte pillowy geometries with heavy inner shadows, soft ambient outer drops, and toy-like tactile feel.',
    cardStyle: {
      background: '#E5F0E8',
      borderRadius: '24px',
      boxShadow: '12px 12px 24px rgba(18, 61, 50, 0.12), inset -6px -6px 12px rgba(18, 61, 50, 0.08), inset 6px 6px 12px rgba(255, 255, 255, 0.9)',
      border: 'none',
      color: '#123D32'
    },
    buttonStyle: {
      background: '#A6D96A',
      borderRadius: '18px',
      boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1), inset -2px -2px 6px rgba(0,0,0,0.1), inset 2px 2px 6px rgba(255,255,255,0.7)',
      color: '#081A17',
      fontWeight: 'bold'
    }
  },
  {
    id: 'flat',
    name: 'Pure Precision Flat',
    tag: 'MINIMALIST',
    desc: 'Zero simulated depth, zero blur, zero drop shadows. Pure typographic authority, 1px rules, and mathematical grid density.',
    cardStyle: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'none',
      borderRadius: '0px'
    },
    buttonStyle: {
      background: '#123D32',
      color: '#FFFFFF',
      border: '1px solid #123D32',
      borderRadius: '0px'
    }
  },
  {
    id: 'skeuomorphism',
    name: 'Industrial Skeuomorphism',
    tag: 'PHYSICAL DIAL',
    desc: 'Milled brushed bezel textures, metallic top highlights, engraved debossed indicators, and analog physical precision.',
    cardStyle: {
      background: 'linear-gradient(145deg, #1f473c, #14332a)',
      border: '1px solid #2f5f51',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 8px 16px rgba(0,0,0,0.4)',
      borderRadius: '12px',
      color: '#F0F5F2'
    },
    buttonStyle: {
      background: 'linear-gradient(180deg, #378b67 0%, #1a5c41 100%)',
      border: '1px solid #4da77e',
      color: '#FFFFFF',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
    }
  },
  {
    id: 'neubrutalism',
    name: 'High-Impact Neubrutalism',
    tag: 'RAW CONTRAST',
    desc: 'Thick unyielding 3px stark borders, hard offset unblurred rectangular drop shadows, and unapologetic punchy contrast.',
    cardStyle: {
      background: '#FFFFFF',
      border: '3px solid #17221E',
      boxShadow: '6px 6px 0px #17221E',
      borderRadius: '4px',
      color: '#17221E'
    },
    buttonStyle: {
      background: '#A6D96A',
      border: '2px solid #17221E',
      boxShadow: '3px 3px 0px #17221E',
      color: '#17221E',
      fontWeight: '700'
    }
  },
  {
    id: 'polymorphism',
    name: 'Adaptive Polymorphism',
    tag: 'DYNAMIC CONTEXT',
    desc: 'Dynamic hybrid state that mutates between high-contrast technical HUD mode and subtle editorial daylight mode.',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(38,122,88,0.15) 0%, rgba(18,61,50,0.05) 100%)',
      border: '1px solid var(--border-strong)',
      borderLeft: '4px solid var(--color-intelligent-lime)',
      borderRadius: '8px'
    },
    buttonStyle: {
      background: 'var(--color-primary-forest)',
      color: '#FFFFFF',
      border: '1px solid var(--border-light)',
      borderRadius: '6px'
    }
  }
];

export const ARCHITECTURE_TREE = [
  {
    name: 'Frontend Presentation Fabric',
    type: 'layer',
    details: 'Multi-target unified client layer',
    children: [
      { name: 'Web Application', type: 'service', details: 'Next.js 15, React 19, Tailwind CSS' },
      { name: 'Desktop Application', type: 'service', details: 'Electron 32 Native Shell, Offline SQLite Buffer' },
      { name: 'Mobile Client', type: 'service', details: 'Capacitor 6 Android Runtime, Biometric Keystore' }
    ]
  },
  {
    name: 'API Gateway & Orchestration',
    type: 'layer',
    details: 'Java 17 & Spring Boot 3 Core',
    children: [
      { name: 'Spring Cloud Gateway', type: 'service', details: 'Reactive Non-blocking Routing & Rate Limiting' },
      { name: 'JWT & RBAC Security Filter', type: 'service', details: 'Role Claims, Tenant Context Injection' },
      { name: 'Audit Interceptor', type: 'service', details: 'Real-time SHA-256 Chained Event Logger' }
    ]
  },
  {
    name: 'Intelligence & ML Gateway',
    type: 'layer',
    details: 'Python 3.11 & FastAPI Microservices',
    children: [
      { name: 'Demand Forecasting', type: 'service', details: 'XGBoost 2.0 Regressors + Weather APIs' },
      { name: 'Anomaly Detection', type: 'service', details: 'Isolation Forests, Z-Score Drift Monitors' },
      { name: 'Mathematical Optimization', type: 'service', details: 'MILP / SCIP Linear Programming Solver' },
      { name: 'Document OCR', type: 'service', details: 'Tesseract 5 Pipeline + Invoice Normalizers' },
      { name: 'LLM Synthesis', type: 'service', details: 'Gemini 1.5 Pro & Groq Llama-3 Low-Latency Agents' }
    ]
  },
  {
    name: 'Persistence & Operational Data',
    type: 'layer',
    details: 'Enterprise Scalable Store',
    children: [
      { name: 'MongoDB Atlas Cluster', type: 'service', details: '46 Sharded Collections, Time-Series Buckets' },
      { name: 'Tenant Partitioning', type: 'service', details: 'Cryptographic Namespace Isolation' },
      { name: 'Telemetry Archive', type: 'service', details: 'Immutable Cold Storage with Merkle Trees' }
    ]
  },
  {
    name: 'Governance & Cryptographic Audit',
    type: 'layer',
    details: 'Tamper-Proof Verification Layer',
    children: [
      { name: 'SHA-256 Hash Chain', type: 'service', details: 'Sequential block hashing matching utility data' },
      { name: 'Role-Based Access (RBAC)', type: 'service', details: '8 Discrete Persona Entitlement Rings' },
      { name: 'Statutory ESG Exporter', type: 'service', details: 'ISO 14064 & GHG Protocol Schema Validators' }
    ]
  }
];

export const WORKFLOW_STEPS = [
  {
    num: '01',
    step: 'Telemetry Ingestion',
    title: 'Information Enters the Ecosystem',
    desc: 'Building automation systems (BACnet, Modbus), smart utility meters, IoT micro-controllers, and mobile inputs deliver continuous telemetry via authenticated Spring Gateway streams.',
    badge: 'INGEST'
  },
  {
    num: '02',
    step: 'Data Normalization',
    title: 'Operational Data Is Structured',
    desc: 'Unstructured payloads, time-zone offsets, unit conversions (kWh, BTUs, m³), and raw OCR invoice extractions are cleaned and indexed across 46 MongoDB Atlas schema collections.',
    badge: 'STRUCTURE'
  },
  {
    num: '03',
    step: 'ML Pattern Analysis',
    title: 'Intelligence Models Analyze Patterns',
    desc: 'FastAPI microservices dispatch historical curves to XGBoost models, projecting forward resource demands while benchmarking against seasonal atmospheric baselines.',
    badge: 'ANALYZE'
  },
  {
    num: '04',
    step: 'Contamination Isolation',
    title: 'Anomalies & Inefficiencies Isolated',
    desc: 'Isolation Forests flag anomalous baseload spikes, equipment cycling failures, and simultaneous thermal conflicts in sub-20 millisecond inference windows.',
    badge: 'DETECT'
  },
  {
    num: '05',
    step: 'Constrained Optimization',
    title: 'MILP Engine Evaluates Decisions',
    desc: 'The SCIP mathematical solver balances dynamic time-of-use utility rates, battery charge envelopes, and occupant thermal comfort tolerances to discover optimal dispatch trajectories.',
    badge: 'OPTIMIZE'
  },
  {
    num: '06',
    step: 'Closed-Loop Action',
    title: 'Insights Support Operational Action',
    desc: 'Direct automated signals dispatch to smart controllers, while concise persona-tailored briefings arm facility directors, regional heads, and campus teams with decisive actions.',
    badge: 'EXECUTE'
  },
  {
    num: '07',
    step: 'Chained Traceability',
    title: 'Governance Maintains Immutable Audit',
    desc: 'Every dispatch event, sensor record, and baseline modification is sealed into sequential SHA-256 audit blocks, ensuring verifiable ESG governance.',
    badge: 'VERIFY'
  }
];

export const TECH_STACK = [
  {
    category: 'Backend & Orchestration',
    items: [
      { name: 'Java 17', role: 'Enterprise LTS Runtime' },
      { name: 'Spring Boot 3', role: 'Core API Gateway & Security' },
      { name: 'Spring Cloud Gateway', role: 'Reactive Reverse Proxy' },
      { name: 'Python 3.11', role: 'Machine Learning Subsystem' },
      { name: 'FastAPI', role: 'Asynchronous High-Throughput ML API' }
    ]
  },
  {
    category: 'AI & Decision Intelligence',
    items: [
      { name: 'XGBoost 2.0', role: 'Time-Series Demand Forecasting' },
      { name: 'Isolation Forest', role: 'Unsupervised Anomaly Detection' },
      { name: 'SCIP / MILP', role: 'Mixed-Integer Constraint Optimization' },
      { name: 'Tesseract OCR', role: 'Invoice & Document Intelligence' },
      { name: 'Gemini & Groq', role: 'Contextual Operational Reasoning' }
    ]
  },
  {
    category: 'Data & Storage Fabric',
    items: [
      { name: 'MongoDB Atlas', role: 'Cloud Distributed Primary Store' },
      { name: '46 Collections', role: 'Domain-Isolated Document Schemas' },
      { name: 'Time-Series Buckets', role: 'High-Frequency Sensor Compression' },
      { name: 'Redis Cache', role: 'Low-Latency Session & Cache Fabric' }
    ]
  },
  {
    category: 'Security & Governance',
    items: [
      { name: 'SHA-256 Chaining', role: 'Cryptographic Audit Immutability' },
      { name: 'Fine-Grained RBAC', role: '8 Discrete Persona Security Contexts' },
      { name: 'Tenant Isolation', role: 'Logical & Physical Namespace Borders' },
      { name: 'ISO 14064 Compliance', role: 'Greenhouse Gas Accounting Standards' }
    ]
  },
  {
    category: 'Client Platforms',
    items: [
      { name: 'Next.js 15 / React 19', role: 'Production Web Application' },
      { name: 'Tailwind CSS & CSS3', role: 'Adaptive Visual Morphisms' },
      { name: 'Electron 32', role: 'Secure Cross-Platform Desktop' },
      { name: 'Capacitor Android', role: 'Field & Citizen Mobile Client' }
    ]
  }
];

export const ROADMAP_ITEMS = [
  {
    phase: 'CURRENT CAPABILITIES',
    status: 'Operational',
    statusClass: 'status-active',
    items: [
      'Multi-persona access control across 8 operational roles',
      'XGBoost predictive thermal and electrical load forecasting',
      'Continuous telemetry anomaly detection via Isolation Forests',
      'Automated utility bill document parsing with Tesseract OCR',
      'Multi-Morphism UI engine with 8 selectable presentation modes',
      'Cryptographic SHA-256 sequential audit block recording',
      'Multi-platform foundation across Web, Electron Desktop, and Capacitor Android'
    ]
  },
  {
    phase: 'ACTIVE ENHANCEMENTS',
    status: 'In Progress',
    statusClass: 'status-progress',
    items: [
      'SCIP mathematical optimizer expansion for grid-scale battery arbitration',
      'Fine-tuning low-latency Groq/Gemini synthesis on proprietary HVAC fault taxonomies',
      'Sub-metered digital twin spatial heatmaps for institutional facilities',
      'Dynamic real-time time-of-use tariff integration with regional utility nodes',
      'Extended offline caching pipelines for mobile field inspection teams'
    ]
  },
  {
    phase: 'PLANNED ARCHITECTURE',
    status: 'Roadmap',
    statusClass: 'status-planned',
    items: [
      'Zero-knowledge proof verification for inter-institutional carbon credit trading',
      'Direct hardware-level Modbus & BACnet gateway firmware integrations',
      'Automated municipal ESG compliance reporting directly to regulatory portals',
      'Edge-deployed quantization of Isolation Forest models on ARM-based micro-gateways'
    ]
  }
];

export const FAQS = [
  {
    q: 'What is VerdantIQ Ecosphere?',
    a: 'VerdantIQ Ecosphere is an integrated intelligence ecosystem that unifies sustainable operations, machine-learning analytics, mathematical optimization, digital twins, and cryptographic governance into a single connected platform. Rather than serving as an isolated dashboard, it actively bridges building systems, mathematical solvers, and diverse stakeholders.'
  },
  {
    q: 'Who can use the ecosystem and what are the eight personas?',
    a: 'The platform is architected around eight dedicated personas: Admin (global governance), Region (cross-jurisdictional coordinators), Institution (campus/facility heads), Department (unit resource custodians), Audit (ESG & cryptographic assessors), MLOps (model engineers), Student (campus champions), and Household (residential consumers). Each accesses specialized views backed by the same shared intelligence layer.'
  },
  {
    q: 'How does the AI intelligence layer operate?',
    a: 'The intelligence layer runs as an asynchronous microservice fabric built in Python 3.11 with FastAPI. It combines XGBoost for 72-hour forward time-series load forecasting, Isolation Forests for microsecond anomaly detection, SCIP/MILP solvers for mathematically constrained tariff optimization, Tesseract OCR for utility invoice extraction, and Gemini/Groq LLMs for natural language diagnostics.'
  },
  {
    q: 'What is the Multi-Morphism interface engine?',
    a: 'The Multi-Morphism engine is a Windows 11-inspired design system capability allowing the interface to adapt fluidly across eight distinct aesthetic styles (including Obsidian Glassmorphism, Material 3, Neumorphism, Claymorphism, Flat, Skeuomorphism, Neubrutalism, and Polymorphism) depending on operating context, user preference, or device capabilities.'
  },
  {
    q: 'How does the platform ensure governance and audit integrity?',
    a: 'Every telemetry modification, operational dispatch event, and OCR billing transaction is cryptographically hashed and appended to a sequential SHA-256 audit chain. This provides immutable, mathematically verifiable audit trails required for ISO 14064 greenhouse gas reporting and statutory environmental compliance.'
  },
  {
    q: 'Which platforms and operating systems are supported?',
    a: 'VerdantIQ supports three unified access form factors: a high-fidelity Web application (React 19), a dedicated Electron desktop application with local buffer support, and a lightweight Capacitor-based Android application for mobile field engineers and campus citizens.'
  },
  {
    q: 'What distinguishes VerdantIQ from ordinary energy monitoring software?',
    a: 'Standard software presents static, retrospective charts after energy has already been consumed. VerdantIQ operates predictive and prescriptive decision loops: forecasting demands up to 72 hours ahead, solving constrained optimization equations to shave peak tariffs, isolating anomalies immediately, and enforcing cryptographic auditability across all tiers.'
  }
];

