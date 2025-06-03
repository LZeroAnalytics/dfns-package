import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class PermissionRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/permissions')
    );

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          operations: Joi.array().items(Joi.string()).required(),
        })
      }),
      this.forwardRequest('POST', '/permissions')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/permissions/:id')
    );

    router.put('/:id',
      extractCredentials,
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          operations: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('PUT', '/permissions/:id')
    );

    router.put('/:id/archive',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          isArchived: Joi.boolean().required(),
        })
      }),
      this.forwardRequest('PUT', '/permissions/:id/archive')
    );

    router.post('/:id/assignments',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          identityId: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/permissions/:id/assignments')
    );

    router.delete('/:id/assignments/:assignmentId',
      extractCredentials,
      requireAuth,
      extractCredentials,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          assignmentId: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/permissions/:id/assignments/:assignmentId')
    );

    router.get('/:id/assignments',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/permissions/:id/assignments')
    );

    return router;
  }
}
