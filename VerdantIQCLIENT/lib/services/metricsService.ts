export interface SustainabilityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  changePercentage: number;
  category: 'carbon' | 'energy' | 'water' | 'waste' | 'compliance';
  status: 'optimal' | 'warning' | 'critical';
}

export interface SpatialNode {
  id: string;
  label: string;
  type: 'building' | 'solar' | 'substation' | 'sensor' | 'hvac';
  coordinates: { x: number; y: number; lat: number; lng: number };
  status: 'active' | 'warning' | 'maintenance' | 'offline';
  co2eKgHr: number;
  energyKw: number;
  lastUpdated: string;
}
