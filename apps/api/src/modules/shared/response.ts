import type { ApiError, ApiSuccess } from '@mediklinik/types';

export function ok<T>(data: T, message?: string): ApiSuccess<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function fail(message: string, errors?: Array<Record<string, unknown>>): ApiError {
  return {
    success: false,
    message,
    errors,
  };
}
