import dotenv from 'dotenv';

dotenv.config();

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
};
