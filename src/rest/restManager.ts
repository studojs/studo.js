import { Client, randomInstallationId } from '../client';
import {
  applicationId,
  appVersionCode,
  appVersionDate,
  appVersionName,
  architecture,
  deviceName,
  language,
  os,
  osVersion,
  userAgent,
} from '../config';
import { BlockingFullscreenDialogResponse } from './schema/blockingFullscreenDialog';
import { GetLatestResponse } from './schema/getLatest';
import { CountryPrefix } from './schema/shared';
import { UnisClientFetchResponse } from './schema/unisClientFetch';

export class RestManager {
  static readonly baseURL = 'https://api.studo.co/api/v1';
  /**
   * Overrides the baseURL if specified and prevents sending the custom user-agent
   */
  static proxyURL: string | undefined;

  constructor(public client: Client) {}

  async getLatest(): Promise<GetLatestResponse> {
    const response = await RestManager.request(
      'GET',
      'settings/getLatest',
      {},
      this.client.sessionToken
    );
    return response.json();
  }

  /**
   * Fetches all unis or only the one's inside `uniIds` if specified.
   * @param uniIds Optional uni ids
   */
  async fetchUnis(...uniIds: string[]): Promise<UnisClientFetchResponse> {
    const body = JSON.stringify({
      debug: 'false',
      operatingSystem: os,
      appVersionCode,
      appVersionName,
      osVersion,
      deviceName,
      appStarts: '0',
      language,
      proStatus: 'false',
      installationId: this.client.installationId,
      architecture,
      userId: 'NO_USER_ID',
      uniIds,
      source: 'get-full-uni-descriptors-pre-fetch',
    });

    const endpoint = `unis/client/fetch${uniIds.length ? 'Partial' : ''}` as const;
    const response = await RestManager.request('POST', endpoint, { body });
    return response.json();
  }

  static async signOut(sessionId: string): Promise<string> {
    const body = JSON.stringify({ sessionClientId: sessionId });
    const response = await RestManager.request(
      'POST',
      'auth/sessions/signOut',
      { body },
      sessionId
    );
    return await response.text();
  }

  static async fetchCountries(): Promise<CountryPrefix[]> {
    const body = JSON.stringify({
      id: 'APP',
      version: appVersionDate,
      installationId: randomInstallationId(),
      deviceName,
    });
    const response = await RestManager.request('POST', 'settings/blockingFullscreenDialogOk', {
      body,
    });
    const json: BlockingFullscreenDialogResponse = await response.json();
    return json.countryPrefixes;
  }

  /**
   * Sends an http request to https://api.studo.co/api/v1/{endpoint}
   */
  static async request(
    method: string,
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<Response> {
    options.method = method;
    options.headers ??= {};

    // Proxy is usually used in a browser (which doesn't allow a custom UA header)
    if (!RestManager.proxyURL) {
      Object.assign(options.headers, {
        'User-Agent': userAgent,
        'application-id': applicationId,
      });
    }
    if (token) {
      Object.assign(options.headers, { 'session-token': token });
    }

    const url = RestManager.proxyURL ?? RestManager.baseURL;
    const response = await fetch(`${url}/${endpoint}`, options);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response;
  }
}
