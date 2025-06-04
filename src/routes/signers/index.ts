import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class SignerRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/signers')
    );

    return router;
  }
}
