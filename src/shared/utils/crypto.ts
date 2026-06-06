/**
 * Cryptographic utilities for client-side operations
 * Note: Sensitive crypto operations should be done on the server/ESP
 */

/**
 * Generate a random hex string of specified length
 */
export function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Convert hex string to byte array
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert byte array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Simple XOR operation for client-side token validation
 * WARNING: This is for demonstration only. Real crypto must be on server.
 */
export function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(Math.max(a.length, b.length));
  for (let i = 0; i < result.length; i++) {
    result[i] = (a[i] || 0) ^ (b[i] || 0);
  }
  return result;
}

/**
 * Hash a value using SHA256 (requires crypto module)
 * For Node.js/server-side use
 */
export async function sha256(data: string): Promise<string> {
  // This is a placeholder - actual implementation requires crypto module
  // In browser, use native SubtleCrypto API
  // In Node.js, use 'crypto' module
  throw new Error('SHA256 hashing must be implemented per environment');
}

/**
 * Verify token format (basic client-side check)
 */
export function isValidToken(token: string): boolean {
  // Token should be 32 hex characters (128 bits)
  return /^[a-f0-9]{32}$/i.test(token);
}

/**
 * Verify sector key format (basic client-side check)
 */
export function isValidSectorKey(key: string): boolean {
  // Sector key should be 12 hex characters (48 bits)
  return /^[a-f0-9]{12}$/i.test(key);
}
