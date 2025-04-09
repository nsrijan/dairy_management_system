export interface DashboardStats {
  totalCows: number;
  milkProduction: number;
  activeTasks: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'milk_collection' | 'feeding' | 'health_check';
  timestamp: string;
  description: string;
} 