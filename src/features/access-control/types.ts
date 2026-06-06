/**
 * Access control feature types
 */

export interface AccessDashboardState {
  userRelays: RelayControl[];
  loading: boolean;
  error: string | null;
  lastAccessResult?: AccessFeedback;
}

export interface RelayControl {
  channel: number;
  name: string;
  isActive: boolean;
  isAuthorized: boolean;
  isToggling: boolean;
}

export interface AccessFeedback {
  granted: boolean;
  channel: number;
  message: string;
  timestamp: Date;
  failureReason?: string;
}

export interface AccessStatus {
  granted: boolean;
  userId?: number;
  channel: number;
  timestamp: Date;
}
