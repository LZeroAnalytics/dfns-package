import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class AuthRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/delegated/registration', 
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/delegated/registration')
    );

    router.post('/delegated/registration/restart',
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/delegated/registration/restart')
    );

    router.post('/delegated/login',
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/delegated/login')
    );

    router.post('/login/init',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/login/init')
    );

    router.post('/login/code',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/login/code')
    );

    router.post('/login',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          challengeIdentifier: Joi.string().required(),
          firstFactor: Joi.any().optional(),
          secondFactor: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/login')
    );

    router.post('/login/social',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          idToken: Joi.string().required(),
          socialLoginProviderKind: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/login/social')
    );

    router.put('/logout',
      extractCredentials,
      this.forwardRequest('PUT', '/auth/logout')
    );

    router.post('/action/init',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          userActionPayload: Joi.string().required(),
          userActionHttpMethod: Joi.string().required(),
          userActionHttpPath: Joi.string().required(),
          userActionServerKind: Joi.string().default('Api'),
        })
      }),
      this.forwardRequest('POST', '/auth/action/init')
    );

    router.post('/action/sign',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          challengeIdentifier: Joi.string().required(),
          firstFactor: Joi.any().optional(),
          secondFactor: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/action/sign')
    );

    router.get('/service-accounts',
      requireAuth,
      this.forwardRequest('GET', '/auth/service-accounts')
    );

    router.post('/service-accounts',
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          publicKey: Joi.string().required(),
          permissions: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/service-accounts')
    );

    router.get('/service-accounts/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/service-accounts/:id')
    );

    router.put('/service-accounts/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          permissions: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/service-accounts/:id')
    );

    router.post('/service-accounts/:id/activate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/service-accounts/:id/activate')
    );

    router.post('/service-accounts/:id/deactivate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/service-accounts/:id/deactivate')
    );

    router.delete('/service-accounts/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/service-accounts/:id')
    );

    router.get('/users',
      requireAuth,
      this.forwardRequest('GET', '/auth/users')
    );

    router.post('/users',
      requireAuth,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/users')
    );

    router.get('/users/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/users/:id')
    );

    router.put('/users/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          username: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/users/:id')
    );

    router.post('/users/:id/activate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/users/:id/activate')
    );

    router.post('/users/:id/deactivate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/users/:id/deactivate')
    );

    router.delete('/users/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/users/:id')
    );

    router.get('/applications',
      requireAuth,
      this.forwardRequest('GET', '/auth/applications')
    );

    router.post('/applications',
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          reliedParty: Joi.object({
            name: Joi.string().required(),
            origins: Joi.array().items(Joi.string()).required(),
          }).required(),
        })
      }),
      this.forwardRequest('POST', '/auth/applications')
    );

    router.get('/applications/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/applications/:id')
    );

    router.put('/applications/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          reliedParty: Joi.object({
            name: Joi.string().optional(),
            origins: Joi.array().items(Joi.string()).optional(),
          }).optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/applications/:id')
    );

    router.post('/applications/:id/activate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/applications/:id/activate')
    );

    router.post('/applications/:id/deactivate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/applications/:id/deactivate')
    );

    router.delete('/applications/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/applications/:id')
    );

    router.get('/personal-access-tokens',
      requireAuth,
      this.forwardRequest('GET', '/auth/personal-access-tokens')
    );

    router.post('/personal-access-tokens',
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          permissions: Joi.array().items(Joi.string()).required(),
        })
      }),
      this.forwardRequest('POST', '/auth/personal-access-tokens')
    );

    router.get('/personal-access-tokens/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/personal-access-tokens/:id')
    );

    router.put('/personal-access-tokens/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          permissions: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/personal-access-tokens/:id')
    );

    router.delete('/personal-access-tokens/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/personal-access-tokens/:id')
    );

    router.get('/credentials',
      requireAuth,
      this.forwardRequest('GET', '/auth/credentials')
    );

    router.post('/credentials',
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          kind: Joi.string().required(),
          publicKey: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials')
    );

    router.get('/credentials/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/credentials/:id')
    );

    router.put('/credentials/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/credentials/:id')
    );

    router.post('/credentials/:id/activate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/:id/activate')
    );

    router.post('/credentials/:id/deactivate',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/:id/deactivate')
    );

    router.delete('/credentials/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/credentials/:id')
    );

    router.get('/recovery',
      requireAuth,
      this.forwardRequest('GET', '/auth/recovery')
    );

    router.post('/recovery',
      requireAuth,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/recovery')
    );

    router.get('/recovery/:id',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/recovery/:id')
    );

    router.post('/recovery/:id/approve',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/recovery/:id/approve')
    );

    router.post('/recovery/:id/reject',
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/recovery/:id/reject')
    );

    return router;
  }
}
