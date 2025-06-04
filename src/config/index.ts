import dotenv from 'dotenv';

dotenv.config();

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  multicallAddress: string;
  nativeSymbol: string;
  coingeckoId: string;
}

export const networks: Record<string, NetworkConfig> = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://f0b70526ae1c46a4a12ac06471283104-rpc.network.bloctopus.io',
    multicallAddress: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    nativeSymbol: 'ETH',
    coingeckoId: 'ethereum',
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    multicallAddress: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
    nativeSymbol: 'ETH',
    coingeckoId: 'arbitrum-one',
  },
  base: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'ETH',
    coingeckoId: 'base',
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'AVAX',
    coingeckoId: 'avalanche',
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'BNB',
    coingeckoId: 'binance-smart-chain',
  },
  fantom: {
    name: 'Fantom Opera',
    chainId: 250,
    rpcUrl: process.env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'FTM',
    coingeckoId: 'fantom',
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'ETH',
    coingeckoId: 'optimistic-ethereum',
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    nativeSymbol: 'MATIC',
    coingeckoId: 'polygon-pos',
  },
};

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  dfns: {
    apiUrl: process.env.DFNS_API_URL || 'https://api.dfns.io',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  network: {
    name: process.env.NETWORK_NAME || 'Ethereum',
    rpcUrl: process.env.NETWORK_RPC_URL || '',
  },

  networks,
};
