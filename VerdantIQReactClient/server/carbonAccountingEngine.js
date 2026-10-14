/**
 * Verifiable Emissions Factors Catalog
 * Every factor includes: value, unit, geography, applicableYear, source, methodology, version.
 * Standardizes Scope 1, Scope 2 Location/Market, and Scope 3 activity factors.
 */

export const EMISSIONS_FACTORS_CATALOG = {
  // Scope 1: Direct Stationary & Mobile Combustion
  naturalGas_therms: {
    factor: 5.306,
    unit: 'kg CO2e / therm',
    geography: 'US National',
    applicableYear: 2024,
    source: 'EPA GHG Emission Factors Hub (Table 1: Stationary Combustion)',
    methodology: 'IPCC AR5 GWP100',
    version: '2024.1',
  },
  diesel_gallons: {
    factor: 10.21,
    unit: 'kg CO2e / gallon',
    geography: 'US National',
    applicableYear: 2024,
    source: 'EPA Mobile Combustion Guidance',
    methodology: 'EPA MRR (40 CFR Part 98)',
    version: '2024.1',
  },
  gasoline_gallons: {
    factor: 8.78,
    unit: 'kg CO2e / gallon',
    geography: 'US National',
    applicableYear: 2024,
    source: 'EPA Mobile Combustion Guidance',
    methodology: 'EPA MRR (40 CFR Part 98)',
    version: '2024.1',
  },

  // Scope 2: Purchased Electricity (eGRID Subregions)
  egrid_subregions: {
    NWPP: {
      factor: 0.285, // kg CO2e / kWh (Clean hydro-heavy Pacific NW)
      unit: 'kg CO2e / kWh',
      geography: 'US EPA eGRID NWPP (Northwest Power Pool)',
      applicableYear: 2024,
      source: 'EPA eGRID 2022 released 2024',
      methodology: 'eGRID Subregion Gross Output',
      version: 'v2024_eGRID2022',
    },
    CAMX: {
      factor: 0.215,
      unit: 'kg CO2e / kWh',
      geography: 'US EPA eGRID CAMX (California)',
      applicableYear: 2024,
      source: 'EPA eGRID 2022 released 2024',
      methodology: 'eGRID Subregion Gross Output',
      version: 'v2024_eGRID2022',
    },
    RFCW: {
      factor: 0.512,
      unit: 'kg CO2e / kWh',
      geography: 'US EPA eGRID RFCW (RFC West - Midwest/Coal Mix)',
      applicableYear: 2024,
      source: 'EPA eGRID 2022 released 2024',
      methodology: 'eGRID Subregion Gross Output',
      version: 'v2024_eGRID2022',
    },
    US_AVG: {
      factor: 0.388,
      unit: 'kg CO2e / kWh',
      geography: 'US National Average',
      applicableYear: 2024,
      source: 'EPA GHG Emission Factors Hub',
      methodology: 'eGRID National Gross Output',
      version: 'v2024.1',
    },
  },

  // Scope 3: Commuting, Water, & Waste Lifecycle
  transit_passenger_mile: {
    factor: 0.14,
    unit: 'kg CO2e / passenger-mile',
    geography: 'US National',
    applicableYear: 2024,
    source: 'Federal Transit Administration / EPA Hub',
    methodology: 'Modal Average',
    version: '2024.1',
  },
  solo_vehicle_passenger_mile: {
    factor: 0.34,
    unit: 'kg CO2e / passenger-mile',
    geography: 'US National',
    applicableYear: 2024,
    source: 'EPA Hub (Passenger Cars)',
    methodology: 'EPA Mobile',
    version: '2024.1',
  },
  water_supply_treatment_m3: {
    factor: 0.344,
    unit: 'kg CO2e / m3',
    geography: 'US Municipal Average',
    applicableYear: 2024,
    source: 'WRI / UNH SIMAP Water Module',
    methodology: 'Embodied Water-Energy Nexus',
    version: '2024.1',
  },
  landfill_waste_kg: {
    factor: 0.52,
    unit: 'kg CO2e / kg general waste',
    geography: 'US National Municipal Solid Waste',
    applicableYear: 2024,
    source: 'EPA WARM (Waste Reduction Model) v15',
    methodology: 'Landfill with LFG recovery',
    version: 'WARM_v15',
  },
  compost_diversion_credit_kg: {
    factor: -0.18, // Avoided methane credit
    unit: 'kg CO2e / kg diverted compost',
    geography: 'US Municipal Composting',
    applicableYear: 2024,
    source: 'EPA WARM v15',
    methodology: 'Organic Composting Offset',
    version: 'WARM_v15',
  },
};

/**
 * Calculates Scope 1, Scope 2 (Location & Market), and Scope 3 GHG inventory.
 * Strictly separates RECs (market-based Scope 2 only), Offsets, and Removals.
 */
export function calculateCampusGhgInventory({
  // Scope 1 inputs
  naturalGasTherms = 0,
  dieselGallons = 0,
  gasolineGallons = 0,

  // Scope 2 inputs
  electricityKwh = 0,
  egridSubregion = 'NWPP',
  purchasedRecsMwh = 0, // 1 MWh = 1000 kWh of zero-carbon claim
  onSiteSolarGenerationKwh = 0,

  // Scope 3 inputs
  commutePassengerMilesSolo = 0,
  commutePassengerMilesTransit = 0,
  waterConsumedM3 = 0,
  generalWasteKg = 0,
  divertedCompostKg = 0,

  // Carbon Offsets & Removals (Calculated post-gross)
  verifiedOffsetsTonsCo2 = 0,
  verifiedRemovalsTonsCo2 = 0,
} = {}) {
  // Validate inputs
  const safeNum = (val) => (typeof val === 'number' && !isNaN(val) && val >= 0 ? val : 0);

  // 1. Scope 1 Calculations
  const scope1GasKg = safeNum(naturalGasTherms) * EMISSIONS_FACTORS_CATALOG.naturalGas_therms.factor;
  const scope1DieselKg = safeNum(dieselGallons) * EMISSIONS_FACTORS_CATALOG.diesel_gallons.factor;
  const scope1GasolineKg = safeNum(gasolineGallons) * EMISSIONS_FACTORS_CATALOG.gasoline_gallons.factor;
  const totalScope1Kg = scope1GasKg + scope1DieselKg + scope1GasolineKg;

  // 2. Scope 2 Calculations
  const egridMeta = EMISSIONS_FACTORS_CATALOG.egrid_subregions[egridSubregion] || EMISSIONS_FACTORS_CATALOG.egrid_subregions.US_AVG;
  const gridFactor = egridMeta.factor;

  // Location-based: All purchased grid electricity * regional factor
  const totalGridElectricityKwh = safeNum(electricityKwh);
  const scope2LocationBasedKg = totalGridElectricityKwh * gridFactor;

  // Market-based: Subtract verified zero-carbon RECs (cannot exceed total purchased)
  const recsEquivalentKwh = safeNum(purchasedRecsMwh) * 1000;
  const netMarketElectricityKwh = Math.max(0, totalGridElectricityKwh - recsEquivalentKwh);
  const scope2MarketBasedKg = netMarketElectricityKwh * gridFactor;

  // 3. Scope 3 Calculations
  const scope3SoloKg = safeNum(commutePassengerMilesSolo) * EMISSIONS_FACTORS_CATALOG.solo_vehicle_passenger_mile.factor;
  const scope3TransitKg = safeNum(commutePassengerMilesTransit) * EMISSIONS_FACTORS_CATALOG.transit_passenger_mile.factor;
  const scope3WaterKg = safeNum(waterConsumedM3) * EMISSIONS_FACTORS_CATALOG.water_supply_treatment_m3.factor;
  const scope3WasteKg = safeNum(generalWasteKg) * EMISSIONS_FACTORS_CATALOG.landfill_waste_kg.factor;
  const scope3CompostCreditKg = safeNum(divertedCompostKg) * EMISSIONS_FACTORS_CATALOG.compost_diversion_credit_kg.factor;
  const totalScope3Kg = Math.max(0, scope3SoloKg + scope3TransitKg + scope3WaterKg + scope3WasteKg + scope3CompostCreditKg);

  // 4. Gross and Net Emissions
  const grossLocationBasedMetricTons = (totalScope1Kg + scope2LocationBasedKg + totalScope3Kg) / 1000;
  const grossMarketBasedMetricTons = (totalScope1Kg + scope2MarketBasedKg + totalScope3Kg) / 1000;

  // Offsets and Removals applied exclusively post-gross
  const totalOffsetsRemovalsTons = safeNum(verifiedOffsetsTonsCo2) + safeNum(verifiedRemovalsTonsCo2);
  const netMarketBasedMetricTons = Math.max(0, grossMarketBasedMetricTons - totalOffsetsRemovalsTons);

  return {
    reportingStandard: 'AASHE STARS 3.0 / GHG Protocol Corporate Standard',
    reportingYear: 2026,
    factorsUsed: {
      scope1: {
        naturalGas: EMISSIONS_FACTORS_CATALOG.naturalGas_therms,
        diesel: EMISSIONS_FACTORS_CATALOG.diesel_gallons,
      },
      scope2: {
        selectedSubregion: egridSubregion,
        egridFactorMetadata: egridMeta,
      },
      scope3: {
        water: EMISSIONS_FACTORS_CATALOG.water_supply_treatment_m3,
        waste: EMISSIONS_FACTORS_CATALOG.landfill_waste_kg,
      },
    },
    breakdownKg: {
      scope1: {
        naturalGasKg: Math.round(scope1GasKg),
        dieselKg: Math.round(scope1DieselKg),
        gasolineKg: Math.round(scope1GasolineKg),
        totalKg: Math.round(totalScope1Kg),
      },
      scope2: {
        locationBasedKg: Math.round(scope2LocationBasedKg),
        marketBasedKg: Math.round(scope2MarketBasedKg),
        recsAppliedKwh: Math.min(totalGridElectricityKwh, recsEquivalentKwh),
        onSiteSolarSelfConsumedKwh: safeNum(onSiteSolarGenerationKwh),
      },
      scope3: {
        commuteSoloKg: Math.round(scope3SoloKg),
        commuteTransitKg: Math.round(scope3TransitKg),
        waterKg: Math.round(scope3WaterKg),
        wasteKg: Math.round(scope3WasteKg),
        compostAvoidedKg: Math.round(Math.abs(scope3CompostCreditKg)),
        totalKg: Math.round(totalScope3Kg),
      },
    },
    summaryTonsCo2e: {
      grossLocationBasedTons: parseFloat(grossLocationBasedMetricTons.toFixed(2)),
      grossMarketBasedTons: parseFloat(grossMarketBasedMetricTons.toFixed(2)),
      offsetsAppliedTons: safeNum(verifiedOffsetsTonsCo2),
      removalsAppliedTons: safeNum(verifiedRemovalsTonsCo2),
      netMarketBasedTons: parseFloat(netMarketBasedMetricTons.toFixed(2)),
    },
  };
}
