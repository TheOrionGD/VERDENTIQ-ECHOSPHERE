export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  status: 'completed' | 'pending' | 'flagged';
  details: string;
}
