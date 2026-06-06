/**
 * Permission and ACL entities
 */

import { Permission, ACLEntry } from './types';

export class PermissionEntity {
  id: number;
  userId: number;
  floorId: number;
  relayChannel: number;
  grantedAt: Date;

  constructor(data: Permission) {
    this.id = data.id;
    this.userId = data.userId;
    this.floorId = data.floorId;
    this.relayChannel = data.relayChannel;
    this.grantedAt = new Date(data.grantedAt);
  }

  toPlainObject() {
    return {
      id: this.id,
      userId: this.userId,
      floorId: this.floorId,
      relayChannel: this.relayChannel,
      grantedAt: this.grantedAt,
    };
  }
}

export class ACLManager {
  private entries: Map<number, number> = new Map();

  addEntry(userId: number, relayMask: number): void {
    this.entries.set(userId, relayMask);
  }

  removeEntry(userId: number): void {
    this.entries.delete(userId);
  }

  hasAccess(userId: number, relayChannel: number): boolean {
    const mask = this.entries.get(userId);
    if (!mask) return false;
    return (mask & (1 << relayChannel)) !== 0;
  }

  getPermissions(userId: number): number {
    return this.entries.get(userId) || 0;
  }

  getAllEntries(): ACLEntry[] {
    return Array.from(this.entries.entries()).map(([userId, relayMask]) => ({
      userId,
      relayMask,
    }));
  }
}
