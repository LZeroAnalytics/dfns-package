import { DfnsCredentials } from '../services/dfns-client';
import { DfnsApiHelper } from './dfns-api';

export async function getWalletAddress(
  credentials: DfnsCredentials, 
  walletId: string, 
  headers?: Record<string, string>
): Promise<string> {
  const response = await DfnsApiHelper.callDfnsApi(credentials, 'GET', `/wallets/${walletId}`, undefined, headers);
  return response.data.address;
}
