import { Request, Response, NextFunction } from 'express';
import { DfnsClient, DfnsCredentials } from '@/services/dfns-client';
import { CustomLogicHooks } from '@/types/common';
import { logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/middleware/auth';

export abstract class BaseRoute {
  protected hooks: CustomLogicHooks;

  private static readonly FORWARD_WHITELIST = new Set([
    'accept',
    'content-type',
    'authorization',
    'x-dfns-appid',
    'x-dfns-nonce',
    'x-dfns-signature',
    'x-dfns-signingkey',
    'x-dfns-useraction',
    'x-dfns-appsecret',
    'x-dfns-apisignature',
  ]);


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
          const k = key.toLowerCase();
          if (typeof value === 'string' && BaseRoute.FORWARD_WHITELIST.has(k)) {
            headers[k] = value;
          }
        });

        const bodyToSend =
          ['post', 'put', 'patch', 'delete'].includes(method.toLowerCase()) ? req.body : undefined;

        const { data } = await dfnsClient.request(method, path, bodyToSend, headers);
        return data;
      });
    };
  }
}
