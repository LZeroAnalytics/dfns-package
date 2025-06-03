import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import Joi from 'joi';

export class AssetsRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/asset-accounts',
      requireAuth,
      validateRequest({
        body: Joi.object({
          assetSymbol: Joi.string().required(),
          publicKey: Joi.string().optional(),
          groupThreshold: Joi.number().optional(),
          groupSize: Joi.number().optional(),
        })
      }),
      this.forwardRequest('POST', '/assets/asset-accounts')
    );

    router.get('/asset-accounts',
      requireAuth,
      this.forwardRequest('GET', '/assets/asset-accounts')
    );

    router.get('/asset-accounts/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/assets/asset-accounts/:id')
    );

    router.get('/asset-accounts/:id/balance',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/assets/asset-accounts/:id/balance')
    );

    router.post('/payments',
      requireAuth,
      validateRequest({
        body: Joi.object({
          assetAccountId: Joi.string().required(),
          amount: Joi.string().required(),
          to: Joi.string().required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/assets/payments')
    );

    router.get('/payments',
      requireAuth,
      this.forwardRequest('GET', '/assets/payments')
    );

    router.get('/payments/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/assets/payments/:id')
    );

    return router;
  }
}
