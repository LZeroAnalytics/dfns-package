import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class PolicyApprovalRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(20),
          paginationToken: Joi.string().optional(),
          status: Joi.string().valid('Pending', 'Approved', 'Denied', 'AutoApproved', 'Expired').optional(),
          triggerStatus: Joi.string().valid('Triggered', 'Skipped').optional(),
          initiatorId: Joi.string().optional(),
          approverId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/v2/policy-approvals')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/v2/policy-approvals/:id')
    );

    router.post('/:id/decisions',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          value: Joi.string().valid('Approved', 'Denied').required(),
          reason: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/v2/policy-approvals/:id/decisions')
    );

    return router;
  }
}
