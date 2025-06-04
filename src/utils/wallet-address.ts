import { DfnsCredentials } from '../services/dfns-client';
import { DfnsApiHelper } from './dfns-api';

export async function getWalletAddress(credentials: DfnsCredentials, walletId: string): Promise<string> {
  const response = await DfnsApiHelper.callDfnsApi(credentials, 'GET', `/wallets/${walletId}`);
  return response.data.address;
}
