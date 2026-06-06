/**
 * Access control and verification types
 */

export type AccessMethod = 'RFID' | 'APP';
export type AccessResult = 'GRANTED' | 'DENIED';
export type FailureReason =
  | 'INVALID_UID'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'CARD_NOT_FOUND'
  | 'EXPIRED_TOKEN'
  | 'SECTOR_KEY_MISMATCH'
  | 'USER_DISABLED'
  | 'DEVICE_ERROR';

export interface AccessRequest {
  userId?: number;
  rfidUID?: string;
  floorTarget: number;
  relayChannel: number;
  method: AccessMethod;
  timestamp: Date;
  ipAddress?: string;
}

export interface AccessResult {
  granted: boolean;
  userId?: number;
  floorTarget: number;
  relayChannel: number;
  reason?: FailureReason;
  method: AccessMethod;
  timestamp: Date;
  sectorKeyUsed?: string;
  tokenValidated?: boolean;
}

export interface VerificationResponse {
  valid: boolean;
  sectorKey: string;
  randomToken: string;
  tokenExpiration: number;
  userPermissions: number;
}

export interface TokenChallenge {
  cardUID: string;
  sectorKey: string;
  challengeToken: string;
  expiresAt: number;
}

export interface RelayToggleRequest {
  relayChannel: number;
  state: 'on' | 'off';
}

export interface RelayState {
  channel: number;
  isActive: boolean;
  lastToggledAt: Date;
  toggledBy: {
    userId: number;
    method: AccessMethod;
  };
}
