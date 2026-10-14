/**
 * BuildingThermalModel - 1R1C Lumped-Parameter Thermodynamic Physics Engine
 * Pure JavaScript client-side discrete-time simulation of building energy balance.
 * 
 * First Law of Thermodynamics:
 * d(T_in)/dt = (1 / C_th) * [ (T_out - T_in) / R_th + Q_solar + Q_internal + Q_hvac ]
 */

export class BuildingThermalModel {
  /**
   * @param {Object} config
   * @param {number} config.cTh - Thermal Capacitance (J/K) [Structure & air thermal mass]
   * @param {number} config.rTh - Thermal Resistance of Building Envelope (K/W)
   * @param {number} config.initialTemp - Initial indoor temperature in Celsius (°C)
   * @param {number} config.setpointTemp - Target climate comfort setpoint (°C)
   * @param {number} config.hvacCapacityWatts - Max heating/cooling thermal capacity (W)
   */
  constructor({
    cTh = 1.8e7,
    rTh = 0.0012,
    initialTemp = 22.0,
    setpointTemp = 21.5,
    hvacCapacityWatts = 8500,
  } = {}) {
    this.cTh = cTh;
    this.rTh = rTh;
    this.tIn = initialTemp;
    this.setpoint = setpointTemp;
    this.hvacCapacity = hvacCapacityWatts;
    this.totalKwh = 0;
  }

  /**
   * Step the physics simulation forward by dt seconds.
   * @param {number} dt - Time delta in seconds (e.g. 60s for 1 simulation minute)
   * @param {Object} env - External weather and boundary inputs
   * @param {number} env.tOut - Ambient outdoor temperature (°C)
   * @param {number} env.qSolar - Solar radiation heat gain (Watts)
   * @param {number} env.occupants - Number of people active inside zone (100W per person)
   * @param {string} env.hvacMode - 'AUTO' | 'HEATING' | 'COOLING' | 'OFF'
   * @returns {Object} Simulation telemetry snapshot
   */
  step(dt, { tOut = 28.0, qSolar = 1500, occupants = 4, hvacMode = 'AUTO' } = {}) {
    // 1. Conduction through envelope (Watts)
    const qConduction = (tOut - this.tIn) / this.rTh;

    // 2. Internal metabolic and plug heat gains (Watts)
    const qInternal = occupants * 120;

    // 3. HVAC thermal dynamic reaction (proportional thermal controller)
    let qHvac = 0;
    const tempDelta = this.tIn - this.setpoint;

    if (hvacMode === 'AUTO') {
      if (tempDelta > 0.4) {
        // Zone too warm -> active cooling (extract heat)
        const intensity = Math.min(tempDelta / 2.0, 1.0);
        qHvac = -this.hvacCapacity * intensity;
      } else if (tempDelta < -0.4) {
        // Zone too cold -> active heating (inject heat)
        const intensity = Math.min(-tempDelta / 2.0, 1.0);
        qHvac = this.hvacCapacity * intensity;
      }
    } else if (hvacMode === 'COOLING') {
      qHvac = -this.hvacCapacity;
    } else if (hvacMode === 'HEATING') {
      qHvac = this.hvacCapacity;
    }

    // 4. Net thermal energy flow (Watts = Joules / sec)
    const qNet = qConduction + qSolar + qInternal + qHvac;

    // 5. Numerical Euler Integration for temperature rate of change
    const dTemp = (qNet / this.cTh) * dt;
    this.tIn += dTemp;

    // 6. Cumulative electric energy accounting (Assuming COP = 3.2 for Heat Pump)
    const cop = 3.2;
    const electricWatts = Math.abs(qHvac) / cop;
    const energyKwhStep = (electricWatts * (dt / 3600)) / 1000;
    this.totalKwh += energyKwhStep;

    return {
      indoorTemp: parseFloat(this.tIn.toFixed(2)),
      outdoorTemp: tOut,
      setpoint: this.setpoint,
      qNetWatts: Math.round(qNet),
      hvacThermalWatts: Math.round(qHvac),
      electricalPowerKw: parseFloat((electricWatts / 1000).toFixed(2)),
      stepEnergyKwh: parseFloat(energyKwhStep.toFixed(4)),
      cumulativeKwh: parseFloat(this.totalKwh.toFixed(3)),
      isComfortable: Math.abs(this.tIn - this.setpoint) <= 1.0,
    };
  }

  reset(newTemp = 22.0) {
    this.tIn = newTemp;
    this.totalKwh = 0;
  }
}
