import axios from 'axios';
import { config } from '../config';

export async function rpc(method: string, params: any[], id = 1): Promise<any> {
  const response = await axios.post(config.network.rpcUrl, {
    jsonrpc: "2.0",
    method,
    params,
    id
  });
  return response.data.result;
}
