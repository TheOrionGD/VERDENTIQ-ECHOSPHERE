import { getDb } from './db.js';
import { computeAuditHash } from './auditEngine.js';

export async function seedInitialDatabase() {
  const db = getDb();

  // 1. Institutions
  const institutionsCount = await db.collection('institutions').countDocuments();
  if (institutionsCount === 0) {
    console.log('🌱 Seeding institutions collection...');
    await db.collection('institutions').insertMany([
      {
        _id: 'inst-verdia-central',
        name: 'Verdia Central University',
        code: 'VCU',
        type: 'University',
        city: 'Cascadia',
        state: 'Pacific',
        country: 'USA',
        studentCount: 14500,
        staffCount: 1200,
        campusAreaSqM: 111480, // ~1,200,000 sq ft
        regionalGridFactor: 0.42, // kg CO2e / kWh
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: 'inst-north-polytech',
        name: 'North Polytech Institute',
        code: 'NPI',
        type: 'Polytechnic',
        city: 'Metro North',
        state: 'Pacific',
        country: 'USA',
        studentCount: 8200,
        staffCount: 650,
        campusAreaSqM: 60387,
        regionalGridFactor: 0.42,
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: 'inst-greenwood-college',
        name: 'Greenwood State College',
        code: 'GSC',
        type: 'College',
        city: 'Greenwood',
        state: 'Cascadia',
        country: 'USA',
        studentCount: 5100,
        staffCount: 420,
        campusAreaSqM: 38090,
        regionalGridFactor: 0.39,
        status: 'active',
        createdAt: new Date(),
      }
    ]);
  }

  // 2. Module A: Electricity
  const readingsCount = await db.collection('campus_readings').countDocuments();
  if (readingsCount === 0) {
    console.log('🌱 Seeding campus electricity readings...');
    const months = [
      { period: '2025-05', kwh: 168000, cost: 20160 },
      { period: '2025-06', kwh: 184500, cost: 22140 },
      { period: '2025-07', kwh: 195000, cost: 23400 },
      { period: '2025-08', kwh: 205000, cost: 24600 },
      { period: '2025-09', kwh: 172000, cost: 20640 },
      { period: '2025-10', kwh: 154000, cost: 18480 },
      { period: '2025-11', kwh: 142000, cost: 17040 },
      { period: '2025-12', kwh: 148000, cost: 17760 },
      { period: '2026-01', kwh: 162000, cost: 19440 },
      { period: '2026-02', kwh: 151000, cost: 18120 },
      { period: '2026-03', kwh: 159000, cost: 19080 },
      { period: '2026-04', kwh: 164000, cost: 19680 },
    ];

    await db.collection('campus_readings').insertMany(months.map(m => ({
      institutionId: 'inst-verdia-central',
      period: m.period,
      kwhConsumed: m.kwh,
      totalCost: m.cost,
      scope2EmissionsKg: Math.round(m.kwh * 0.42),
      regionalGridFactor: 0.42,
      sourceType: 'utility_bill',
      verificationStatus: 'verified',
      createdAt: new Date(),
    })));
  }

  // 3. Module B: Water Conservation Records
  const waterCount = await db.collection('water_records').countDocuments();
  if (waterCount === 0) {
    console.log('🌱 Seeding water conservation records...');
    const waterData = [
      { period: '2025-11', volumeCubicM: 8400, cost: 12600, source: 'municipal', rainwaterHarvestedM3: 420, waterReusedM3: 310 },
      { period: '2025-12', volumeCubicM: 8100, cost: 12150, source: 'municipal', rainwaterHarvestedM3: 560, waterReusedM3: 400 },
      { period: '2026-01', volumeCubicM: 7900, cost: 11850, source: 'municipal', rainwaterHarvestedM3: 610, waterReusedM3: 480 },
      { period: '2026-02', volumeCubicM: 7800, cost: 11700, source: 'municipal', rainwaterHarvestedM3: 380, waterReusedM3: 320 },
      { period: '2026-03', volumeCubicM: 8250, cost: 12375, source: 'municipal', rainwaterHarvestedM3: 490, waterReusedM3: 390 },
      { period: '2026-04', volumeCubicM: 8500, cost: 12750, source: 'municipal', rainwaterHarvestedM3: 530, waterReusedM3: 410 },
    ];

    await db.collection('water_records').insertMany(waterData.map(w => ({
      institutionId: 'inst-verdia-central',
      period: w.period,
      volumeCubicM: w.volumeCubicM,
      cost: w.cost,
      source: w.source,
      rainwaterHarvestedM3: w.rainwaterHarvestedM3,
      waterReusedM3: w.waterReusedM3,
      sourceType: 'utility_bill',
      verificationStatus: 'verified',
      createdAt: new Date(),
    })));
  }

  // 4. Module C: Waste Management Records
  const wasteCount = await db.collection('waste_records').countDocuments();
  if (wasteCount === 0) {
    console.log('🌱 Seeding waste & circular economy records...');
    const wasteData = [
      { period: '2025-12', organicKg: 4200, recyclableKg: 3800, generalKg: 5100, hazardousKg: 120, eWasteKg: 240, compostedKg: 3900, recycledKg: 3500 },
      { period: '2026-01', organicKg: 3900, recyclableKg: 3400, generalKg: 4800, hazardousKg: 90, eWasteKg: 180, compostedKg: 3700, recycledKg: 3100 },
      { period: '2026-02', organicKg: 4100, recyclableKg: 3600, generalKg: 4600, hazardousKg: 110, eWasteKg: 150, compostedKg: 3900, recycledKg: 3300 },
      { period: '2026-03', organicKg: 4400, recyclableKg: 3950, generalKg: 4700, hazardousKg: 130, eWasteKg: 310, compostedKg: 4100, recycledKg: 3650 },
      { period: '2026-04', organicKg: 4600, recyclableKg: 4100, generalKg: 4500, hazardousKg: 105, eWasteKg: 210, compostedKg: 4300, recycledKg: 3850 },
    ];

    await db.collection('waste_records').insertMany(wasteData.map(w => {
      const totalKg = w.organicKg + w.recyclableKg + w.generalKg + w.hazardousKg + w.eWasteKg;
      const divertedKg = w.compostedKg + w.recycledKg;
      const diversionRatePct = Number(((divertedKg / totalKg) * 100).toFixed(1));
      return {
        institutionId: 'inst-verdia-central',
        period: w.period,
        ...w,
        totalKg,
        divertedKg,
        diversionRatePct,
        sourceType: 'waste_contractor_manifest',
        verificationStatus: 'verified',
        createdAt: new Date(),
      };
    }));
  }

  // 5. Module D: GHG Carbon Footprint (Scope 1, 2 & 3)
  const carbonCount = await db.collection('carbon_inventory').countDocuments();
  if (carbonCount === 0) {
    console.log('🌱 Seeding GHG carbon inventory...');
    await db.collection('carbon_inventory').insertMany([
      {
        institutionId: 'inst-verdia-central',
        period: '2026-Q1',
        scope1DirectKgCo2e: 18400, // natural gas backup & fleet fuel
        scope2ElectricityKgCo2e: 198240, // from actual 472,000 kWh Q1 electricity
        scope3IndirectKgCo2e: 42100, // commuter survey estimates & waste
        totalCo2eKg: 258740,
        emissionFactorsUsed: [
          { name: 'Regional Electricity Grid Factor', value: 0.42, unit: 'kg CO2e/kWh', source: 'eGRID 2024' },
          { name: 'Fleet Diesel Factor', value: 2.68, unit: 'kg CO2e/Litre', source: 'EPA GHG Factors' },
        ],
        verificationStatus: 'verified',
        createdAt: new Date(),
      }
    ]);
  }

  // 6. Module E: Biodiversity & Tree Records
  const bioCount = await db.collection('biodiversity_records').countDocuments();
  if (bioCount === 0) {
    console.log('🌱 Seeding campus biodiversity records...');
    await db.collection('biodiversity_records').insertMany([
      {
        institutionId: 'inst-verdia-central',
        speciesName: 'Quercus garryana (Oregon White Oak)',
        commonName: 'Garry Oak',
        quantityPlanted: 140,
        plantingDate: '2024-11-10',
        campusZone: 'North Quad Botanical Belt',
        nativeSpecies: true,
        survivalCount: 136,
        status: 'healthy',
        lastInspectionDate: '2026-03-15',
        notes: 'High drought tolerance observed along student perimeter walk.',
        createdAt: new Date(),
      },
      {
        institutionId: 'inst-verdia-central',
        speciesName: 'Acer circinatum',
        commonName: 'Vine Maple',
        quantityPlanted: 85,
        plantingDate: '2025-03-22',
        campusZone: 'Engineering Courtyard Rain Garden',
        nativeSpecies: true,
        survivalCount: 82,
        status: 'healthy',
        lastInspectionDate: '2026-04-02',
        notes: 'Thriving in bioswale filtration zone.',
        createdAt: new Date(),
      }
    ]);
  }

  // 7. Module F: Sustainable Mobility Surveys
  const mobilityCount = await db.collection('mobility_records').countDocuments();
  if (mobilityCount === 0) {
    console.log('🌱 Seeding mobility survey benchmarks...');
    await db.collection('mobility_records').insertMany([
      {
        institutionId: 'inst-verdia-central',
        surveyPeriod: '2026-Spring',
        sampleSize: 1850,
        modeSharesPct: {
          publicTransit: 38,
          walking: 26,
          cycling: 17,
          carpooling: 11,
          soloDriving: 8,
        },
        sustainableCommuteRatePct: 92,
        bicycleRackOccupancyPct: 76,
        evChargingPorts: 12,
        sourceType: 'annual_campus_travel_survey',
        createdAt: new Date(),
      }
    ]);
  }

  // 8. Module G: Green Infrastructure & Facilities
  const facilityCount = await db.collection('hvac_schedules').countDocuments();
  if (facilityCount === 0) {
    console.log('🌱 Seeding facility operations & schedules...');
    await db.collection('hvac_schedules').insertMany([
      {
        institutionId: 'inst-verdia-central',
        facilityName: 'Engineering Hall - Lab Wing',
        facilityType: 'Laboratory',
        dayOfWeek: 'Monday - Friday',
        startHour: '08:00',
        endHour: '18:00',
        setpointTempC: 22.5,
        status: 'scheduled',
      },
      {
        institutionId: 'inst-verdia-central',
        facilityName: 'Main Science Lecture Theatres',
        facilityType: 'Auditorium',
        dayOfWeek: 'Monday - Saturday',
        startHour: '08:30',
        endHour: '17:30',
        setpointTempC: 23.0,
        status: 'scheduled',
      },
      {
        institutionId: 'inst-verdia-central',
        facilityName: 'Central Library Reading Commons',
        facilityType: 'Library',
        dayOfWeek: 'All Week',
        startHour: '07:30',
        endHour: '22:00',
        setpointTempC: 22.0,
        status: 'scheduled',
      }
    ]);

    await db.collection('waste_observations').insertMany([
      {
        institutionId: 'inst-verdia-central',
        facilityName: 'Chemistry Building - Floor 2 Bioswale Outflow',
        observation: 'Sprinkler head misaligned causing water runoff onto sidewalk.',
        category: 'Water Conservation',
        severity: 'Moderate',
        status: 'investigating',
        reportedAt: new Date(Date.now() - 3600000 * 14),
      },
      {
        institutionId: 'inst-verdia-central',
        facilityName: 'Architecture Studio 4',
        observation: 'High-draw spotlight banks remaining illuminated after scheduled 19:00 curfew.',
        category: 'Energy',
        severity: 'Low',
        status: 'addressed',
        reportedAt: new Date(Date.now() - 3600000 * 48),
      }
    ]);
  }

  // 9. Module H: Challenges & Student Proofs
  const challengeCount = await db.collection('challenges').countDocuments();
  if (challengeCount === 0) {
    console.log('🌱 Seeding sustainability challenges...');
    await db.collection('challenges').insertMany([
      {
        _id: 'ch-lab-shutdown',
        title: 'Computer Lab Twilight Shutdown',
        description: 'Verify that idle monitors, workstations, and lighting in your department lab are fully powered off overnight.',
        category: 'Energy',
        points: 40,
        departmentName: 'Computer Science Lab 3',
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: 'ch-water-audit',
        title: 'Campus Fixture Leak Watch',
        description: 'Locate and photograph dripping taps or running fixtures in campus restrooms/drinking stations to flag for immediate maintenance.',
        category: 'Water Conservation',
        points: 35,
        departmentName: 'Student Union Building',
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: 'ch-waste-sort',
        title: 'Dining Hall Clean Plate & Composting Audit',
        description: 'Sort organic food scraps into green digest bins and log contaminated items removed from recycling streams.',
        category: 'Waste',
        points: 30,
        departmentName: 'Central Dining Commons',
        status: 'active',
        createdAt: new Date(),
      },
      {
        _id: 'ch-tree-steward',
        title: 'Native Habitat Weeding & Mulch Volunteer',
        description: 'Spend 30 minutes refreshing mulch around young Garry Oak saplings on the North Quad.',
        category: 'Biodiversity',
        points: 50,
        departmentName: 'North Quad Botanical Belt',
        status: 'active',
        createdAt: new Date(),
      }
    ]);

    await db.collection('student_proofs').insertMany([
      {
        _id: 'proof-101',
        challengeId: 'ch-lab-shutdown',
        challengeTitle: 'Computer Lab Twilight Shutdown',
        studentId: 'std-2041',
        studentName: 'Alex Mercer',
        notes: 'Shutdown all 24 workstations in CS Lab B at 19:15 after evening study session.',
        status: 'pending',
        points: 40,
        submittedAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        _id: 'proof-102',
        challengeId: 'ch-water-audit',
        challengeTitle: 'Campus Fixture Leak Watch',
        studentId: 'std-3109',
        studentName: 'Elena Rostova',
        notes: 'Reported leaking faucet in Restroom 2B. Maintenance dispatched ticket.',
        status: 'approved',
        points: 35,
        moderatorNotes: 'Verified with Facilities Team ticket #4812.',
        reviewedAt: new Date(Date.now() - 3600000 * 12),
        submittedAt: new Date(Date.now() - 3600000 * 24),
      }
    ]);
  }

  // 10. Audit Log Chain
  const auditCount = await db.collection('audit_logs').countDocuments();
  if (auditCount === 0) {
    console.log('🌱 Seeding initial cryptographic audit chain...');
    const genesisTime = new Date(Date.now() - 3600000 * 72).toISOString();
    const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const genesisRecord = {
      timestamp: genesisTime,
      userId: 'SYSTEM_GENESIS',
      userRole: 'admin',
      action: 'SYSTEM_INITIALIZATION',
      details: { message: 'VerdantIQ Full Campus Sustainability Platform Initialized' },
      previousHash: prevHash,
    };
    genesisRecord.currentHash = computeAuditHash(genesisRecord);

    await db.collection('audit_logs').insertOne(genesisRecord);
  }

  console.log('✅ Comprehensive sustainability database seeding complete.');
}
