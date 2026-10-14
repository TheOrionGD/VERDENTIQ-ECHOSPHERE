/**
 * AASHE STARS Version-Aware Readiness Tracker
 * Evaluates campus operational credits (STARS 3.0 & STARS 2.2 criteria).
 * Strictly distinguishes validated evidence from unverified claims.
 */

export const STARS_CREDITS_SPEC = {
  version: '3.0 (Operational Release)',
  categories: {
    'Air & Climate (OP-1)': {
      id: 'OP-1',
      title: 'Greenhouse Gas Emissions Inventory',
      pointsAvailable: 8,
      requiredEvidence: [
        'Complete Scope 1 inventory with stationary combustion invoices',
        'Dual Location-based and Market-based Scope 2 inventory',
        'Scope 3 commute survey or waste lifecycle documentation',
        'Clear separation of RECs and carbon offsets',
      ],
      evaluate: (data) => {
        const { hasScope1, hasScope2Dual, hasScope3, hasRecsDocumentation } = data;
        let score = 0;
        const missing = [];
        if (hasScope1) score += 2; else missing.push('Scope 1 stationary/fleet fuel measurements');
        if (hasScope2Dual) score += 3; else missing.push('Dual location and market-based Scope 2 calculations');
        if (hasScope3) score += 2; else missing.push('Scope 3 commuting or waste lifecycle measurement');
        if (hasRecsDocumentation) score += 1; else missing.push('Third-party verified REC retirement serial numbers');

        return {
          earnedPoints: score,
          maxPoints: 8,
          readinessStatus: score >= 7 ? 'VERIFICATION_READY' : score >= 4 ? 'IN_PROGRESS' : 'PRE_AUDIT',
          missingRequirements: missing,
        };
      },
    },
    'Energy (OP-2)': {
      id: 'OP-2',
      title: 'Building Energy Consumption & Clean Renewables',
      pointsAvailable: 10,
      requiredEvidence: [
        'Monthly utility meter billing history across all campus meters',
        'Weather-normalized Energy Use Intensity (EUI in kBtu/ft² or kWh/m²)',
        'On-site clean renewable generation metering',
      ],
      evaluate: (data) => {
        const { monthlyReadingsCount = 0, hasEuiNormalized = false, onSiteRenewablePct = 0 } = data;
        let score = 0;
        const missing = [];
        if (monthlyReadingsCount >= 12) score += 4; else missing.push('Full 12 consecutive months of billing records');
        if (hasEuiNormalized) score += 3; else missing.push('Gross floor area normalized EUI calculations');
        if (onSiteRenewablePct >= 10) score += 3; else if (onSiteRenewablePct > 0) score += 1.5; else missing.push('Minimum on-site renewable generation fraction');

        return {
          earnedPoints: score,
          maxPoints: 10,
          readinessStatus: score >= 8 ? 'VERIFICATION_READY' : score >= 4 ? 'IN_PROGRESS' : 'PRE_AUDIT',
          missingRequirements: missing,
        };
      },
    },
    'Waste (OP-19)': {
      id: 'OP-19',
      title: 'Waste Minimization & Diversion Rate',
      pointsAvailable: 6,
      requiredEvidence: [
        'Certified landfill haul weight manifests',
        'Compost and recycling diversion weight slips',
        'E-waste zero-landfill stewardship certification',
      ],
      evaluate: (data) => {
        const { diversionRatePct = 0, hasWeighScaleSlips = false } = data;
        let score = 0;
        const missing = [];
        if (hasWeighScaleSlips) score += 2; else missing.push('Third-party haul scale tickets and receipts');
        if (diversionRatePct >= 50) score += 4; else if (diversionRatePct >= 25) score += 2; else missing.push('Campus diversion rate below 25% threshold');

        return {
          earnedPoints: score,
          maxPoints: 6,
          readinessStatus: score >= 5 ? 'VERIFICATION_READY' : score >= 2 ? 'IN_PROGRESS' : 'PRE_AUDIT',
          missingRequirements: missing,
        };
      },
    },
  },
};

/**
 * Assesses total institution STARS reporting readiness score.
 */
export function assessStarsReadiness(auditData = {}) {
  const creditsResults = {};
  let totalEarned = 0;
  let totalAvailable = 0;

  for (const [key, credit] of Object.entries(STARS_CREDITS_SPEC.categories)) {
    const res = credit.evaluate(auditData[key] || {});
    creditsResults[key] = {
      ...res,
      title: credit.title,
      requiredEvidence: credit.requiredEvidence,
    };
    totalEarned += res.earnedPoints;
    totalAvailable += res.maxPoints;
  }

  const completionPct = Math.round((totalEarned / totalAvailable) * 100);

  // STARS Rating Estimation (Illustrative Internal Metric, NOT official AASHE award)
  let estimatedTier = 'Reporter';
  if (completionPct >= 85) estimatedTier = 'Estimated Platinum Ready';
  else if (completionPct >= 65) estimatedTier = 'Estimated Gold Ready';
  else if (completionPct >= 50) estimatedTier = 'Estimated Silver Ready';
  else if (completionPct >= 30) estimatedTier = 'Estimated Bronze Ready';

  return {
    framework: 'AASHE STARS 3.0 Operational Credit Boundary',
    assessedAt: new Date().toISOString(),
    isOfficialSubmission: false, // Explicit: internal gap assessment only
    overallReadiness: {
      totalEarnedPoints: totalEarned,
      totalAvailablePoints: totalAvailable,
      completionPercentage: completionPct,
      estimatedInternalTier: estimatedTier,
      certificationDisclaimer: 'Notice: This is an internal self-assessment gap audit. Official STARS recognition requires formal submission and AASHE third-party staff review.',
    },
    credits: creditsResults,
  };
}
