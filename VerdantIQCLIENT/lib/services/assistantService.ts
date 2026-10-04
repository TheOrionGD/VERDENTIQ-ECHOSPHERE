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

export async function queryOmnibar(query: string, role: string = 'user'): Promise<OmnibarQueryResponse> {
  try {
    const res = await fetch('/api/v1/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, role }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback for dev mode
  }
  return {
    query,
    intent: 'MILP & LLM Omnibar Synthesis',
    summary: `Analysis generated for: "${query}".`,
    recommendedActions: [],
    dataMetrics: [
      { label: 'Est. Daily Savings', value: '$0.00 / day', delta: '0%' },
      { label: 'Carbon Avoidance', value: '0.0 kgCO2e', delta: '0%' },
      { label: 'System Efficiency', value: '0.0%', delta: '0%' }
    ]
  };
}

export function getInitialChat(): OmnibarQueryResponse[] {
  return [];
}
