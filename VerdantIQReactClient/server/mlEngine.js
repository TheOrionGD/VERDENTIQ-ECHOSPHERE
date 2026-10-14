/**
 * Pure JavaScript Forecasting & Statistical Modeling Engine.
 * Operates on recorded campus consumption history without external Python/R dependencies.
 */

/**
 * Computes statistical metrics (MAE, RMSE, Mean) between actual and predicted datasets.
 */
export function evaluateForecastAccuracy(actuals, predictions) {
  if (!actuals || !predictions || actuals.length === 0 || predictions.length === 0) {
    return { mae: 0, rmse: 0, mape: 0, sampleSize: 0 };
  }

  const n = Math.min(actuals.length, predictions.length);
  let absErrorSum = 0;
  let sqErrorSum = 0;
  let percentageErrorSum = 0;

  for (let i = 0; i < n; i++) {
    const act = actuals[i];
    const pred = predictions[i];
    const err = act - pred;

    absErrorSum += Math.abs(err);
    sqErrorSum += err * err;
    if (act !== 0) {
      percentageErrorSum += Math.abs(err / act);
    }
  }

  return {
    mae: Number((absErrorSum / n).toFixed(2)),
    rmse: Number((Math.sqrt(sqErrorSum / n)).toFixed(2)),
    mape: Number(((percentageErrorSum / n) * 100).toFixed(2)),
    sampleSize: n,
  };
}

/**
 * Generates an electricity demand forecast based on historical monthly or daily consumption series.
 * Uses Holt-Winters Exponential Smoothing (Level + Trend).
 *
 * @param {Array<{ period: string, kwh: number }>} history - Recorded historical readings
 * @param {number} periodsAhead - Number of future intervals to forecast (e.g. 6 months or 7 days)
 * @param {number} alpha - Level smoothing parameter (0 < alpha < 1)
 * @param {number} beta - Trend smoothing parameter (0 < beta < 1)
 */
export function generateDemandForecast(history, periodsAhead = 6, alpha = 0.4, beta = 0.2) {
  if (!history || history.length < 2) {
    return [];
  }

  const values = history.map(h => Number(h.kwh || 0));
  let level = values[0];
  let trend = values[1] - values[0];

  const fitted = [level];

  // Fit model to historical points
  for (let i = 1; i < values.length; i++) {
    const prevLevel = level;
    level = alpha * values[i] + (1 - alpha) * (prevLevel + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    fitted.push(Math.round(level + trend));
  }

  // Project future periods
  const futureForecasts = [];
  for (let m = 1; m <= periodsAhead; m++) {
    const projectedKwh = Math.round(Math.max(0, level + m * trend));
    futureForecasts.push({
      step: m,
      forecastKwh: projectedKwh,
      lowerBoundKwh: Math.round(projectedKwh * 0.93),
      upperBoundKwh: Math.round(projectedKwh * 1.07),
    });
  }

  return {
    fittedHistory: fitted,
    futureForecasts,
    parameters: { alpha, beta, periodsAhead },
  };
}

/**
 * Calculates genuine multi-objective trade-off candidates (Cost vs Carbon vs Comfort).
 * Rather than decorative points, this computes actual candidates across setpoint and curtailment options.
 *
 * @param {Object} baseline - { monthlyKwh, tariffPerKwh, gridFactorKgCo2PerKwh }
 * @param {Array<number>} setpointDeltas - e.g. [-2, -1, 0, 1, 2] degrees C change in HVAC
 */
export function calculateParetoTradeoffs(baseline, setpointDeltas = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]) {
  const { monthlyKwh = 150000, tariffPerKwh = 0.12, gridFactorKgCo2PerKwh = 0.45 } = baseline;

  // HVAC accounts for ~40% of standard institutional electricity
  const hvacBaseKwh = monthlyKwh * 0.40;
  const nonHvacKwh = monthlyKwh * 0.60;

  return setpointDeltas.map(delta => {
    // Each 1 degree Celsius adjustment reduces or increases HVAC consumption by approx 7%
    const hvacModifier = 1 - (delta * 0.07);
    const totalSimulatedKwh = Math.round(nonHvacKwh + (hvacBaseKwh * hvacModifier));
    const simulatedCost = Number((totalSimulatedKwh * tariffPerKwh).toFixed(2));
    const simulatedCo2Kg = Number((totalSimulatedKwh * gridFactorKgCo2PerKwh).toFixed(2));
    
    // Comfort score: 100 is baseline setpoint (delta = 0), penalizes deviation
    const comfortScore = Math.max(40, Math.round(100 - Math.abs(delta) * 14));

    return {
      setpointDeltaC: delta,
      simulatedKwh: totalSimulatedKwh,
      simulatedCostUsd: simulatedCost,
      simulatedCarbonKg: simulatedCo2Kg,
      comfortScore,
      costSavingsUsd: Number(((monthlyKwh * tariffPerKwh) - simulatedCost).toFixed(2)),
      carbonSavingsKg: Number(((monthlyKwh * gridFactorKgCo2PerKwh) - simulatedCo2Kg).toFixed(2)),
    };
  });
}
