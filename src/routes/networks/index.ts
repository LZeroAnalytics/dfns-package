import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import Joi from 'joi';

export class NetworkRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/estimate-fees',
      requireAuth,
      validateRequest({
        body: Joi.object({
          network: Joi.string().required(),
          operation: Joi.string().required(),
          operationPayload: Joi.object().optional(),
        })
      }),
      this.forwardRequest('POST', '/networks/estimate-fees')
    );

    router.post('/read-contract',
      requireAuth,
      validateRequest({
        body: Joi.object({
          network: Joi.string().required(),
          contractAddress: Joi.string().required(),
          functionName: Joi.string().required(),
          functionArgs: Joi.array().optional(),
        })
      }),
      this.forwardRequest('POST', '/networks/read-contract')
    );

    router.get('/:network/fee-estimates',
      requireAuth,
      validateRequest({
        params: Joi.object({
          network: Joi.string().required(),
        }),
        query: Joi.object({
          to: Joi.string().optional(),
          amount: Joi.string().optional(),
          contractAddress: Joi.string().optional(),
          data: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/networks/:network/fee-estimates')
    );

    router.post('/:network/read-contract',
      requireAuth,
      validateRequest({
        params: Joi.object({
          network: Joi.string().required(),
        }),
        body: Joi.object({
          contractAddress: Joi.string().required(),
          functionName: Joi.string().required(),
          functionArgs: Joi.array().optional(),
          blockNumber: Joi.number().optional(),
        })
      }),
      this.forwardRequest('POST', '/networks/:network/read-contract')
    );

    router.get('/:network/validators',
      requireAuth,
      validateRequest({
        params: Joi.object({
          network: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/networks/:network/validators')
    );

    return router;
  }
}
