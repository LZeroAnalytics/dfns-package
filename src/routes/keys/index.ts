import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class KeyRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          scheme: Joi.string().required(),
          curve: Joi.string().required(),
          name: Joi.string().optional(),
          externalId: Joi.string().optional(),
          tags: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('POST', '/keys')
    );

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/keys')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id')
    );

    router.put('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/keys/:id')
    );

    router.delete('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/keys/:id')
    );

    router.post('/:id/delegate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          userId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/delegate')
    );

    router.post('/:id/signatures',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          kind: Joi.string().valid('Hash', 'Message', 'Transaction', 'Psbt').required(),
          hash: Joi.string().optional(),
          message: Joi.string().optional(),
          transaction: Joi.any().optional(),
          psbt: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/signatures')
    );

    router.get('/:id/signatures',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id/signatures')
    );

    router.get('/:id/signatures/:sigId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          sigId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id/signatures/:sigId')
    );

    return router;
  }
}
