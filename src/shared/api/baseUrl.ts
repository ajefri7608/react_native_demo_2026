import { NativeModules, Platform } from 'react-native';
import { appEnvironment, baseUrlFor } from '../config/env';

type SourceCodeModule = {
  scriptURL?: string;
  getConstants?: () => { scriptURL?: string };
};

export function hostFromScriptUrl(scriptURL: string | undefined): string | null {
  if (!scriptURL) {
    return null;
  }
  const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
  return match?.[1] ?? null;
}

function readScriptUrl(): string | undefined {
  const sourceCode = NativeModules.SourceCode as SourceCodeModule | undefined;
  if (!sourceCode) {
    return undefined;
  }
  if (typeof sourceCode.scriptURL === 'string') {
    return sourceCode.scriptURL;
  }
  return sourceCode.getConstants?.().scriptURL;
}

export function apiHost(): string {
  const fromMetro = hostFromScriptUrl(readScriptUrl());
  if (fromMetro) {
    return fromMetro;
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export function apiBaseUrl(): string {
  return baseUrlFor(appEnvironment.name, apiHost());
}
