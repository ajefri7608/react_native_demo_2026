import axios, { type AxiosRequestConfig } from 'axios';
import { apiBaseUrl } from './baseUrl';
import { ApiError, toApiError } from './httpError';
import { accessToken } from './token';

export const http = axios.create({
  timeout: 10000,
});

export async function request<T>(
  config: AxiosRequestConfig,
  options?: { auth?: boolean },
): Promise<T> {
  const token = options?.auth ? accessToken() : null;
  if (options?.auth && !token) {
    throw new ApiError(401, '尚未登入');
  }
  try {
    const response = await http.request<T>({
      ...config,
      baseURL: apiBaseUrl(),
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
