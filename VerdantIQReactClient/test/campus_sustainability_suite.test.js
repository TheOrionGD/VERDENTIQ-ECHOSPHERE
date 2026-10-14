import { describe, it } from 'node:test';
import assert from 'node:assert';

// 1. Carbon Accounting Engine
import { calculateCampusGhgInventory } from '../server/carbonAccountingEngine.js';

// 2. STARS Readiness Engine
import { assessStarsReadiness } from '../server/starsReadinessEngine.js';

// 3. Evidence Verification Engine (pHash & Geofence PIP)
import { 
  computeImagePerceptualHash, 
  calculateHammingDistance, 
  isPointInsidePolygon, 
  CAMPUS_FACILITY_POLYGONS 
} from '../server/evidenceVerificationEngine.js';

// 4. Building Thermal 1R1C Physics Engine
import { BuildingThermalModel } from '../src/lib/physics/buildingThermalModel.js';

// 5. Canonical JSON & Tamper-Evident Ledger
import { computeAuditHash, verifyAuditChain } from '../server/auditEngine.js';

describe('VerdantIQ Higher Education Sustainability Suite', () => {

  describe('1. Carbon Accounting & Scope 1/2/3 Verification', () => {
    it('should correctly calculate dual Location-Based vs Market-Based Scope 2 emissions using RECs', () => {
      const res = calculateCampusGhgInventory({
        electricityKwh: 100000,
        egridSubregion: 'NWPP', // 0.285 kg/kWh
        purchasedRecsMwh: 40,   // 40,000 kWh zero-carbon credit
        naturalGasTherms: 1000, // Scope 1: 5.306 kg/therm
      });

      // Location-based: 100,000 * 0.285 = 28,500 kg
      assert.strictEqual(res.breakdownKg.scope2.locationBasedKg, 28500);

      // Market-based: (100,000 - 40,000) * 0.285 = 17,100 kg
      assert.strictEqual(res.breakdownKg.scope2.marketBasedKg, 17100);

      // Scope 1: 1,000 * 5.306 = 5,306 kg
      assert.strictEqual(res.breakdownKg.scope1.totalKg, 5306);

      // Verified metadata presence
      assert.strictEqual(res.factorsUsed.scope2.egridFactorMetadata.geography, 'US EPA eGRID NWPP (Northwest Power Pool)');
    });

    it('should strictly avoid double-counting carbon offsets and apply them post-gross', () => {
      const res = calculateCampusGhgInventory({
        electricityKwh: 50000,
        egridSubregion: 'NWPP',
        verifiedOffsetsTonsCo2: 5.0, // 5 metric tons offset
      });

      assert.strictEqual(res.summaryTonsCo2e.grossLocationBasedTons, 14.25);
      assert.strictEqual(res.summaryTonsCo2e.offsetsAppliedTons, 5.0);
      assert.strictEqual(res.summaryTonsCo2e.netMarketBasedTons, 9.25);
    });
  });

  describe('2. AASHE STARS Version-Aware Readiness Tracker', () => {
    it('should assess gap audit readiness without claiming unauthorized official certification', () => {
      const readiness = assessStarsReadiness({
        'Air & Climate (OP-1)': { hasScope1: true, hasScope2Dual: true, hasScope3: true, hasRecsDocumentation: true },
        'Energy (OP-2)': { monthlyReadingsCount: 12, hasEuiNormalized: true, onSiteRenewablePct: 15 },
        'Waste (OP-19)': { diversionRatePct: 52, hasWeighScaleSlips: true },
      });

      assert.strictEqual(readiness.isOfficialSubmission, false);
      assert.strictEqual(readiness.overallReadiness.completionPercentage, 100);
      assert.ok(readiness.overallReadiness.certificationDisclaimer.includes('internal self-assessment'));
    });
  });

  describe('3. Evidence Verification: pHash De-duplication & Exact Geofence Containment', () => {
    it('should detect identical or near-duplicate perceptual image hashes', () => {
      const hash1 = computeImagePerceptualHash('meter_reading_payload_october_image_bytes');
      const hash2 = computeImagePerceptualHash('meter_reading_payload_october_image_bytes');
      const hashDifferent = computeImagePerceptualHash('totally_different_campus_compost_photo');

      const distIdentical = calculateHammingDistance(hash1, hash2);
      const distDifferent = calculateHammingDistance(hash1, hashDifferent);

      assert.strictEqual(distIdentical, 0);
      assert.ok(distDifferent > 10, 'Distinct images should have high Hamming distance');
    });

    it('should verify exact polygon containment via Ray-Casting and reject points outside vertices', () => {
      const quad = CAMPUS_FACILITY_POLYGONS.science_building_quad;

      // Inside science building quad [47.6060–47.6075 N, -122.3325– -122.3305 W]
      const insidePoint = [47.6068, -122.3315];
      assert.strictEqual(isPointInsidePolygon(insidePoint, quad.vertices), true);

      // Outside campus grounds
      const outsidePoint = [47.6200, -122.3500];
      assert.strictEqual(isPointInsidePolygon(outsidePoint, quad.vertices), false);
    });
  });

  describe('4. Building Thermal 1R1C Physics Engine', () => {
    it('should simulate indoor temperature and HVAC electrical power draw under heat stress', () => {
      const model = new BuildingThermalModel({
        cTh: 1.5e7,
        rTh: 0.001,
        initialTemp: 22.0,
        setpointTemp: 21.0,
        hvacCapacityWatts: 8000,
      });

      // Step forward 10 minutes (600 seconds) in 35°C exterior heat
      const snapshot = model.step(600, {
        tOut: 35.0,
        qSolar: 2000,
        occupants: 5,
        hvacMode: 'AUTO',
      });

      assert.ok(snapshot.indoorTemp > 21.0, 'Indoor temp should rise slightly with intense exterior heat');
      assert.ok(snapshot.electricalPowerKw > 0, 'HVAC should actively draw electricity to cool the building');
      assert.strictEqual(typeof snapshot.cumulativeKwh, 'number');
    });
  });

  describe('5. Tamper-Evident SHA-256 Ledger & Sequence Validation', () => {
    it('should verify a valid cryptographic chain and detect tampering', () => {
      const log1 = {
        timestamp: '2026-10-14T10:00:00Z',
        userId: 'admin-1',
        userRole: 'institution',
        action: 'ELECTRICITY_READING',
        details: { kwh: 50000, period: '2026-09' },
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      };
      log1.currentHash = computeAuditHash(log1);

      const log2 = {
        timestamp: '2026-10-14T10:05:00Z',
        userId: 'admin-1',
        userRole: 'institution',
        action: 'WATER_READING',
        details: { m3: 1200, period: '2026-09' },
        previousHash: log1.currentHash,
      };
      log2.currentHash = computeAuditHash(log2);

      // Valid chain
      const validCheck = verifyAuditChain([log1, log2]);
      assert.strictEqual(validCheck.isValid, true);
      assert.strictEqual(validCheck.unbrokenCount, 2);

      // Tampered chain (modify data inside log1)
      const tamperedLog1 = { ...log1, details: { kwh: 20000, period: '2026-09' } };
      const tamperedCheck = verifyAuditChain([tamperedLog1, log2]);
      assert.strictEqual(tamperedCheck.isValid, false);
      assert.strictEqual(tamperedCheck.tamperedIndex, 0);
    });
  });
});
