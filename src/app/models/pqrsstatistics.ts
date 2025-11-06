import { EmployeeStats } from "./employee-stats";
import { MonthlyTrend } from "./monthly-trend";

export interface PQRSStatistics {
    totalPqrs: number;
  openPqrs: number;
  closedPqrs: number;
  inProgressPqrs: number;
  pqrsByStatus: { [key: string]: number };
  pqrsByType: { [key: string]: number };
  pqrsByCategory: { [key: string]: number };
  averageDaysToResolve: number;
  minDaysToResolve: number;
  maxDaysToResolve: number;
  expiredPqrs: number;
  nearExpirationPqrs: number;
  averageDaysFromExpiration: number;
  topEmployees: EmployeeStats[];
  monthlyTrends: MonthlyTrend[];
  resolutionRate: number;
  satisfactionRate: number;
}
