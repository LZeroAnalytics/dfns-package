import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class WebhookRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      requireAuth,
      extractCredentials,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          url: Joi.string().uri().required(),
          events: Joi.array().items(Joi.string()).required(),
          secret: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/webhooks')
    );

    router.get('/',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/webhooks')
    );

    router.get('/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/webhooks/:id')
    );

    router.put('/:id',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          url: Joi.string().uri().optional(),
          events: Joi.array().items(Joi.string()).optional(),
          secret: Joi.string().optional(),
          isActive: Joi.boolean().optional(),
        })
      }),
      this.forwardRequest('PUT', '/webhooks/:id')
    );

    router.delete('/:id',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/webhooks/:id')
    );

    router.post('/:id/test',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/webhooks/:id/test')
    );

    return router;
  }
}
