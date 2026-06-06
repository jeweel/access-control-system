/**
 * Logging feature types
 */

export interface LogViewerState {
  logs: LogViewItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: LogViewFilters;
}

export interface LogViewItem {
  id: number;
  timestamp: Date;
  userName?: string;
  accessMethod: 'RFID' | 'APP';
  floor: number;
  result: 'GRANTED' | 'DENIED';
  failureReason?: string;
}

export interface LogViewFilters {
  userId?: number;
  floor?: number;
  result?: 'GRANTED' | 'DENIED';
  method?: 'RFID' | 'APP';
  startDate?: Date;
  endDate?: Date;
}

export interface LogAnalyticsState {
  statistics: LogStatisticsData | null;
  loading: boolean;
  error: string | null;
}

export interface LogStatisticsData {
  totalAccess: number;
  grantedCount: number;
  deniedCount: number;
  grantRate: number;
  peakHour: number;
  totalUsers: number;
}
