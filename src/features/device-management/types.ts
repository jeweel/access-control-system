/**
 * Device management feature types
 */

export interface DeviceMonitorState {
  devices: MonitoredDevice[];
  relayStates: RelayStatus[];
  diagnostics: SystemDiagnostics | null;
  isHeartbeating: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export interface MonitoredDevice {
  id: string;
  type: 'esp01' | 'arduino';
  name: string;
  status: 'online' | 'offline';
  uptime: number;
  memoryUsed: number;
  memoryTotal: number;
  lastPing: Date;
}

export interface RelayStatus {
  channel: number;
  name: string;
  isActive: boolean;
  lastToggled: Date;
}

export interface SystemDiagnostics {
  uptime: number;
  errorCount: number;
  memoryUsage: {
    esp: { heapUsed: number; heapTotal: number };
  };
  communicationLatency: number;
}
