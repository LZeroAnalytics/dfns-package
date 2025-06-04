import { DfnsClient, DfnsCredentials } from '../services/dfns-client';

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
