import axios from 'axios';
import { networks } from '../config';

export interface TokenMetadata {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: TokenMetadata[];
}

class TokenCatalogService {
  private cache: Map<string, TokenMetadata[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getTokensForNetwork(networkKey: string): Promise<TokenMetadata[]> {
    const network = networks[networkKey];
    if (!network) {
      throw new Error(`Unsupported network: ${networkKey}`);
    }

    const cacheKey = networkKey;
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const tokens = await this.fetchTokensFromCoinGecko(network.coingeckoId);
      this.cache.set(cacheKey, tokens);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      return tokens;
    } catch (error) {
      console.error(`Failed to fetch tokens for ${networkKey}:`, error);
      return this.cache.get(cacheKey) || [];
    }
  }

  private async fetchTokensFromCoinGecko(platformId: string): Promise<TokenMetadata[]> {
    try {
      const response = await axios.get(
        `https://pro-api.coingecko.com/api/v3/token_lists/${platformId}/all.json`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.data && response.data.tokens) {
        return response.data.tokens.map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          name: token.name,
          logoURI: token.logoURI,
        }));
      }

      return [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn(`Token list not found for platform ${platformId}`);
        return this.getFallbackTokens(platformId);
      }
      throw error;
    }
  }

  private getFallbackTokens(platformId: string): TokenMetadata[] {
    const fallbackTokens: Record<string, TokenMetadata[]> = {
      ethereum: [
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
        {
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
          symbol: 'WBTC',
          decimals: 8,
          name: 'Wrapped BTC',
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      'arbitrum-one': [
        {
          address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
      base: [
        {
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
      avalanche: [
        {
          address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
      'binance-smart-chain': [
        {
          address: '0x55d398326f99059fF775485246999027B3197955',
          symbol: 'USDT',
          decimals: 18,
          name: 'Tether USD',
        },
        {
          address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          symbol: 'USDC',
          decimals: 18,
          name: 'USD Coin',
        },
      ],
      fantom: [
        {
          address: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
      'optimistic-ethereum': [
        {
          address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
      'polygon-pos': [
        {
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          symbol: 'USDT',
          decimals: 6,
          name: 'Tether USD',
        },
        {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
        },
      ],
    };

    return fallbackTokens[platformId] || [];
  }

  async getTopTokensForNetwork(networkKey: string, limit: number = 50): Promise<TokenMetadata[]> {
    const tokens = await this.getTokensForNetwork(networkKey);
    return tokens.slice(0, limit);
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  getCacheStats(): { size: number; networks: string[] } {
    return {
      size: this.cache.size,
      networks: Array.from(this.cache.keys()),
    };
  }
}

export const tokenCatalog = new TokenCatalogService();

export function getTokenCatalog(): TokenCatalogService {
  return tokenCatalog;
}
