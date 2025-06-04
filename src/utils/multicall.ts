import { JsonRpcProvider, Contract, Interface } from 'ethers';
import { NetworkConfig, networks } from '../config';
import ERC20_ABI from './abis/ERC20.json';
import MULTICALL_ABI from './abis/Multicall2.json';

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

export interface AssetBalance {
  type: 'native' | 'erc20';
  contract: string | null;
  symbol: string;
  decimals: number;
  balance: string;
}

export interface MulticallResult {
  success: boolean;
  returnData: string;
}

export class MulticallService {
  private provider: JsonRpcProvider;
  private multicallContract: Contract;
  private erc20Interface: Interface;
  private networkConfig: NetworkConfig;

  constructor(networkKey: string) {
    this.networkConfig = networks[networkKey];
    if (!this.networkConfig) {
      throw new Error(`Unsupported network: ${networkKey}`);
    }

    this.provider = new JsonRpcProvider(this.networkConfig.rpcUrl);
    this.multicallContract = new Contract(
      this.networkConfig.multicallAddress,
      MULTICALL_ABI,
      this.provider
    );
    this.erc20Interface = new Interface(ERC20_ABI);
  }

  async getNativeBalance(walletAddress: string): Promise<AssetBalance> {
    const balance = await this.provider.getBalance(walletAddress);
    return {
      type: 'native',
      contract: null,
      symbol: this.networkConfig.nativeSymbol,
      decimals: 18,
      balance: balance.toString(),
    };
  }

  async getERC20Balances(
    walletAddress: string,
    tokens: TokenInfo[]
  ): Promise<AssetBalance[]> {
    if (tokens.length === 0) {
      return [];
    }

    const calls = tokens.map(token => ({
      target: token.address,
      callData: this.erc20Interface.encodeFunctionData('balanceOf', [walletAddress]),
    }));

    try {
      const [, returnData] = await this.multicallContract.aggregate(calls);
      const assets: AssetBalance[] = [];

      returnData.forEach((raw: string, i: number) => {
        try {
          const [balance] = this.erc20Interface.decodeFunctionResult('balanceOf', raw);
          if (balance > 0n) {
            const token = tokens[i];
            assets.push({
              type: 'erc20',
              contract: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              balance: balance.toString(),
            });
          }
        } catch (error) {
          console.warn(`Failed to decode balance for token ${tokens[i].address}:`, error);
        }
      });

      return assets;
    } catch (error) {
      console.error('Multicall failed:', error);
      return [];
    }
  }

  async getAllBalances(
    walletAddress: string,
    tokens: TokenInfo[]
  ): Promise<AssetBalance[]> {
    const [nativeBalance, erc20Balances] = await Promise.all([
      this.getNativeBalance(walletAddress),
      this.getERC20Balances(walletAddress, tokens),
    ]);

    return [nativeBalance, ...erc20Balances];
  }

  async tryMulticall(calls: Array<{ target: string; callData: string }>): Promise<MulticallResult[]> {
    try {
      const results = await this.multicallContract.tryAggregate(false, calls);
      return results.map((result: any) => ({
        success: result.success,
        returnData: result.returnData,
      }));
    } catch (error) {
      console.error('TryMulticall failed:', error);
      return calls.map(() => ({ success: false, returnData: '0x' }));
    }
  }

  getProvider(): JsonRpcProvider {
    return this.provider;
  }

  getNetworkConfig(): NetworkConfig {
    return this.networkConfig;
  }
}

export function createMulticallService(networkKey: string): MulticallService {
  return new MulticallService(networkKey);
}
