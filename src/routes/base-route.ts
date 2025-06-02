import { Request, Response, NextFunction } from 'express';
import { DfnsClient, DfnsCredentials } from '@/services/dfns-client';
import { CustomLogicHooks } from '@/types/common';
import { logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/middleware/auth';

export abstract class BaseRoute {
  protected hooks: CustomLogicHooks;

  constructor(hooks: CustomLogicHooks = {}) {
    this.hooks = hooks;
  }

  protected createDfnsClient(credentials: DfnsCredentials): DfnsClient {
    return new DfnsClient(credentials);
  }

  protected async executeWithHooks(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
    dfnsOperation: () => Promise<any>
  ): Promise<void> {
    try {
      if (this.hooks.preProcess) {
        await this.hooks.preProcess(req, res, next);
      }

      const dfnsResponse = await dfnsOperation();

      let finalResponse = dfnsResponse;
      if (this.hooks.postProcess) {
        finalResponse = await this.hooks.postProcess(dfnsResponse, req, res);
      }

      res.json(finalResponse);
    } catch (error) {
      logger.error('Route execution failed', { error, path: req.url });

      if (this.hooks.onError) {
        await this.hooks.onError(error, req, res);
      }

      next(error);
    }
  }

  protected forwardRequest(method: string, path: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      await this.executeWithHooks(req, res, next, async () => {
        if (!req.dfnsCredentials) {
          throw new Error('DFNS credentials not found in request');
        }

        const dfnsClient = this.createDfnsClient(req.dfnsCredentials);
        const headers: Record<string, string> = {};
        
        Object.entries(req.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headers[key] = value;
          }
        });
        
        return dfnsClient.request(method, path, req.body, headers);
      });
    };
  }
}
