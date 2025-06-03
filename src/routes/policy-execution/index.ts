import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import Joi from 'joi';

export class PolicyExecutionRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/',
      requireAuth,
      this.forwardRequest('GET', '/policy-executions')
    );

    router.get('/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/policy-executions/:id')
    );

    router.put('/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          status: Joi.string().valid('Approved', 'Denied').required(),
          reason: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/policy-executions/:id')
    );

    return router;
  }
}
