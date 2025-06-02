import { Request, Response, NextFunction } from 'express';
import { DfnsClient } from '@/services/dfns-client';
import { CustomLogicHooks } from '@/types/common';
import { logger } from '@/utils/logger';

export abstract class BaseRoute {
  protected dfnsClient: DfnsClient;
  protected hooks: CustomLogicHooks;

  constructor(hooks: CustomLogicHooks = {}) {
    this.dfnsClient = new DfnsClient();
    this.hooks = hooks;
  }

  protected async executeWithHooks(
    req: Request,
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
      logger.error('Route execution failed', { error, path: req.path });

      if (this.hooks.onError) {
        await this.hooks.onError(error, req, res);
      }

      next(error);
    }
  }

  protected forwardRequest(method: string, path: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.executeWithHooks(req, res, next, async () => {
        const headers: Record<string, string> = {};
        Object.entries(req.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headers[key] = value;
          }
        });
        return this.dfnsClient.request(method, path, req.body, headers);
      });
    };
  }
}
