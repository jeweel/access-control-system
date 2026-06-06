/**
 * Validation utilities for forms and data
 */

export const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RFIDUIDRegex = /^[A-Fa-f0-9]{8,}$/; // Hex string, at least 8 chars
export const PasswordMinLength = 8;

export function validateEmail(email: string): boolean {
  return EmailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < PasswordMinLength) {
    errors.push(`Password must be at least ${PasswordMinLength} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateRFIDUID(uid: string): boolean {
  return RFIDUIDRegex.test(uid);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateFloorPermissions(permissions: number): boolean {
  // Must be a valid 8-bit bitmask (0-255)
  return Number.isInteger(permissions) && permissions >= 0 && permissions <= 255;
}

export function validateRelayChannel(channel: number): boolean {
  // Valid channels are 0-7
  return Number.isInteger(channel) && channel >= 0 && channel <= 7;
}
