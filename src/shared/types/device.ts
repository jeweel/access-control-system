/**
 * Device status and hardware types
 */

export type DeviceType = 'esp01' | 'arduino';
export type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: string;
  type: DeviceType;
  status: DeviceStatus;
  uptime: number; // seconds
  memoryUsed: number; // bytes
  memoryTotal: number; // bytes
  lastPing: Date;
}

export interface ESPDevice extends Device {
  type: 'esp01';
  wifiSignal: number; // dBm
  wifiSSID: string;
  ipAddress: string;
  freeHeap: number;
  spiffsFree: number;
  spiffsTotal: number;
}

export interface ArduinoDevice extends Device {
  type: 'arduino';
  serialPort: string;
}

export interface DeviceStatus {
  espStatus: ESPDevice;
  arduinoStatus: ArduinoDevice;
  relayStates: RelayState[];
  communicationErrors: number;
  lastSyncAt: Date;
}

export interface RelayState {
  channel: number;
  isActive: boolean;
  lastToggledAt: Date;
  toggleCount: number;
}

export interface SystemDiagnostics {
  uptime: number;
  errorCount: number;
  warningCount: number;
  lastError?: {
    code: string;
    message: string;
    timestamp: Date;
  };
  memoryUsage: {
    esp: {
      heapUsed: number;
      heapTotal: number;
      spiffsUsed: number;
      spiffsTotal: number;
    };
  };
  communicationLatency: {
    espToArduino: number; // ms
    last10Avg: number; // ms
  };
}

export interface PingResponse {
  deviceId: string;
  timestamp: Date;
  latency: number; // ms
  deviceStatus: Device;
}
