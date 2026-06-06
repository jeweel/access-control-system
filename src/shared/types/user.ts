/**
 * User-related types for the access control system
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  rfidUID: string | null;
  passwordHash: string;
  floorPermissions: number; // 8-bit bitmask for relay channels 0-7
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessAt?: Date;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {
  authorizedFloors: number[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  floorPermissions: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  floorPermissions?: number;
  isActive?: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface JWTToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: JWTToken;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Permission {
  id: number;
  userId: number;
  floorId: number;
  relayChannel: number;
  grantedAt: Date;
}

export interface ACLEntry {
  userId: number;
  relayMask: number; // 8-bit bitmask
}
