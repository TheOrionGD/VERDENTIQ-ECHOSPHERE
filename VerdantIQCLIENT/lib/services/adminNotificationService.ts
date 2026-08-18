export interface AdminSystemAlert {
  id: string;
  source: 'Spring Boot Actuator (/actuator/health)' | 'FastAPI Alert Engine' | 'K8s Cluster Autoscaler' | 'Groq LPU Gateway';
  serviceName: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  metrics?: Record<string, string>;
  acknowledged: boolean;
  runbookPath?: string;
}
