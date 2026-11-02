import {NativeModules, Platform} from 'react-native';

/**
 * URL pública da API (APK enviado aos avaliadores).
 * Depois do deploy, atualize este endereço.
 */
export const PRODUCTION_API_URL =
  'https://cadastro-plus-api.onrender.com/api';

type LocalApiConfig = {
  host?: string;
  port?: number;
  baseUrl?: string;
};

let localConfig: LocalApiConfig = {};
try {
  localConfig = require('./api.local.json');
} catch {
  localConfig = {};
}

function resolveDevBaseUrl() {
  if (localConfig.baseUrl) {
    return localConfig.baseUrl.replace(/\/$/, '');
  }

  if (localConfig.host) {
    const port = localConfig.port ?? 3333;
    return `http://${localConfig.host}:${port}/api`;
  }

  const scriptURL: string | undefined =
    NativeModules?.SourceCode?.scriptURL ?? undefined;
  if (scriptURL) {
    const match = scriptURL.match(/https?:\/\/([^/:]+)(?::\d+)?/);
    const metroHost = match?.[1];
    if (
      metroHost &&
      metroHost !== 'localhost' &&
      metroHost !== '127.0.0.1' &&
      metroHost !== '10.0.2.2'
    ) {
      return `http://${metroHost}:3333/api`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://127.0.0.1:3333/api';
  }

  return 'http://localhost:3333/api';
}

export const API_BASE_URL = __DEV__
  ? resolveDevBaseUrl()
  : PRODUCTION_API_URL;
