/**
 * Formatting utilities for display and output
 */

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(' ') : 'Just now';
}

export function formatPercentage(value: number, decimals = 0): string {
  return (value * 100).toFixed(decimals) + '%';
}

export function formatFloorName(floorNumber: number): string {
  const names: Record<number, string> = {
    0: 'Ground Floor',
    1: 'First Floor',
    2: 'Second Floor',
    3: 'Third Floor',
    4: 'Fourth Floor',
    5: 'Fifth Floor',
    6: 'Sixth Floor',
    7: 'Seventh Floor',
  };
  return names[floorNumber] || `Floor ${floorNumber}`;
}

export function formatRelayName(channelNumber: number): string {
  return `Relay ${channelNumber + 1}`;
}

export function formatUserRole(role: string): string {
  const roles: Record<string, string> = {
    admin: 'Administrator',
    user: 'User',
  };
  return roles[role] || role;
}

export function formatAccessStatus(status: string): string {
  return status === 'GRANTED' ? '✓ Granted' : '✗ Denied';
}

export function formatAccessMethod(method: string): string {
  const methods: Record<string, string> = {
    RFID: 'RFID Card',
    APP: 'Mobile App',
  };
  return methods[method] || method;
}
