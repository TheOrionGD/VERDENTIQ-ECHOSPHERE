/**
 * Pure JavaScript Server-Side Validators matching the Realistic Input Data Specification.
 */

// 1. General provenance helper
export function applyProvenance(record, { userId, role, sourceType = 'manual_entry', sourceReference = null, notes = null }) {
  const now = new Date();
  return {
    ...record,
    createdBy: userId || 'SYSTEM',
    creatorRole: role || 'user',
    createdAt: now,
    updatedAt: now,
    sourceType,
    sourceReference,
    verificationStatus: 'verified',
    notes,
  };
}

// 2. Institution Profile Validator
export function validateInstitutionProfile(body) {
  const errors = [];
  const { name, code, type, country, state, city, contactEmail, reportingStartDate, academicYear } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Institution name is required and must be at least 3 characters.');
  }
  if (!code || typeof code !== 'string' || code.trim().length < 2) {
    errors.push('Campus code / identifier is required (e.g. VCU, NPI).');
  }
  if (!contactEmail || !contactEmail.includes('@')) {
    errors.push('A valid institution contact email is required.');
  }
  if (!reportingStartDate) {
    errors.push('Reporting start date is required.');
  }
  if (type && typeof type !== 'string') {
    errors.push('Institution type must be a string descriptor.');
  }
  if ((country && typeof country !== 'string') || (state && typeof state !== 'string') || (city && typeof city !== 'string')) {
    errors.push('Location fields (country, state, city) must be valid strings.');
  }
  if (academicYear && typeof academicYear !== 'string') {
    errors.push('Academic year must be a valid string format (e.g. 2024-2025).');
  }

  // Optional fields validation
  if (body.studentCount !== undefined && Number(body.studentCount) < 0) {
    errors.push('Student population must be non-negative.');
  }
  if (body.campusAreaSqM !== undefined && Number(body.campusAreaSqM) < 0) {
    errors.push('Campus area must be non-negative.');
  }

  return { isValid: errors.length === 0, errors };
}

// 3. Energy & Electricity Validator
export function validateElectricityRecord(body) {
  const errors = [];
  const { periodStart, periodEnd, kwhConsumed, totalCost, currency = 'USD' } = body;

  if (currency && typeof currency !== 'string') {
    errors.push('Currency must be a string ISO code.');
  }

  if (!periodStart || !periodEnd) {
    errors.push('Billing period start and end dates are required.');
  } else if (new Date(periodEnd) < new Date(periodStart)) {
    errors.push('Billing end date cannot precede start date.');
  }

  if (kwhConsumed === undefined || Number(kwhConsumed) < 0) {
    errors.push('Electricity consumption (kWh) must be a non-negative number.');
  }
  if (totalCost === undefined || Number(totalCost) < 0) {
    errors.push('Total billed amount must be non-negative.');
  }

  return { isValid: errors.length === 0, errors };
}

// 4. Water Conservation Validator
export function validateWaterRecord(body) {
  const errors = [];
  const { period, volume, unit = 'm3', source = 'municipal' } = body;

  if (!period || typeof period !== 'string') {
    errors.push('Reporting period (YYYY-MM) is required.');
  }
  if (volume === undefined || Number(volume) < 0) {
    errors.push('Water volume must be non-negative.');
  }

  const validSources = ['municipal', 'borewell', 'tanker', 'rainwater', 'recycled'];
  if (!validSources.includes(source)) {
    errors.push(`Water source must be one of: ${validSources.join(', ')}.`);
  }

  // Normalize to m3
  let volumeM3 = Number(volume);
  if (unit === 'litres' || unit === 'L') {
    volumeM3 = volumeM3 / 1000;
  }

  return { isValid: errors.length === 0, errors, normalizedVolumeM3: volumeM3 };
}

// 5. Waste Management Validator
export function validateWasteRecord(body) {
  const errors = [];
  const { period, category, quantity, unit = 'kg', status = 'collected' } = body;

  if (status && typeof status !== 'string') {
    errors.push('Waste processing status must be a valid string identifier.');
  }

  if (!period) errors.push('Reporting period is required.');
  if (quantity === undefined || Number(quantity) < 0) {
    errors.push('Waste quantity must be a non-negative number.');
  }

  const validCategories = ['organic', 'recyclable', 'general', 'hazardous', 'e-waste'];
  if (category && !validCategories.includes(category)) {
    errors.push(`Waste category must be one of: ${validCategories.join(', ')}.`);
  }

  // Normalize to kg
  let quantityKg = Number(quantity);
  if (unit === 'tonnes' || unit === 't') {
    quantityKg = quantityKg * 1000;
  }

  return { isValid: errors.length === 0, errors, normalizedQuantityKg: quantityKg };
}

// 6. Carbon Activity Record Validator
export function validateCarbonRecord(body) {
  const errors = [];
  const { period, activityCategory, quantity, scope, emissionFactor, factorSource } = body;

  if (!period) errors.push('Reporting period is required.');
  if (!activityCategory) errors.push('Activity category is required.');
  if (quantity === undefined || Number(quantity) < 0) errors.push('Activity quantity must be non-negative.');
  if (![1, 2, 3, '1', '2', '3'].includes(scope)) errors.push('Scope must be 1, 2, or 3.');
  if (emissionFactor === undefined || Number(emissionFactor) < 0) errors.push('Emission factor must be non-negative.');
  if (!factorSource) errors.push('Emission factor source documentation is required.');

  const calculatedCo2eKg = Number((Number(quantity) * Number(emissionFactor)).toFixed(2));

  return { isValid: errors.length === 0, errors, calculatedCo2eKg };
}

// 7. Biodiversity Record Validator
export function validateBiodiversityRecord(body) {
  const errors = [];
  const { speciesName, quantityPlanted, plantingDate, campusZone } = body;

  if (!speciesName) errors.push('Species or common plant name is required.');
  if (quantityPlanted === undefined || Number(quantityPlanted) < 1) errors.push('Quantity planted must be at least 1.');
  if (!plantingDate) errors.push('Planting date is required.');
  if (!campusZone) errors.push('Campus zone or location is required.');

  return { isValid: errors.length === 0, errors };
}

// 8. Sustainable Mobility Survey Validator
export function validateMobilitySurvey(body) {
  const errors = [];
  const { surveyPeriod, transportMode, tripsPerWeek } = body;

  if (!surveyPeriod) errors.push('Survey period is required.');
  if (!transportMode) errors.push('Primary transport mode is required.');
  if (tripsPerWeek !== undefined && (Number(tripsPerWeek) < 0 || Number(tripsPerWeek) > 30)) {
    errors.push('Trips per week must be between 0 and 30.');
  }

  return { isValid: errors.length === 0, errors };
}

// 9. Green Facility Operations Validator
export function validateFacilitySchedule(body) {
  const errors = [];
  const { facilityName, startHour, endHour, setpointTempC } = body;

  if (!facilityName) errors.push('Facility name is required.');
  if (!startHour || !endHour) errors.push('Opening and closing operating hours are required.');
  if (setpointTempC !== undefined && (Number(setpointTempC) < 16 || Number(setpointTempC) > 30)) {
    errors.push('Target HVAC temperature must be between 16°C and 30°C.');
  }

  return { isValid: errors.length === 0, errors };
}

// 10. Student Challenge & EcoPoints Idempotency Validator
export function validateChallengeProof(body) {
  const errors = [];
  const { challengeId, challengeTitle, studentNotes } = body;

  if (!challengeId) errors.push('Challenge ID reference is required.');
  if (!challengeTitle) errors.push('Challenge title is required.');
  if (!studentNotes || studentNotes.trim().length < 5) {
    errors.push('Student action reflection / notes must be at least 5 characters.');
  }

  return { isValid: errors.length === 0, errors };
}
