import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase, getDb } from './db.js';
import { seedInitialDatabase } from './seed.js';
import { computeAuditHash, verifyAuditChain } from './auditEngine.js';
import { generateDemandForecast, evaluateForecastAccuracy, calculateParetoTradeoffs } from './mlEngine.js';
import {
  generateEsgActionPlan,
  reviewStudentEcoProof,
  explainForecastVariance,
  generateHouseholdSavingsTips,
} from './aiService.js';
import {
  applyProvenance,
  validateWaterRecord,
} from './validators.js';
import { calculateCampusGhgInventory, EMISSIONS_FACTORS_CATALOG } from './carbonAccountingEngine.js';
import { assessStarsReadiness } from './starsReadinessEngine.js';
import { computeImagePerceptualHash, calculateHammingDistance, isPointInsidePolygon, CAMPUS_FACILITY_POLYGONS } from './evidenceVerificationEngine.js';
import { processEcoPointsTransaction } from './ecoPointsEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.server') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Audit logger helper
async function logAuditEvent({ userId, userRole, action, details }) {
  try {
    const db = getDb();
    const lastLog = await db.collection('audit_logs').find().sort({ timestamp: -1 }).limit(1).toArray();
    const previousHash = lastLog.length > 0 && lastLog[0].currentHash
      ? lastLog[0].currentHash
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date().toISOString();
    const record = {
      timestamp,
      userId: userId || 'SYSTEM',
      userRole: userRole || 'system',
      action,
      details,
      previousHash,
    };
    record.currentHash = computeAuditHash(record);
    await db.collection('audit_logs').insertOne(record);
    return record;
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

// -------------------------------------------------------------
// Health API
// -------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });
    res.json({
      status: 'healthy',
      system: 'VerdantIQ Sustainability Intelligence Platform (Pure JS)',
      database: 'MongoDB Atlas (Connected)',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// -------------------------------------------------------------
// 1. Platform Admin API
// -------------------------------------------------------------
app.get('/api/admin/overview', async (req, res) => {
  try {
    const db = getDb();
    const institutions = await db.collection('institutions').find().toArray();
    const recentAudits = await db.collection('audit_logs').find().sort({ timestamp: -1 }).limit(10).toArray();
    const readingsCount = await db.collection('campus_readings').countDocuments();
    const waterCount = await db.collection('water_records').countDocuments();
    const wasteCount = await db.collection('waste_records').countDocuments();
    const proofsCount = await db.collection('student_proofs').countDocuments();

    res.json({
      totalInstitutions: institutions.length,
      institutions,
      totalReadingsRecorded: readingsCount,
      totalWaterRecords: waterCount,
      totalWasteRecords: wasteCount,
      totalProofsSubmitted: proofsCount,
      recentAudits,
      serverMemoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: Math.round(process.uptime()),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/institutions', async (req, res) => {
  try {
    const db = getDb();
    const { name, code, type = 'University', studentCount, campusAreaSqM, regionalGridFactor } = req.body;
    const newInst = {
      _id: `inst-${code.toLowerCase()}-${Date.now().toString(36)}`,
      name,
      code,
      type,
      studentCount: Number(studentCount) || 1000,
      campusAreaSqM: Number(campusAreaSqM) || 50000,
      regionalGridFactor: Number(regionalGridFactor) || 0.42,
      status: 'active',
      createdAt: new Date(),
    };
    await db.collection('institutions').insertOne(newInst);
    await logAuditEvent({
      userId: req.body.adminId || 'platform-admin',
      userRole: 'admin',
      action: 'INSTITUTION_REGISTERED',
      details: { institutionId: newInst._id, code },
    });
    res.status(201).json(newInst);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. Comprehensive Institution Sustainability Modules (Energy, Water, Waste, Carbon, Biodiversity, Mobility)
// -------------------------------------------------------------
app.get('/api/institution/comprehensive-overview', async (req, res) => {
  try {
    const db = getDb();
    const institutionId = req.query.institutionId || 'inst-verdia-central';

    const [
      institution,
      readings,
      waterRecords,
      wasteRecords,
      carbonRecords,
      bioRecords,
      mobilityRecords,
    ] = await Promise.all([
      db.collection('institutions').findOne({ _id: institutionId }),
      db.collection('campus_readings').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('water_records').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('waste_records').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('carbon_inventory').find({ institutionId }).sort({ period: -1 }).toArray(),
      db.collection('biodiversity_records').find({ institutionId }).toArray(),
      db.collection('mobility_records').find({ institutionId }).sort({ createdAt: -1 }).limit(1).toArray(),
    ]);

    // Aggregate key metrics
    const totalElectricityKwh = readings.reduce((sum, r) => sum + r.kwhConsumed, 0);
    const totalWaterM3 = waterRecords.reduce((sum, w) => sum + w.volumeCubicM, 0);
    const totalRainwaterM3 = waterRecords.reduce((sum, w) => sum + (w.rainwaterHarvestedM3 || 0), 0);
    const totalWasteKg = wasteRecords.reduce((sum, w) => sum + w.totalKg, 0);
    const totalDivertedKg = wasteRecords.reduce((sum, w) => sum + w.divertedKg, 0);
    const overallDiversionRate = totalWasteKg > 0 ? Number(((totalDivertedKg / totalWasteKg) * 100).toFixed(1)) : 0;
    const totalTrees = bioRecords.reduce((sum, b) => sum + b.quantityPlanted, 0);

    res.json({
      institution,
      modules: {
        electricity: { readings, totalKwh: totalElectricityKwh },
        water: { records: waterRecords, totalConsumedM3: totalWaterM3, totalRainwaterM3 },
        waste: { records: wasteRecords, totalGeneratedKg: totalWasteKg, totalDivertedKg, diversionRatePct: overallDiversionRate },
        carbon: { records: carbonRecords, latestInventory: carbonRecords[0] || null },
        biodiversity: { records: bioRecords, totalTreesPlanted: totalTrees },
        mobility: { latestSurvey: mobilityRecords[0] || null },
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record Water Consumption
app.post('/api/institution/water', async (req, res) => {
  try {
    const db = getDb();
    const validation = validateWaterRecord(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(' ') });
    }

    const { institutionId = 'inst-verdia-central', period, cost = 0, source = 'municipal', rainwaterHarvestedM3 = 0, waterReusedM3 = 0, notes } = req.body;

    const baseRecord = {
      institutionId,
      period,
      volumeCubicM: validation.normalizedVolumeM3,
      cost: Number(cost),
      source,
      rainwaterHarvestedM3: Number(rainwaterHarvestedM3),
      waterReusedM3: Number(waterReusedM3),
    };

    const record = applyProvenance(baseRecord, {
      userId: req.body.adminId || 'institution-admin',
      role: 'institution',
      sourceType: req.body.sourceType || 'utility_bill',
      notes,
    });

    await db.collection('water_records').insertOne(record);
    await logAuditEvent({
      userId: record.createdBy,
      userRole: record.creatorRole,
      action: 'CAMPUS_WATER_RECORD_LOGGED',
      details: { period, volumeCubicM: record.volumeCubicM, cost },
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record Waste & Recycling
app.post('/api/institution/waste', async (req, res) => {
  try {
    const db = getDb();
    const { institutionId = 'inst-verdia-central', period, organicKg, recyclableKg, generalKg, hazardousKg = 0, eWasteKg = 0 } = req.body;

    const org = Number(organicKg || 0);
    const rec = Number(recyclableKg || 0);
    const gen = Number(generalKg || 0);
    const haz = Number(hazardousKg || 0);
    const ew = Number(eWasteKg || 0);

    const totalKg = org + rec + gen + haz + ew;
    const compostedKg = org; // composted organic fraction
    const recycledKg = rec;
    const divertedKg = compostedKg + recycledKg;
    const diversionRatePct = totalKg > 0 ? Number(((divertedKg / totalKg) * 100).toFixed(1)) : 0;

    const record = {
      institutionId,
      period,
      organicKg: org,
      recyclableKg: rec,
      generalKg: gen,
      hazardousKg: haz,
      eWasteKg: ew,
      totalKg,
      compostedKg,
      recycledKg,
      divertedKg,
      diversionRatePct,
      sourceType: 'waste_contractor_manifest',
      verificationStatus: 'verified',
      createdAt: new Date(),
    };

    await db.collection('waste_records').insertOne(record);
    await logAuditEvent({
      userId: req.body.adminId || 'institution-admin',
      userRole: 'institution',
      action: 'CAMPUS_WASTE_RECORD_LOGGED',
      details: { period, totalKg, diversionRatePct },
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record Electricity
app.post('/api/institution/readings', async (req, res) => {
  try {
    const db = getDb();
    const {
      institutionId = 'inst-verdia-central',
      period,
      kwhConsumed,
      totalCost,
      egridSubregion = 'NWPP',
      recsPurchasedMwh = 0,
    } = req.body;

    const subregionFactor = EMISSIONS_FACTORS_CATALOG.egrid_subregions[egridSubregion]?.factor || 0.388;
    const locationBasedKg = Math.round(Number(kwhConsumed) * subregionFactor);
    const marketKwh = Math.max(0, Number(kwhConsumed) - (Number(recsPurchasedMwh) * 1000));
    const marketBasedKg = Math.round(marketKwh * subregionFactor);

    const record = {
      institutionId,
      period,
      kwhConsumed: Number(kwhConsumed),
      totalCost: Number(totalCost),
      egridSubregion,
      regionalGridFactor: subregionFactor,
      scope2LocationBasedKg: locationBasedKg,
      scope2MarketBasedKg: marketBasedKg,
      recsPurchasedMwh: Number(recsPurchasedMwh),
      sourceType: 'utility_bill',
      verificationStatus: 'verified',
      createdAt: new Date(),
    };

    await db.collection('campus_readings').insertOne(record);
    await logAuditEvent({
      userId: req.body.adminId || 'institution-admin',
      userRole: 'institution',
      action: 'CAMPUS_ELECTRICITY_READING_RECORDED',
      details: { period, kwhConsumed, totalCost, locationBasedKg, marketBasedKg },
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AASHE STARS 3.0 / GHG Protocol Standardized Inventory Engine Endpoint
app.post('/api/institution/ghg-inventory', async (req, res) => {
  try {
    const inventory = calculateCampusGhgInventory(req.body);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AASHE STARS Reporting Readiness Tracker
app.get('/api/institution/stars-readiness', async (req, res) => {
  try {
    const db = getDb();
    const institutionId = req.query.institutionId || 'inst-verdia-central';

    const [readingsCount, wasteRecords] = await Promise.all([
      db.collection('campus_readings').countDocuments({ institutionId }),
      db.collection('waste_records').find({ institutionId }).toArray(),
    ]);

    const totalWasteKg = wasteRecords.reduce((sum, w) => sum + (w.totalKg || 0), 0);
    const divertedWasteKg = wasteRecords.reduce((sum, w) => sum + (w.divertedKg || 0), 0);
    const diversionPct = totalWasteKg > 0 ? (divertedWasteKg / totalWasteKg) * 100 : 0;

    const auditInputs = {
      'Air & Climate (OP-1)': {
        hasScope1: true,
        hasScope2Dual: true,
        hasScope3: true,
        hasRecsDocumentation: true,
      },
      'Energy (OP-2)': {
        monthlyReadingsCount: readingsCount,
        hasEuiNormalized: true,
        onSiteRenewablePct: 15.4,
      },
      'Waste (OP-19)': {
        diversionRatePct: diversionPct,
        hasWeighScaleSlips: wasteRecords.length > 0,
      },
    };

    const readinessReport = assessStarsReadiness(auditInputs);
    res.json(readinessReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Action Plan (Multi-resource: Energy, Water, Waste, Carbon)
app.post('/api/institution/ai-action-plan', async (req, res) => {
  try {
    const advice = await generateEsgActionPlan(req.body);
    res.json({ actionPlan: advice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. MLOps Admin API
// -------------------------------------------------------------
app.get('/api/mlops/models', (req, res) => {
  res.json([
    {
      id: 'model-holt-winters',
      name: 'Holt-Winters Trend Exponential Smoothing',
      version: 'v2.4-purejs',
      type: 'Statistical Time-Series',
      status: 'active_production',
      description: 'Calculates level and trend smoothing for monthly campus electricity load projections.',
    },
    {
      id: 'model-linear-regression',
      name: 'Ordinary Least Squares Polynomial Trend',
      version: 'v1.8-purejs',
      type: 'Regression',
      status: 'ready',
      description: 'Baseline trend projection comparing moving campus growth against energy consumption.',
    },
    {
      id: 'model-pareto-solver',
      name: 'HVAC Multi-Objective Pareto Optimization Solver',
      version: 'v3.1-purejs',
      type: 'Multi-Objective Mathematical Optimizer',
      status: 'active_production',
      description: 'Solves cost, carbon, and comfort trade-off frontiers across campus thermal setpoints.',
    }
  ]);
});

app.post('/api/mlops/forecast', async (req, res) => {
  try {
    const db = getDb();
    const { institutionId = 'inst-verdia-central', periodsAhead = 6, alpha = 0.4, beta = 0.2 } = req.body;
    
    const readings = await db.collection('campus_readings')
      .find({ institutionId })
      .sort({ period: 1 })
      .toArray();

    const formattedHistory = readings.map(r => ({ period: r.period, kwh: r.kwhConsumed }));
    const forecastResult = generateDemandForecast(formattedHistory, periodsAhead, alpha, beta);

    const actualValues = formattedHistory.map(h => h.kwh);
    const fittedValues = forecastResult.fittedHistory || [];
    const metrics = evaluateForecastAccuracy(actualValues, fittedValues);

    res.json({
      institutionId,
      historicalSeries: formattedHistory,
      ...forecastResult,
      evaluationMetrics: metrics,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mlops/pareto', async (req, res) => {
  try {
    const db = getDb();
    const { institutionId = 'inst-verdia-central', tariffPerKwh = 0.12 } = req.body;
    
    const inst = await db.collection('institutions').findOne({ _id: institutionId });
    const latestReading = await db.collection('campus_readings')
      .find({ institutionId })
      .sort({ period: -1 })
      .limit(1)
      .toArray();

    const baselineKwh = latestReading.length > 0 ? latestReading[0].kwhConsumed : 160000;
    const gridFactor = inst ? inst.regionalGridFactor : 0.42;

    const candidates = calculateParetoTradeoffs({
      monthlyKwh: baselineKwh,
      tariffPerKwh,
      gridFactorKgCo2PerKwh: gridFactor,
    });

    res.json({
      baseline: { monthlyKwh: baselineKwh, tariffPerKwh, gridFactorKgCo2PerKwh: gridFactor },
      candidates,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mlops/ai-diagnostic', async (req, res) => {
  try {
    const { actuals, forecasts, metrics } = req.body;
    const commentary = await explainForecastVariance(actuals, forecasts, metrics);
    res.json({ commentary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. Auditor / Researcher API
// -------------------------------------------------------------
app.get('/api/audit/logs', async (req, res) => {
  try {
    const db = getDb();
    const logs = await db.collection('audit_logs').find().sort({ timestamp: 1 }).toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit/verify', async (req, res) => {
  try {
    const db = getDb();
    const logs = await db.collection('audit_logs').find().sort({ timestamp: 1 }).toArray();
    const verification = verifyAuditChain(logs);
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit/export', async (req, res) => {
  try {
    const db = getDb();
    const format = req.query.format || 'json';
    const institutionId = req.query.institutionId || 'inst-verdia-central';

    const [readings, water, waste, carbon] = await Promise.all([
      db.collection('campus_readings').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('water_records').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('waste_records').find({ institutionId }).sort({ period: 1 }).toArray(),
      db.collection('carbon_inventory').find({ institutionId }).sort({ period: 1 }).toArray(),
    ]);

    if (format === 'csv') {
      let csv = 'Module,Period,Primary_Metric,Value,Unit,Scope2_Emissions_kgCO2e,Verification_Status\n';
      readings.forEach(r => {
        csv += `Electricity,${r.period},Consumption,${r.kwhConsumed},kWh,${r.scope2EmissionsKg},${r.verificationStatus}\n`;
      });
      water.forEach(w => {
        csv += `Water,${w.period},Volume,${w.volumeCubicM},m3,N/A,${w.verificationStatus}\n`;
      });
      waste.forEach(wt => {
        csv += `Waste,${wt.period},Diversion_Rate,${wt.diversionRatePct},%,N/A,${wt.verificationStatus}\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="campus_sustainability_audit_export.csv"');
      return res.send(csv);
    }

    res.json({
      institutionId,
      exportedAt: new Date().toISOString(),
      modules: { electricity: readings, water, waste, carbon },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Regional Admin API (Cross-Campus Multi-Module Benchmarks)
// -------------------------------------------------------------
app.get('/api/region/benchmarks', async (req, res) => {
  try {
    const db = getDb();
    const institutions = await db.collection('institutions').find().toArray();
    
    const benchmarkData = [];
    for (const inst of institutions) {
      const latestReading = await db.collection('campus_readings')
        .find({ institutionId: inst._id })
        .sort({ period: -1 })
        .limit(1)
        .toArray();

      const latestWater = await db.collection('water_records')
        .find({ institutionId: inst._id })
        .sort({ period: -1 })
        .limit(1)
        .toArray();

      const latestWaste = await db.collection('waste_records')
        .find({ institutionId: inst._id })
        .sort({ period: -1 })
        .limit(1)
        .toArray();

      const kwh = latestReading[0]?.kwhConsumed || 0;
      const kwhPerStudent = inst.studentCount ? Number((kwh / inst.studentCount).toFixed(2)) : 0;
      const waterPerStudentM3 = inst.studentCount && latestWater[0] ? Number((latestWater[0].volumeCubicM / inst.studentCount).toFixed(3)) : 0;
      const diversionRatePct = latestWaste[0]?.diversionRatePct || 0;

      benchmarkData.push({
        institutionId: inst._id,
        name: inst.name,
        code: inst.code,
        studentCount: inst.studentCount,
        campusAreaSqM: inst.campusAreaSqM,
        latestPeriod: latestReading[0]?.period || 'N/A',
        totalKwhConsumed: kwh,
        kwhPerStudent,
        waterPerStudentM3,
        wasteDiversionRatePct: diversionRatePct,
        gridFactor: inst.regionalGridFactor,
      });
    }

    res.json(benchmarkData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. Department Moderator API (Operations, Observations, Challenge Moderation)
// -------------------------------------------------------------
app.get('/api/dept/overview', async (req, res) => {
  try {
    const db = getDb();
    const schedules = await db.collection('hvac_schedules').find().toArray();
    const observations = await db.collection('waste_observations').find().sort({ reportedAt: -1 }).toArray();
    const pendingProofs = await db.collection('student_proofs').find({ status: 'pending' }).toArray();

    res.json({
      schedules,
      observations,
      pendingProofs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dept/proofs/:id/review', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status, moderatorNotes, moderatorId = 'moderator-cs' } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const proof = await db.collection('student_proofs').findOne({ _id: id });
    if (!proof) {
      return res.status(404).json({ error: 'Proof submission not found' });
    }

    await db.collection('student_proofs').updateOne(
      { _id: id },
      { $set: { status, moderatorNotes, reviewedAt: new Date() } }
    );

    // If approved, trigger idempotent EcoPoints award transaction
    let pointsResult = null;
    if (status === 'approved') {
      pointsResult = await processEcoPointsTransaction({
        transactionId: `tx-proof-${id}`,
        studentId: proof.studentId,
        institutionId: proof.institutionId || 'inst-verdia-central',
        challengeId: proof.challengeId,
        pointsAwarded: proof.points || 30,
        actionType: 'CHALLENGE_APPROVED',
        moderatorId,
        notes: moderatorNotes || 'Moderator verified submission proof',
      });
    }

    await logAuditEvent({
      userId: moderatorId,
      userRole: 'dept',
      action: status === 'approved' ? 'STUDENT_PROOF_APPROVED' : 'STUDENT_PROOF_REJECTED',
      details: { proofId: id, status, moderatorNotes, pointsResult },
    });

    res.json({ success: true, proofId: id, status, pointsResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dept/ai-proof-assistant', async (req, res) => {
  try {
    const { challengeTitle, studentNotes } = req.body;
    const review = await reviewStudentEcoProof(challengeTitle, studentNotes);
    res.json({ aiRecommendation: review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. Student API (Challenges Across All Sustainability Categories)
// -------------------------------------------------------------
app.get('/api/student/challenges', async (req, res) => {
  try {
    const db = getDb();
    const challenges = await db.collection('challenges').find({ status: 'active' }).toArray();
    const myProofs = await db.collection('student_proofs').find({ studentId: 'std-2041' }).toArray();

    res.json({
      activeChallenges: challenges,
      mySubmissions: myProofs,
      totalEarnedPoints: myProofs.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.points, 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/proofs', async (req, res) => {
  try {
    const db = getDb();
    const {
      challengeId,
      challengeTitle,
      studentNotes,
      points = 30,
      imagePayload = '', // Base64 or string hash seed
      userCoordinates = null, // [lat, lon]
      targetFacilityKey = 'science_building_quad',
    } = req.body;

    // 1. Perceptual Image Hashing & Duplicate Verification
    const pHash = computeImagePerceptualHash(imagePayload || `${challengeId}-${studentNotes}-${Date.now()}`);
    
    // Check against recent student proofs for duplicate image submissions
    const recentProofs = await db.collection('student_proofs')
      .find({ pHash: { $exists: true } })
      .sort({ submittedAt: -1 })
      .limit(50)
      .toArray();

    let isDuplicateSuspect = false;
    let duplicateOfId = null;

    for (const prev of recentProofs) {
      if (prev.pHash) {
        const dist = calculateHammingDistance(pHash, prev.pHash);
        if (dist <= 4) { // Near-identical hash match
          isDuplicateSuspect = true;
          duplicateOfId = prev._id;
          break;
        }
      }
    }

    // 2. Exact Polygon Containment Check (Ray-Casting Algorithm)
    let isGeofenceVerified = false;
    const campusFacility = CAMPUS_FACILITY_POLYGONS[targetFacilityKey];
    if (userCoordinates && Array.isArray(userCoordinates) && campusFacility) {
      isGeofenceVerified = isPointInsidePolygon(userCoordinates, campusFacility.vertices);
    } else {
      // Default fallback verification if GPS sensor is unavailable
      isGeofenceVerified = true;
    }

    const proof = {
      _id: `proof-${Date.now().toString(36)}`,
      challengeId,
      challengeTitle,
      studentId: 'std-2041',
      studentName: 'Alex Mercer',
      notes: studentNotes,
      status: 'pending',
      points: Number(points),
      pHash,
      isDuplicateSuspect,
      duplicateOfId,
      isGeofenceVerified,
      targetFacility: campusFacility?.name || 'Campus Grounds',
      submittedAt: new Date(),
    };

    await db.collection('student_proofs').insertOne(proof);
    await logAuditEvent({
      userId: proof.studentId,
      userRole: 'student',
      action: 'ECO_CHALLENGE_PROOF_SUBMITTED',
      details: { challengeId, challengeTitle, pHash, isDuplicateSuspect, isGeofenceVerified },
    });

    res.status(201).json(proof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/leaderboard', (req, res) => {
  res.json([
    { rank: 1, name: 'Elena Rostova', department: 'Environmental Studies', points: 340, badges: ['Water Guardian', 'Waste Diverter'] },
    { rank: 2, name: 'Liam Chen', department: 'Computer Science', points: 290, badges: ['Lab Twilight Shutdown'] },
    { rank: 3, name: 'Alex Mercer', department: 'Engineering', points: 260, badges: ['Biodiversity Steward'] },
    { rank: 4, name: 'Samantha Vance', department: 'Architecture', points: 210, badges: ['Daylight Seeker'] },
  ]);
});

// -------------------------------------------------------------
// 8. Standard User / Household API
// -------------------------------------------------------------
app.post('/api/user/estimate', (req, res) => {
  const { appliances = [], tariffPerKwh = 0.15 } = req.body;
  
  let dailyKwh = 0;
  appliances.forEach(app => {
    dailyKwh += ((Number(app.watts || 0) * Number(app.hoursPerDay || 0)) / 1000);
  });

  const monthlyKwh = Number((dailyKwh * 30).toFixed(2));
  const estimatedBillUsd = Number((monthlyKwh * tariffPerKwh).toFixed(2));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sevenDayForecast = days.map((day, idx) => {
    const factor = idx >= 5 ? 1.15 : 0.96;
    return {
      day,
      estimatedKwh: Number((dailyKwh * factor).toFixed(2)),
      estimatedCost: Number((dailyKwh * factor * tariffPerKwh).toFixed(2)),
    };
  });

  res.json({
    dailyKwh: Number(dailyKwh.toFixed(2)),
    monthlyKwh,
    estimatedBillUsd,
    sevenDayForecast,
    averageHouseholdBenchmarkKwh: 890,
  });
});

app.post('/api/user/ai-savings-tips', async (req, res) => {
  try {
    const { appliances, tariffPerKwh } = req.body;
    const tips = await generateHouseholdSavingsTips(appliances, tariffPerKwh);
    res.json({ tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Production Static Client Serving (Render / Cloud Deployment)
// -------------------------------------------------------------
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback all non-API routes to index.html for client-side routing (Express 5 syntax)
app.get('/{0,}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// -------------------------------------------------------------
// Start Server
// -------------------------------------------------------------
async function startServer() {
  try {
    await connectToDatabase();
    await seedInitialDatabase();

    app.listen(PORT, () => {
      const hostUrl = process.env.RENDER_EXTERNAL_URL || (process.env.NODE_ENV === 'production' ? 'https://ecosphere-client.onrender.com' : `http://localhost:${PORT}`);
      console.log(`🚀 VerdantIQ Full Sustainability Platform API on ${hostUrl}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
