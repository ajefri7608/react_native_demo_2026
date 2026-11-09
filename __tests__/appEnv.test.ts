import { appEnvironment, baseUrlFor, resolveAppEnv } from '../src/shared/config/env';

describe('app environment', () => {
  it('accepts the four names and treats a blank value as development', () => {
    expect(resolveAppEnv('')).toBe('development');
    expect(resolveAppEnv('development')).toBe('development');
    expect(resolveAppEnv('sit')).toBe('sit');
    expect(resolveAppEnv('uat')).toBe('uat');
    expect(resolveAppEnv('production')).toBe('production');
  });

  it('rejects an unknown name', () => {
    expect(() => resolveAppEnv('qa')).toThrow('Unknown environment');
  });

  it('points development at the local API and the others at a fixed origin', () => {
    expect(baseUrlFor('development', '192.168.1.20')).toBe(
      'http://192.168.1.20:8080',
    );
    expect(baseUrlFor('sit', 'localhost')).toBe('https://sit.example.com');
    expect(baseUrlFor('uat', 'localhost')).toBe('https://uat.example.com');
    expect(baseUrlFor('production', 'localhost')).toBe('https://api.example.com');
  });

  it('uses the name written in activeEnv.ts', () => {
    expect(appEnvironment.name).toBe('development');
  });
});
