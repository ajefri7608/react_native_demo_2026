import axios from 'axios';
import { apiBaseUrl } from './baseUrl';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (!axios.isAxiosError(error)) {
    return new ApiError(0, '請求失敗');
  }
  if (!error.response) {
    return new ApiError(0, `連不到 ${apiBaseUrl()}`);
  }
  const status = error.response.status;
  const data = error.response.data;
  if (data && typeof data === 'object') {
    if ('errors' in data && Array.isArray(data.errors)) {
      const lines = data.errors.filter(
        (line: unknown): line is string => typeof line === 'string',
      );
      if (lines.length > 0) {
        return new ApiError(status, lines.join('\n'));
      }
    }
    if ('message' in data && typeof data.message === 'string') {
      return new ApiError(status, data.message);
    }
  }
  return new ApiError(status, `請求失敗 (${status})`);
}
