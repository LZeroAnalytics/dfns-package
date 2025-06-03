import { addAliases } from "module-alias";
if (process.env.NODE_ENV !== "production") {
  addAliases({
    "@": __dirname
  });
}
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from '@/config';
import { ApiRoutes } from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { CustomLogicHooks } from '@/types/common';

export class DfnsApiServer {
  private app: express.Application;
  private hooks: CustomLogicHooks;

  constructor(hooks: CustomLogicHooks = {}) {
    this.app = express();
    this.hooks = hooks;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors(config.cors));
    this.app.use(morgan(config.logging.format));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    this.app.use((req, res, next) => {
      logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      next();
    });
  }

  private setupRoutes(): void {
    const apiRoutes = new ApiRoutes(this.hooks);
    this.app.use('/api/v1', apiRoutes.getRouter());

    this.app.get('/', (req, res) => {
      res.json({
        name: 'DFNS API Package',
        version: '1.0.0',
        description: 'Express.js TypeScript API that mirrors DFNS API behavior',
        documentation: 'https://docs.dfns.co/d/api-docs/api-docs',
        endpoints: {
          health: '/api/v1/health',
          auth: '/api/v1/auth',
          wallets: '/api/v1/wallets',
          keys: '/api/v1/keys',
          feeSponsors: '/api/v1/fee-sponsors',
          networks: '/api/v1/networks',
          webhooks: '/api/v1/webhooks',
          policyEngine: '/api/v1/policy-engine',
          permissions: '/api/v1/permissions',
          assets: '/api/v1/assets',
          policyExecutions: '/api/v1/policy-executions',
          publicKeys: '/api/v1/public-keys',
        },
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public start(port?: number): void {
    const serverPort = port || config.port;
    
    this.app.listen(serverPort, () => {
      logger.info(`DFNS API Server started on port ${serverPort}`, {
        port: serverPort,
        environment: config.nodeEnv,
        dfnsApiUrl: config.dfns.apiUrl,
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }

  public setCustomHooks(hooks: CustomLogicHooks): void {
    this.hooks = { ...this.hooks, ...hooks };
  }
}

if (require.main === module) {
  const server = new DfnsApiServer();
  server.start();
}

export default DfnsApiServer;
