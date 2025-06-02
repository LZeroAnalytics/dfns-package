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
          name: Joi.string().required(),
          network: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/fee-sponsors')
    );

    router.get('/',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
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

    router.post('/:id/activate',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/fee-sponsors/:id/activate')
    );

    router.post('/:id/deactivate',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/fee-sponsors/:id/deactivate')
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

    router.get('/:id/sponsored-fees',
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
      this.forwardRequest('GET', '/fee-sponsors/:id/sponsored-fees')
    );

    return router;
  }
}
