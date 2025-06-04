import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class FeeSponsorRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      requireAuth,
      extractCredentials,
      validateRequest({
        body: Joi.object({
          walletId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/fee-sponsors')
    );

    router.get('/',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/fee-sponsors')
    );

    router.get('/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/fee-sponsors/:id')
    );

    router.put('/:id/activate',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/fee-sponsors/:id/activate')
    );

    router.put('/:id/deactivate',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/fee-sponsors/:id/deactivate')
    );

    router.delete('/:id',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/fee-sponsors/:id')
    );

    router.get('/:id/fees',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/fee-sponsors/:id/fees')
    );

    return router;
  }
}
