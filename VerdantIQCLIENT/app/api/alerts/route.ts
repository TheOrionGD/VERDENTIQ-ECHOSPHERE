import { NextRequest, NextResponse } from 'next/server';

export interface AlertEvent {
  id: string;
  timestamp: string;
  department: string;
  building: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  metricValue?: string;
  sensorId?: string;
}

const DEPARTMENTS = [
  'Facilities & Energy',
  'Engineering',
  'Science & Labs',
  'Dormitories & Housing',
  'Administrative',
  'Library & IT',
  'Student Hub',
];

const BUILDINGS = [
  'Building A',
  'Building B',
  'Science Center',
  'Dorm Block C',
  'Library Tower',
  'Utility Plant',
  'Student Hub',
];

const SEVERITIES: Array<'low' | 'medium' | 'high' | 'critical'> = [
  'low',
  'medium',
  'high',
  'critical',
];

const ALERT_TYPES = [
  { type: 'Thermal Load Spike', desc: 'Sudden temperature jump exceeding 4.2°C/min' },
  { type: 'HVAC Pressure Drop', desc: 'Refrigerant pressure dropped below safety threshold' },
  { type: 'Sensor Calibration Slip', desc: 'KS-test feature drift detected in telemetry' },
  { type: 'Power Surge Anomaly', desc: 'Phase 3 power draw spiked +28% above baseline' },
  { type: 'Airflow Stagnation', desc: 'Duct damper motor fault causing airflow reduction' },
  { type: 'CO2 Threshold Breach', desc: 'Indoor air quality CO2 level exceeded 1,100 ppm' },
  { type: 'Chiller Delta-T Fault', desc: 'Chilled water supply/return differential narrowed' },
];

// Pseudo-random deterministic generator based on seed to ensure consistent realistic alert dataset
function generateMockAlerts(): AlertEvent[] {
  const alerts: AlertEvent[] = [];
  const now = new Date('2026-08-03T06:00:00Z');
  let idCounter = 1000;

  // Generate 280 alert records spread over the past 45 days
  for (let dayOffset = 0; dayOffset < 45; dayOffset++) {
    const alertDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);

    // Give certain building/department combos higher density to simulate real hotspot clusters
    // e.g. Utility Plant + Facilities & Energy, Science Center + Science & Labs, Dorm Block C + Dormitories
    const dailyCount = 4 + ((dayOffset * 7 + 13) % 9);

    for (let i = 0; i < dailyCount; i++) {
      idCounter++;
      const randSeed = (dayOffset * 31 + i * 17) % 100;

      // Department selection (weighted)
      let deptIndex = Math.floor((randSeed * 7) / 100);
      if (randSeed > 80) deptIndex = 0; // Facilities & Energy
      if (randSeed > 65 && randSeed <= 80) deptIndex = 2; // Science & Labs
      const department = DEPARTMENTS[deptIndex % DEPARTMENTS.length];

      // Building selection (weighted by hotspot affinity)
      let bldIndex = Math.floor((randSeed * 11) / 100);
      if (department === 'Facilities & Energy') bldIndex = 5; // Utility Plant
      if (department === 'Science & Labs') bldIndex = 2; // Science Center
      if (department === 'Dormitories & Housing') bldIndex = 3; // Dorm Block C
      const building = BUILDINGS[bldIndex % BUILDINGS.length];

      // Severity (weighted)
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      if (randSeed < 30) severity = 'low';
      else if (randSeed < 65) severity = 'medium';
      else if (randSeed < 88) severity = 'high';
      else severity = 'critical';

      const typeObj = ALERT_TYPES[(i + dayOffset) % ALERT_TYPES.length];
      const hoursOffset = (i * 3 + dayOffset * 2) % 24;
      const minsOffset = (i * 13) % 60;
      const timestamp = new Date(alertDate.getTime() + (hoursOffset * 3600 + minsOffset * 60) * 1000).toISOString();

      alerts.push({
        id: `ALT-${idCounter}`,
        timestamp,
        department,
        building,
        severity,
        type: typeObj.type,
        description: typeObj.desc,
        sensorId: `SENS-${building.substring(0, 3).toUpperCase()}-${100 + (i % 20)}`,
        metricValue: `${(18 + (randSeed % 15) + (severity === 'critical' ? 12 : 0)).toFixed(1)} unit`,
      });
    }
  }

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const cachedAlerts = generateMockAlerts();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get('department');
  const building = searchParams.get('building');
  const severity = searchParams.get('severity');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filtered = [...cachedAlerts];

  if (department && department !== 'ALL') {
    filtered = filtered.filter((a) => a.department.toLowerCase() === department.toLowerCase());
  }

  if (building && building !== 'ALL') {
    filtered = filtered.filter((a) => a.building.toLowerCase() === building.toLowerCase());
  }

  if (severity && severity !== 'ALL') {
    filtered = filtered.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
  }

  if (startDate) {
    const startMs = new Date(startDate).getTime();
    if (!isNaN(startMs)) {
      filtered = filtered.filter((a) => new Date(a.timestamp).getTime() >= startMs);
    }
  }

  if (endDate) {
    const endMs = new Date(endDate).getTime();
    if (!isNaN(endMs)) {
      filtered = filtered.filter((a) => new Date(a.timestamp).getTime() <= endMs);
    }
  }

  return NextResponse.json({
    total: filtered.length,
    alerts: filtered,
    metadata: {
      generatedAt: new Date().toISOString(),
      availableDepartments: DEPARTMENTS,
      availableBuildings: BUILDINGS,
      availableSeverities: SEVERITIES,
    },
  });
}
