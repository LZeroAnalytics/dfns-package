import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class PolicyEngineRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
          status: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/v2/policies')
    );

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          activityKind: Joi.string().optional(),
          rule: Joi.any().required(),
          action: Joi.any().required(),
          filters: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/v2/policies')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/v2/policies/:id')
    );

    router.put('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().required(),
          activityKind: Joi.string().optional(),
          rule: Joi.any().optional(),
          action: Joi.any().optional(),
          filters: Joi.any().optional(),
        })
      }),
      this.forwardRequest('PUT', '/v2/policies/:id')
    );

    router.delete('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/v2/policies/:id')
    );

    return router;
  }
}
