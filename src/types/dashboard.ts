// src/types/dashboard.ts

export interface DashboardRecord {
  id: string;
  name: string;
  layout: any[];
  widgets: Record<string, string>; // Maps tile ID to Widget Type string (e.g., 'tile-0': 'ledger')
}
