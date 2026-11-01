import { request } from './client';
import type { LoginResult } from './types';

export function loginRequest(body: {
  username: string;
  password: string;
}): Promise<LoginResult> {
  return request<LoginResult>({
    method: 'POST',
    url: '/api/v1/auth/login',
    data: body,
  });
}
