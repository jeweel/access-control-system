/**
 * User validation schema
 */

import { CreateUserPayload, UpdateUserPayload, User } from '@/shared/types';
import {
  validateEmail,
  validateName,
  validatePassword,
  validateFloorPermissions,
} from '@/shared/utils';

export class UserValidator {
  static validateCreate(data: any): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!validateName(data.name)) {
      errors.name = 'Name must be between 2 and 100 characters';
    }

    if (!validateEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.role !== 'admin' && data.role !== 'user') {
      errors.role = 'Invalid role';
    }

    if (!validateFloorPermissions(data.floorPermissions)) {
      errors.floorPermissions = 'Invalid floor permissions';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateUpdate(data: any): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (data.name !== undefined && !validateName(data.name)) {
      errors.name = 'Name must be between 2 and 100 characters';
    }

    if (data.email !== undefined && !validateEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.role !== undefined && data.role !== 'admin' && data.role !== 'user') {
      errors.role = 'Invalid role';
    }

    if (data.floorPermissions !== undefined && !validateFloorPermissions(data.floorPermissions)) {
      errors.floorPermissions = 'Invalid floor permissions';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    return validatePassword(password);
  }
}
