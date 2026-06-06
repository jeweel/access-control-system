/**
 * User management feature types
 */

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
  floorPermissions: number;
}

export interface UserListState {
  users: UserListItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: UserFilters;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastAccessAt?: Date;
}

export interface UserFilters {
  search?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  floor?: number;
}

export interface UserEditState {
  userId?: number;
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
}
