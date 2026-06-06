/**
 * Device entity for hardware representation
 */

import { Device, RelayState } from '@/shared/types';

export class DeviceEntity {
  id: string;
  type: 'esp01' | 'arduino';
  status: 'online' | 'offline';
  uptime: number;
  memoryUsed: number;
  memoryTotal: number;
  lastPing: Date;

  constructor(data: Device) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.uptime = data.uptime;
    this.memoryUsed = data.memoryUsed;
    this.memoryTotal = data.memoryTotal;
    this.lastPing = new Date(data.lastPing);
  }

  isOnline(): boolean {
    return this.status === 'online';
  }

  getMemoryUsagePercent(): number {
    return (this.memoryUsed / this.memoryTotal) * 100;
  }

  toPlainObject() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      uptime: this.uptime,
      memoryUsed: this.memoryUsed,
      memoryTotal: this.memoryTotal,
      lastPing: this.lastPing,
    };
  }
}

export class RelayEntity {
  channel: number;
  isActive: boolean;
  lastToggledAt: Date;
  toggleCount: number;

  constructor(data: RelayState) {
    this.channel = data.channel;
    this.isActive = data.isActive;
    this.lastToggledAt = new Date(data.lastToggledAt);
    this.toggleCount = data.toggleCount;
  }

  toPlainObject() {
    return {
      channel: this.channel,
      isActive: this.isActive,
      lastToggledAt: this.lastToggledAt,
      toggleCount: this.toggleCount,
    };
  }
}
