export interface DigitalTwinHouse {
  id: string;
  version: string;
  timestamp: string;
  note: string;
  houseSizeSqFt: number;
  occupants: number;
  homeType: 'single_family' | 'apartment' | 'townhouse' | 'condo';
  appliances: string[];
  solarCapacityKw: number;
  batteryCapacityKwh: number;
  evCharger: boolean;
  heatPump: boolean;
  estAnnualEmissionsKg: number;
  estMonthlySavingsUSD: number;
}

export interface DigitalTwinDorm {
  id: string;
  version: string;
  timestamp: string;
  note: string;
  housingType: 'dorm_single' | 'dorm_shared' | 'hostel_suite' | 'off_campus_apt';
  roomSizeSqFt: number;
  roommates: number;
  appliances: string[];
  hasMiniFridge: boolean;
  hasGamingPc: boolean;
  hasAC: boolean;
  estMonthlyKwh: number;
  estMonthlyCarbonKg: number;
}

export interface ForecastDataPoint {
  day: number;
  date: string;
  baselineKw: number;
  actualOrForecastKw: number;
  confidenceLower: number;
  confidenceUpper: number;
  carbonGco2e: number;
  isAnomaly?: boolean;
  anomalyTitle?: string;
  anomalyReason?: string;
  recommendedAction?: string;
}

export interface OptimizationAction {
  id: string;
  title: string;
  category: 'HVAC' | 'Solar/Battery' | 'EV Charging' | 'Behavioral' | 'Appliance';
  rank: number;
  description: string;
  carbonDeltaKg: number;
  costDeltaUSD: number;
  ecoPointsBonus: number;
  easeScore: number;
  status: 'recommended' | 'applied' | 'dismissed';
}

export interface GeofencedChallenge {
  id: string;
  title: string;
  zone: string;
  zoneLatLong: { lat: number; lng: number };
  participantsCount: number;
  daysRemaining: number;
  targetKwhSavings: number;
  progressPercentage: number;
  joined: boolean;
  description: string;
  rewardPoints: number;
  badgeName: string;
  scope: 'neighborhood' | 'campus' | 'class';
}

export interface LinkedDevice {
  id: string;
  name: string;
  type: 'smart_meter' | 'solar_inverter' | 'ev_charger' | 'heat_pump' | 'thermostat' | 'smart_plug';
  location: string;
  status: 'online' | 'eco_mode' | 'standby' | 'offline';
  currentPowerWatts: number;
  dailyKwh: number;
  healthPercent: number;
  lastSync: string;
}

export interface ActivityHistoryItem {
  id: string;
  timestamp: string;
  category: 'Energy' | 'Optimization' | 'Device' | 'Challenge' | 'Reward' | 'Academic';
  title: string;
  details: string;
  kwhDelta?: number;
  carbonDeltaKg?: number;
  pointsDelta?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'Transit' | 'Hardware' | 'Community' | 'Campus' | 'Dining' | 'Print';
  pointsCost: number;
  valueDescription: string;
  claimed: boolean;
  code?: string;
  imageIcon: string;
  isCampusExclusive?: boolean;
}

export interface AcademicProject {
  id: string;
  title: string;
  studentName: string;
  studentEmail: string;
  department: string;
  facultyMentor: string;
  repoUrl: string;
  abstract: string;
  impactMetric: string;
  status: 'in_review' | 'approved' | 'featured';
  createdAt: string;
  submittedDate?: string;
  peerEndorsementsCount?: number;
}

export interface UserGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
  color?: string;
  icon?: string;
}

export interface UserReport {
  id: string;
  title: string;
  period: string;
  date: string;
  kwhUsed: number;
  carbonOffsetKg: number;
  savingsUSD: number;
  downloadUrl?: string;
}

export interface CommunityData {
  leaderboard: Array<{ id: string; name: string; points: number; rank: number; avatarUrl?: string }>;
  forumThreads: Array<{ id: string; title: string; author: string; repliesCount: number; lastActive: string }>;
  events: Array<{ id: string; title: string; date: string; location: string; participants: number }>;
}

// In-memory or localStorage dynamic stores
