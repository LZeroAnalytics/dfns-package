import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class PolicyEngineRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/policies',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/policies')
    );

    router.post('/policies',
      requireAuth,
      extractCredentials,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().optional(),
          rules: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            condition: Joi.any().required(),
            action: Joi.string().valid('Allow', 'Deny', 'RequireApproval').required(),
            priority: Joi.number().required(),
          })).required(),
        })
      }),
      this.forwardRequest('POST', '/policies')
    );

    router.get('/policies/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/policies/:id')
    );

    router.put('/policies/:id',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          description: Joi.string().optional(),
          isActive: Joi.boolean().optional(),
          rules: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            condition: Joi.any().required(),
            action: Joi.string().valid('Allow', 'Deny', 'RequireApproval').required(),
            priority: Joi.number().required(),
          })).optional(),
        })
      }),
      this.forwardRequest('PUT', '/policies/:id')
    );

    router.delete('/policies/:id',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/policies/:id')
    );

    router.get('/approval-requests',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
          status: Joi.string().valid('Pending', 'Approved', 'Rejected').optional(),
        })
      }),
      this.forwardRequest('GET', '/approval-requests')
    );

    router.get('/approval-requests/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/approval-requests/:id')
    );

    router.post('/approval-requests/:id/approve',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/approval-requests/:id/approve')
    );

    router.post('/approval-requests/:id/reject',
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/approval-requests/:id/reject')
    );

    return router;
  }
}
