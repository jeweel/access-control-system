/**
 * User entity definition
 */

import { User } from '@/shared/types';

export class UserEntity {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  rfidUID: string | null;
  passwordHash: string;
  floorPermissions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessAt?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.rfidUID = data.rfidUID;
    this.passwordHash = data.passwordHash;
    this.floorPermissions = data.floorPermissions;
    this.isActive = data.isActive;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.lastAccessAt = data.lastAccessAt ? new Date(data.lastAccessAt) : undefined;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  hasFloorAccess(floorNumber: number): boolean {
    if (!this.isActive) return false;
    return (this.floorPermissions & (1 << floorNumber)) !== 0;
  }

  getAuthorizedFloors(): number[] {
    const floors: number[] = [];
    for (let i = 0; i < 8; i++) {
      if (this.hasFloorAccess(i)) {
        floors.push(i);
      }
    }
    return floors;
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      rfidUID: this.rfidUID,
      floorPermissions: this.floorPermissions,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastAccessAt: this.lastAccessAt,
    };
  }
}
