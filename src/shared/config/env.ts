import { activeEnvName } from './activeEnv';

export type AppEnvironmentName = 'development' | 'sit' | 'uat' | 'production';

type LocalApi = {
  kind: 'local';
  port: number;
};

type FixedApi = {
  kind: 'fixed';
  baseUrl: string;
};

export type AppEnvironment = {
  name: AppEnvironmentName;
  label: string;
  api: LocalApi | FixedApi;
};

export const environments: Record<AppEnvironmentName, AppEnvironment> = {
  development: {
    name: 'development',
    label: '開發',
    api: { kind: 'local', port: 8080 },
  },
  sit: {
    name: 'sit',
    label: 'SIT',
    api: { kind: 'fixed', baseUrl: 'https://sit.example.com' },
  },
  uat: {
    name: 'uat',
    label: 'UAT',
    api: { kind: 'fixed', baseUrl: 'https://uat.example.com' },
  },
  production: {
    name: 'production',
    label: '正式',
    api: { kind: 'fixed', baseUrl: 'https://api.example.com' },
  },
};

export function resolveAppEnv(raw: string): AppEnvironmentName {
  const name = raw.trim();
  if (name === '' || name === 'development') {
    return 'development';
  }
  if (name === 'sit' || name === 'uat' || name === 'production') {
    return name;
  }
  throw new Error(
    `Unknown environment "${raw}". Use development, sit, uat, or production.`,
  );
}

export function baseUrlFor(name: AppEnvironmentName, localHost: string): string {
  const api = environments[name].api;
  if (api.kind === 'fixed') {
    return api.baseUrl;
  }
  return `http://${localHost}:${api.port}`;
}

export const appEnvironment = environments[resolveAppEnv(activeEnvName)];
