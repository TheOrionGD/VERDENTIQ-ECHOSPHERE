export interface OmnibarQueryResponse {
  query: string;
  intent: string;
  summary: string;
  recommendedActions: string[];
  dataMetrics?: Array<{ label: string; value: string; delta: string }>;
  aiEngine?: string;
  realtimeData?: {
    location: string;
    coordinates: { lat: number; lon: number };
    weather: any;
  };
  databaseContext?: {
    source: string;
    institutionsCount: number;
  };
}
