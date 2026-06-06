/**
 * Authentication feature types
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  rfidUID: string | null;
  floorPermissions: number;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
