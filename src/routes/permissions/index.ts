import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, validateSignature } from '@/middleware/auth';
import Joi from 'joi';

export class PermissionRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/permissions',
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/permissions')
    );

    router.post('/permissions',
      requireAuth,
      validateSignature,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().optional(),
          resource: Joi.string().required(),
          actions: Joi.array().items(Joi.string()).required(),
          conditions: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/permissions')
    );

    router.get('/permissions/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/permissions/:id')
    );

    router.put('/permissions/:id',
      requireAuth,
      validateSignature,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          description: Joi.string().optional(),
          resource: Joi.string().optional(),
          actions: Joi.array().items(Joi.string()).optional(),
          conditions: Joi.any().optional(),
        })
      }),
      this.forwardRequest('PUT', '/permissions/:id')
    );

    router.delete('/permissions/:id',
      requireAuth,
      validateSignature,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/permissions/:id')
    );

    router.get('/user-permissions',
      requireAuth,
      validateRequest({
        query: Joi.object({
          userId: Joi.string().optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/user-permissions')
    );

    router.post('/user-permissions',
      requireAuth,
      validateSignature,
      validateRequest({
        body: Joi.object({
          userId: Joi.string().required(),
          permissionId: Joi.string().required(),
          expiresAt: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/user-permissions')
    );

    router.delete('/user-permissions/:userId/:permissionId',
      requireAuth,
      validateSignature,
      validateRequest({
        params: Joi.object({
          userId: Joi.string().required(),
          permissionId: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/user-permissions/:userId/:permissionId')
    );

    router.get('/role-permissions',
      requireAuth,
      validateRequest({
        query: Joi.object({
          roleId: Joi.string().optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/role-permissions')
    );

    router.post('/role-permissions',
      requireAuth,
      validateSignature,
      validateRequest({
        body: Joi.object({
          roleId: Joi.string().required(),
          permissionId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/role-permissions')
    );

    router.delete('/role-permissions/:roleId/:permissionId',
      requireAuth,
      validateSignature,
      validateRequest({
        params: Joi.object({
          roleId: Joi.string().required(),
          permissionId: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/role-permissions/:roleId/:permissionId')
    );

    return router;
  }
}
