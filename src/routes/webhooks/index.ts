import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class WebhookRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          url: Joi.string().uri().required(),
          status: Joi.string().valid('Enabled', 'Disabled').optional(),
          events: Joi.any().required(),
          description: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/webhooks')
    );

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/webhooks')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/webhooks/:id')
    );

    router.put('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          url: Joi.string().uri().optional(),
          status: Joi.string().valid('Enabled', 'Disabled').optional(),
          events: Joi.any().optional(),
          description: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/webhooks/:id')
    );

    router.delete('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/webhooks/:id')
    );

    router.post('/:id/ping',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/webhooks/:id/ping')
    );

    router.get('/:id/events/:eventId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          eventId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/webhooks/:id/events/:eventId')
    );

    router.get('/:id/events',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(20),
          paginationToken: Joi.string().optional(),
          deliveryFailed: Joi.boolean().optional(),
        })
      }),
      this.forwardRequest('GET', '/webhooks/:id/events')
    );

    return router;
  }
}
