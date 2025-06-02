import 'module-alias/register';
import { DfnsApiServer } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const server = new DfnsApiServer();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

server.start(config.port as number);
