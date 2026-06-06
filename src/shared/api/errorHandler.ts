/**
 * Error handling and standardization
 */

import { ApiError } from '../types';

export class ErrorHandler {
  static formatError(error: any): ApiError {
    if (error.response) {
      // API error response
      return {
        code: error.response.data?.code || 'API_ERROR',
        message: error.response.data?.message || 'API request failed',
        statusCode: error.response.status,
        details: error.response.data?.details,
        timestamp: new Date(),
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout',
        statusCode: 408,
        timestamp: new Date(),
      };
    }

    if (error.message === 'Network Error') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        statusCode: 0,
        timestamp: new Date(),
      };
    }

    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.status || 500,
      timestamp: new Date(),
    };
  }

  static isAuthError(error: ApiError): boolean {
    return error.statusCode === 401 || error.code === 'UNAUTHORIZED';
  }

  static isValidationError(error: ApiError): boolean {
    return error.statusCode === 422 || error.code === 'VALIDATION_ERROR';
  }

  static isNotFoundError(error: ApiError): boolean {
    return error.statusCode === 404 || error.code === 'NOT_FOUND';
  }

  static isServerError(error: ApiError): boolean {
    return error.statusCode >= 500;
  }

  static getErrorMessage(error: ApiError): string {
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Please check your input and try again',
      NOT_FOUND: 'The requested resource was not found',
      UNAUTHORIZED: 'Your session has expired. Please log in again',
      TIMEOUT_ERROR: 'The request took too long. Please try again',
      NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection',
    };

    return messages[error.code] || error.message || 'An error occurred';
  }
}

export function handleApiError(error: any): never {
  const apiError = ErrorHandler.formatError(error);
  throw apiError;
}
