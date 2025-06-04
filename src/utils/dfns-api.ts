import { DfnsClient, DfnsCredentials } from '../services/dfns-client';
import { AuthenticatedRequest } from '../middleware/auth';

const FORWARD_WHITELIST = new Set([
  'accept',
  'content-type',
  'authorization',
  'x-dfns-appid',
  'x-dfns-nonce',
  'x-dfns-signature',
  'x-dfns-signingkey',
  'x-dfns-useraction',
  'x-dfns-appsecret',
  'x-dfns-apisignature',
]);

export function extractForwardHeaders(req: AuthenticatedRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    const k = key.toLowerCase();
    if (typeof value === 'string' && FORWARD_WHITELIST.has(k)) {
      headers[k] = value;
    }
  });
  return headers;
}

export class DfnsApiHelper {
  static async callDfnsApi(
    credentials: DfnsCredentials,
    method: string,
    path: string,
    body?: any,
    headers?: Record<string, string>
  ) {
    const client = new DfnsClient(credentials);
    return await client.request(method, path, body, headers);
  }
}
