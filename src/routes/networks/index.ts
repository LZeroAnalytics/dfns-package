import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { extractCredentials, requireAuth } from '@/middleware/auth';
import { getNetworkFees } from '../../implementations/networks/fees';
import { readContract } from '../../implementations/networks/read-contract';
import Joi from 'joi';

export class NetworkRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/fees',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          network: Joi.string().required(),
        })
      }),
      getNetworkFees
    );

    router.post('/read-contract',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          network: Joi.string().required(),
          contract: Joi.string().required(),
          kind: Joi.string().required(),
          data: Joi.string().required(),
        })
      }),
      readContract
    );

    router.post('/:network/validators',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          network: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          kind: Joi.string().required(),
          url: Joi.string().optional(),
          oauth2: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/networks/:network/validators')
    );

    router.get('/:network/validators',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          network: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/networks/:network/validators')
    );

    return router;
  }
}
