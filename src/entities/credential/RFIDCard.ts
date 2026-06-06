/**
 * RFID credential entities
 */

import { RFIDCard } from './types';

export class RFIDCardEntity {
  id: number;
  userId: number;
  cardUID: string;
  sectorKey: string;
  cardToken: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;

  constructor(data: RFIDCard) {
    this.id = data.id;
    this.userId = data.userId;
    this.cardUID = data.cardUID;
    this.sectorKey = data.sectorKey;
    this.cardToken = data.cardToken;
    this.isActive = data.isActive;
    this.createdAt = new Date(data.createdAt);
    this.lastUsedAt = data.lastUsedAt ? new Date(data.lastUsedAt) : undefined;
  }

  canBeUsed(): boolean {
    return this.isActive;
  }

  toPlainObject() {
    return {
      id: this.id,
      userId: this.userId,
      cardUID: this.cardUID,
      sectorKey: this.sectorKey,
      cardToken: this.cardToken,
      isActive: this.isActive,
      createdAt: this.createdAt,
      lastUsedAt: this.lastUsedAt,
    };
  }
}
