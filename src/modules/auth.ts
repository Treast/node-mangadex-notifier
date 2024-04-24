import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { stringify } from 'qs';

import { config } from './conf.js';
import Log from './log.js';

enum AuthUrl {
  CHECK = 'https://api.mangadex.org/auth/check',
  TOKEN = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token'
}

class Auth {
  private accessToken: string = '';
  private refreshedAt: number = 0;
  private refreshToken: string = '';

  public constructor() {
    this.accessToken = config.get('access_token') as string;
    this.refreshToken = config.get('refresh_token') as string;
  }

  public async checkAuth(): Promise<any> {
    await this.getAccessToken();

    const requestConfig: AxiosRequestConfig = {
      headers: this.injectAuthHeaders(),
      method: 'GET',
      url: AuthUrl.CHECK
    };

    const response = await axios(requestConfig);

    return response.data;
  }

  public async getAccessToken(): Promise<void> {
    if (!this.accessToken) {
      await this.fetchAccessToken();
      return;
    }

    const limitRefresh = this.refreshedAt + 14 * 60 * 1000;

    if (Date.now() > limitRefresh) {
      await this.refreshAccessToken();
    }
  }

  public hasValidAccessToken(): boolean {
    const limitRefresh = this.refreshedAt + 14 * 60 * 1000;

    return Boolean(this.accessToken) && Date.now() < limitRefresh;
  }

  public injectAuthHeaders(headers: object = {}): RawAxiosRequestHeaders {
    return { ...headers, Authorization: `Bearer ${this.accessToken}` };
  }

  public async fetchAccessToken(): Promise<string> {
    this.refreshedAt = Date.now();

    try {
      const response = await axios({
        data: stringify(
          this.injectClient({
            grant_type: 'password',
            password: process.env.APP_PASSWORD,
            username: process.env.APP_USERNAME
          })
        ),
        headers: this.injectHeaders(),
        method: 'POST',
        url: AuthUrl.TOKEN
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      config.set('access_token', this.accessToken);
      config.set('refresh_token', this.refreshToken);
    } catch (error) {
      Log.error(error);
    }

    return this.accessToken;
  }

  private injectClient(data: object = {}): RawAxiosRequestHeaders {
    return {
      ...data,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    };
  }

  private injectHeaders(headers: object = {}): RawAxiosRequestHeaders {
    return { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' };
  }

  private async refreshAccessToken(): Promise<void> {
    this.refreshedAt = Date.now();

    const response = await axios({
      data: stringify(
        this.injectClient({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        })
      ),
      headers: this.injectHeaders(),
      method: 'POST',
      url: AuthUrl.TOKEN
    });

    this.accessToken = response.data.access_token;

    config.set('access_token', this.accessToken);
  }
}

export default new Auth();
