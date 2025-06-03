import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import Joi from 'joi';

export class PublicKeysRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      requireAuth,
      validateRequest({
        body: Joi.object({
          curve: Joi.string().required(),
          scheme: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/public-keys')
    );

    router.get('/',
      requireAuth,
      this.forwardRequest('GET', '/public-keys')
    );

    router.get('/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/public-keys/:id')
    );

    router.post('/:id/signatures',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          message: Joi.string().required(),
          format: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/public-keys/:id/signatures')
    );

    router.get('/:id/signatures/:signatureId',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          signatureId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/public-keys/:id/signatures/:signatureId')
    );

    router.post('/:id/transactions',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          to: Joi.string().required(),
          value: Joi.string().required(),
          data: Joi.string().optional(),
          gasLimit: Joi.string().optional(),
          gasPrice: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/public-keys/:id/transactions')
    );

    router.get('/:id/transactions/:transactionId',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          transactionId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/public-keys/:id/transactions/:transactionId')
    );

    router.get('/:id/addresses/:network',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          network: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/public-keys/:id/addresses/:network')
    );

    return router;
  }
}
