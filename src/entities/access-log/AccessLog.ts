/**
 * Access Log entity for audit trails
 */

import { LogEntry } from '@/shared/types';

export class AccessLogEntity {
  id: number;
  timestamp: Date;
  userId?: number;
  userName?: string;
  accessMethod: 'RFID' | 'APP';
  floorTarget: number;
  relayChannel: number;
  result: 'GRANTED' | 'DENIED';
  failureReason?: string;
  ipAddress?: string;
  cardUID?: string;

  constructor(data: LogEntry) {
    this.id = data.id;
    this.timestamp = new Date(data.timestamp);
    this.userId = data.userId;
    this.userName = data.userName;
    this.accessMethod = data.accessMethod;
    this.floorTarget = data.floorTarget;
    this.relayChannel = data.relayChannel;
    this.result = data.result;
    this.failureReason = data.failureReason;
    this.ipAddress = data.ipAddress;
    this.cardUID = data.cardUID;
  }

  isGranted(): boolean {
    return this.result === 'GRANTED';
  }

  toPlainObject() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      userId: this.userId,
      userName: this.userName,
      accessMethod: this.accessMethod,
      floorTarget: this.floorTarget,
      relayChannel: this.relayChannel,
      result: this.result,
      failureReason: this.failureReason,
      ipAddress: this.ipAddress,
      cardUID: this.cardUID,
    };
  }
}
