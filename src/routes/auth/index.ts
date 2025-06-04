import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class AuthRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();


    // Registration
    router.post('/registration/init',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          registrationCode: Joi.string().required(),
          orgId: Joi.string().required(),
        }),
      }),
      this.forwardRequest('POST', '/auth/registration/init'),
    );

    router.post('/registration',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          firstFactorCredential: Joi.any().required(),
          secondFactorCredential: Joi.any().optional(),
          recoveryCredential: Joi.any().optional(),
        }),
      }),
      this.forwardRequest('POST', '/auth/registration'),
    );

    router.post('/registration/enduser',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          firstFactorCredential: Joi.any().required(),
          secondFactorCredential: Joi.any().optional(),
          recoveryCredential: Joi.any().optional(),
          wallets: Joi.any().optional(),
        }),
      }),
      this.forwardRequest('POST', '/auth/registration/enduser'),
    );

    router.post('/registration/delegated',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          email: Joi.string().required(),
          kind: Joi.string().valid('EndUser', 'CustomerEmployee', 'DfnsStaff').required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/registration/delegated')
    );

    router.post('registration/delegated/restart',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          email: Joi.string().required(),
          kind: Joi.string().valid('EndUser', 'CustomerEmployee', 'DfnsStaff').required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/delegated/registration/restart')
    );

    router.put('/registration/code',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        }),
      }),
      this.forwardRequest('PUT', '/auth/registration/code'),
    );

    router.post('/registration/social',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          idToken: Joi.string().required(),
          socialLoginProviderKind: Joi.string().required(),
        }),
      }),
      this.forwardRequest('POST', '/auth/registration/social'),
    );

    router.post('/login/delegated',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/delegated/login')
    );

    router.post('/login/init',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().optional(),
          orgId: Joi.string().required(),
          loginCode: Joi.string().optional(),
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
          firstFactor: Joi.any().required(),
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

    router.post('/action',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          challengeIdentifier: Joi.string().required(),
          firstFactor: Joi.any().required(),
          secondFactor: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/action')
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
      extractCredentials,
      requireAuth,
      this.forwardRequest('GET', '/auth/service-accounts')
    );

    router.post('/service-accounts',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          publicKey: Joi.string().required(),
          daysValid: Joi.number().optional(),
          permissionId: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/service-accounts')
    );

    router.get('/service-accounts/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/service-accounts/:id')
    );

    router.put('/service-accounts/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/service-accounts/:id')
    );

    router.put('/service-accounts/:id/activate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/service-accounts/:id/activate')
    );

    router.put('/service-accounts/:id/deactivate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/service-accounts/:id/deactivate')
    );

    router.delete('/service-accounts/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/service-accounts/:id')
    );

    router.get('/users',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/auth/users')
    );

    router.post('/users',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          externalId: Joi.string().optional(),
          email: Joi.string().required(),
          kind: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/users')
    );

    router.get('/users/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/users/:id')
    );

    router.put('/users/:id',
      extractCredentials,
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

    router.put('/users/:id/activate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/users/:id/activate')
    );

    router.put('/users/:id/deactivate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/users/:id/deactivate')
    );

    router.delete('/users/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/users/:id')
    );

    router.get('/apps',
      extractCredentials,
      requireAuth,
      this.forwardRequest('GET', '/auth/apps')
    );

    router.post('/apps',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          relyingPartyId: Joi.string().required(),
          origin: Joi.string().required(),
          kind: Joi.string().required(),
          permissionId: Joi.string().optional(),
          externalId: Joi.string().optional(),
          publicKey: Joi.string().optional(),
          daysValid: Joi.number().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/apps')
    );

    router.get('/apps/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/apps/:id')
    );

    router.put('/apps/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('PUT', '/auth/apps/:id')
    );

    router.put('/apps/:id/activate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/apps/:id/activate')
    );

    router.post('/apps/:id/deactivate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/apps/:id/deactivate')
    );

    router.delete('/apps/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/apps/:id')
    );

    router.get('/pats',
      extractCredentials,
      requireAuth,
      this.forwardRequest('GET', '/auth/pats')
    );

    router.post('/pats',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().required(),
          publicKey: Joi.string().required(),
          secondsValid: Joi.number().optional(),
          daysValid: Joi.number().optional(),
          permissionId: Joi.string().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/pats')
    );

    router.get('/pats/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/auth/pats/:id')
    );

    router.put('/pats/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          name: Joi.string().optional(),
          externalId: Joi.string().optional()
        })
      }),
      this.forwardRequest('PUT', '/auth/pats/:id')
    );

    router.put('/pats/:id/activate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/pats/:id/activate')
    );

    router.put('/pats/:id/deactivate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/pats/:id/deactivate')
    );

    router.delete('/pats/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/auth/pats/:id')
    );

    router.post('/credentials/code',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          expiration: Joi.any().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/code')
    );

    router.post('/credentials/init',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          kind: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/init')
    );

    router.post('/credentials/code/init',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          code: Joi.string().required(),
          credentialKind: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/code/init')
    );

    router.post('/credentials',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          challengeIdentifier: Joi.string().required(),
          credentialName: Joi.string().required(),
          credentialKind: Joi.string().required(),
          credentialInfo: Joi.any().required(),
          encryptedPrivateKey: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials')
    );

    router.post('/credentials/code/verify',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          challengeIdentifier: Joi.string().required(),
          credentialName: Joi.string().required(),
          credentialKind: Joi.string().required(),
          credentialInfo: Joi.any().required(),
          encryptedPrivateKey: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/credentials/code/verify')
    );

    router.put('/credentials/deactivate',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          credentialUuid: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/credentials/deactivate')
    );

    router.put('/credentials/activate',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          credentialUuid: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/credentials/activate')
    );

    router.get('/credentials',
      extractCredentials,
      requireAuth,
      this.forwardRequest('GET', '/auth/credentials')
    );

    router.put('/recover/user/code',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          orgId: Joi.string().required(),
        })
      }),
      this.forwardRequest('PUT', '/auth/recovery')
    );

    router.post('/recover/user/init',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          verificationCode: Joi.string().required(),
          orgId: Joi.string().required(),
          credentialId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/recover/user/init')
    );

    router.post('/recover/user/delegated',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          username: Joi.string().required(),
          credentialId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/auth/recover/user/delegated')
    );

    router.post('/recover/user',
      extractCredentials,
      validateRequest({
        body: Joi.object({
          recovery: Joi.any().required(),
          newCredentials: Joi.any().required(),
          recoveryCredential: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/auth/recover/user')
    );

    return router;
  }
}
