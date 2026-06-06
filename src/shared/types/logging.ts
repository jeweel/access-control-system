/**
 * Logging and audit trail types
 */

export type AccessMethod = 'RFID' | 'APP';
export type AccessStatus = 'GRANTED' | 'DENIED';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface LogEntry {
  id: number;
  timestamp: Date;
  userId?: number;
  userName?: string;
  accessMethod: AccessMethod;
  floorTarget: number;
  relayChannel: number;
  result: AccessStatus;
  failureReason?: string;
  ipAddress?: string;
  cardUID?: string;
}

export interface LogFilter {
  userId?: number;
  cardUID?: string;
  floorTarget?: number;
  result?: AccessStatus;
  method?: AccessMethod;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface LogStatistics {
  totalAccess: number;
  grantedCount: number;
  deniedCount: number;
  byFloor: Record<number, { granted: number; denied: number }>;
  byUser: Record<number, { granted: number; denied: number }>;
  byMethod: {
    rfid: { granted: number; denied: number };
    app: { granted: number; denied: number };
  };
  peakHours: Array<{ hour: number; count: number }>;
  rejectionRate: number;
  lastLoggedAt: Date;
}

export interface LogExportOptions {
  format: 'csv' | 'json';
  filters?: LogFilter;
}

export interface AccessLogSummary {
  totalAccessCount: number;
  successCount: number;
  failureCount: number;
  lastAccessAt?: Date;
  lastAccessMethod?: AccessMethod;
  accessByFloor: Record<number, number>;
}
