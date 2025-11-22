/** @format */

import type {AxiosError} from 'axios';

interface ErrorDetail {
  field?: string;
  message?: string;
  type?: string;
}

interface ApiErrorResponse {
  message?: string | ErrorDetail[];
  error?: string;
  errors?: ErrorDetail[];
  statusCode?: number;
  status?: string;
}

/**
 * Extract detailed error message from error object
 * Handles various error formats: string, array, object, axios error
 */
export function getDetailedErrorMessage(
  error: unknown,
  fallbackMessage: string = 'Terjadi kesalahan'
): string {
  if (!error) {
    return fallbackMessage;
  }

  // Handle axios error
  if (typeof error === 'object' && 'response' in error && error.response) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;

    // Check for error message in different formats
    if (responseData?.message) {
      if (typeof responseData.message === 'string') {
        return responseData.message;
      } else if (Array.isArray(responseData.message)) {
        // Handle array of error details
        const messages = responseData.message
          .map((err: ErrorDetail | string) => {
            if (typeof err === 'string') {
              return err;
            }
            if (typeof err === 'object' && err !== null) {
              const detail = err as ErrorDetail;
              if (detail.field && detail.message) {
                return `${detail.field}: ${detail.message}`;
              }
              if (detail.message) {
                return detail.message;
              }
            }
            return String(err);
          })
          .filter((msg): msg is string => !!msg);

        if (messages.length > 0) {
          return messages.join(', ');
        }
      }
    }

    // Check for error field
    if (responseData?.error) {
      return String(responseData.error);
    }

    // Check for errors array
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const messages = responseData.errors
        .map((err: ErrorDetail) => {
          if (err.field && err.message) {
            return `${err.field}: ${err.message}`;
          }
          if (err.message) {
            return err.message;
          }
          return String(err);
        })
        .filter((msg): msg is string => !!msg);

      if (messages.length > 0) {
        return messages.join(', ');
      }
    }

    // If no specific message, return status info
    if (status && statusText) {
      return `${status}: ${statusText}`;
    }

    // Try to get message from error object itself
    if ('message' in axiosError && typeof axiosError.message === 'string') {
      return axiosError.message;
    }
  }

  // Handle standard Error object
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // Handle string error
  if (typeof error === 'string') {
    return error;
  }

  // Handle object with message property
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  // Fallback: try to stringify
  try {
    const errorStr = JSON.stringify(error);
    if (errorStr !== '{}' && errorStr !== 'null') {
      return errorStr;
    }
  } catch {
    // Ignore JSON stringify errors
  }

  return fallbackMessage;
}

/**
 * Extract all error messages from error object
 * Returns array of error messages
 */
export function getAllErrorMessages(
  error: unknown,
  fallbackMessage: string = 'Terjadi kesalahan'
): string[] {
  if (!error) {
    return [fallbackMessage];
  }

  // Handle axios error
  if (typeof error === 'object' && 'response' in error && error.response) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;
    const messages: string[] = [];

    // Check for error message in different formats
    if (responseData?.message) {
      if (typeof responseData.message === 'string') {
        messages.push(responseData.message);
      } else if (Array.isArray(responseData.message)) {
        responseData.message.forEach((err: ErrorDetail | string) => {
          if (typeof err === 'string') {
            messages.push(err);
          } else if (typeof err === 'object' && err !== null) {
            const detail = err as ErrorDetail;
            if (detail.field && detail.message) {
              messages.push(`${detail.field}: ${detail.message}`);
            } else if (detail.message) {
              messages.push(detail.message);
            }
          }
        });
      }
    }

    // Check for error field
    if (responseData?.error) {
      messages.push(String(responseData.error));
    }

    // Check for errors array
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      responseData.errors.forEach((err: ErrorDetail) => {
        if (err.field && err.message) {
          messages.push(`${err.field}: ${err.message}`);
        } else if (err.message) {
          messages.push(err.message);
        }
      });
    }

    if (messages.length > 0) {
      return messages;
    }

    // If no specific message, return status info
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    if (status && statusText) {
      return [`${status}: ${statusText}`];
    }

    // Try to get message from error object itself
    if ('message' in axiosError && typeof axiosError.message === 'string') {
      return [axiosError.message];
    }
  }

  // Handle standard Error object
  if (error instanceof Error) {
    return [error.message || fallbackMessage];
  }

  // Handle string error
  if (typeof error === 'string') {
    return [error];
  }

  // Handle object with message property
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return [error.message];
  }

  return [fallbackMessage];
}

/**
 * Log error to console with detailed information
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '[Error]';
  console.error(`${prefix} Error details:`, error);

  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    console.error(`${prefix} Status:`, axiosError.response?.status);
    console.error(`${prefix} Status Text:`, axiosError.response?.statusText);
    console.error(`${prefix} Response Data:`, axiosError.response?.data);
    console.error(`${prefix} Request URL:`, axiosError.config?.url);
    console.error(`${prefix} Request Method:`, axiosError.config?.method);
  }
}
