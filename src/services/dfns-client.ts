import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@/config';
import { CryptoService } from './crypto';
import { DfnsRequestHeaders, DfnsResponse } from '@/types/common';
import { AuthenticationError, DfnsApiError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export interface DfnsCredentials {
  appId: string;
  authToken?: string;
  signingKeyId?: string;
  privateKey?: string;
  baseUrl?: string;
}

export class DfnsClient {
  private client: AxiosInstance;
  private privateKey?: string;
  private appId: string;
  private signingKeyId?: string;
  private authToken?: string;

  constructor(credentials: DfnsCredentials) {
    this.privateKey = credentials.privateKey;
    this.appId = credentials.appId;
    this.signingKeyId = credentials.signingKeyId;
    this.authToken = credentials.authToken;

    this.client = axios.create({
      baseURL: credentials.baseUrl || config.dfns.apiUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'dfns-package/1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        logger.info('DFNS API Request', {
          method: config.method,
          url: config.url,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        logger.error('DFNS API Request Error', { error });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info('DFNS API Response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        logger.error('DFNS API Response Error', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): DfnsApiError {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error || 'API request failed';
      const code = data?.code || 'API_ERROR';

      if (status === 401) {
        return new AuthenticationError(message, data);
      }

      return new DfnsApiError(message, status, code, data);
    }

    return new DfnsApiError('Network error or timeout', 500, 'NETWORK_ERROR', error.message);
  }

  private createSignedHeaders(
    method: string,
    path: string,
    body?: any,
    additionalHeaders?: Record<string, string>
  ): DfnsRequestHeaders {
    const headers: DfnsRequestHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'dfns-package/1.0.0',
      'X-DFNS-APPID': this.appId,
      ...additionalHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (this.privateKey && this.signingKeyId) {
      const timestamp = CryptoService.generateTimestamp();
      const nonce = CryptoService.generateNonce();
      const canonicalRequest = CryptoService.createCanonicalRequest(method, path, timestamp, body);
      const signature = CryptoService.signRequest(canonicalRequest, this.privateKey);

      headers['X-DFNS-NONCE'] = nonce;
      headers['X-DFNS-SIGNINGKEY'] = this.signingKeyId;
      headers['X-DFNS-SIGNATURE'] = signature;
    }

    return headers;
  }

  async request<T = any>(
    method: string,
    path: string,
    body?: any,
    additionalHeaders: Record<string, string> = {},
  ): Promise<DfnsResponse<T>> {
    try {
      // Clone the forwarded headers
      const headers: Record<string, string> = { ...additionalHeaders };

      // Only add Content‑Type when we actually send a body
      if (body !== undefined && body !== null) {
        headers['Content-Type'] = 'application/json';
      }

      const requestConfig: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: path,
        headers,
        ...(body && { data: body }),
      };

      const response: AxiosResponse<T> = await this.client.request(requestConfig);
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      logger.error('DFNS Client request failed', { method, path, error });
      throw error;
    }
  }

  async get<T = any>(path: string, additionalHeaders?: Record<string, string>): Promise<DfnsResponse<T>> {
    return this.request<T>('GET', path, undefined, additionalHeaders);
  }

  async post<T = any>(path: string, body?: any, additionalHeaders?: Record<string, string>): Promise<DfnsResponse<T>> {
    return this.request<T>('POST', path, body, additionalHeaders);
  }

  async put<T = any>(path: string, body?: any, additionalHeaders?: Record<string, string>): Promise<DfnsResponse<T>> {
    return this.request<T>('PUT', path, body, additionalHeaders);
  }

  async delete<T = any>(path: string, additionalHeaders?: Record<string, string>): Promise<DfnsResponse<T>> {
    return this.request<T>('DELETE', path, undefined, additionalHeaders);
  }
}
