import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class KeyRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          scheme: Joi.string().valid('DH', 'ECDSA', 'EdDSA', 'Schnorr').required(),
          curve: Joi.string().valid('ed25519', 'secp256k1', 'stark').required(),
          name: Joi.string().optional(),
          delegateTo: Joi.string().optional(),
          delayDelegation: Joi.boolean().optional(),
        })
      }),
      this.forwardRequest('POST', '/keys')
    );

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          owner: Joi.string().optional(),
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/keys')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id')
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
        })
      }),
      this.forwardRequest('PUT', '/keys/:id')
    );

    router.delete('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/keys/:id')
    );

    router.post('/:id/delegate',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          userId: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/delegate')
    );

    router.post('/:id/signatures',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          kind: Joi.string().valid('Hash', 'Message', 'Eip7702', 'Transaction', 'Eip712', 'Psbt', 'Bip322', 'SignDocDirect', 'SignerPayload').required(),
          hash: Joi.string().optional(),
          taprootMerkleRoot: Joi.string().optional(),
          network: Joi.string().optional(),
          blockchainKind: Joi.string().optional(),
          nonce: Joi.number().optional(),
          chainId: Joi.number().optional(),
          message: Joi.any().optional(),
          transaction: Joi.string().optional(),
          types: Joi.any().optional(),
          domain: Joi.any().optional(),
          psbt: Joi.string().optional(),
          externalId: Joi.string().optional(),
          format: Joi.string().optional(),
          signDoc: Joi.string().optional(),
          payload: Joi.string().optional(),
          address: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/signatures')
    );

    router.get('/:id/signatures',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id/signatures')
    );

    router.get('/:id/signatures/:sigId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          sigId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/keys/:id/signatures/:sigId')
    );

    router.get('/import',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          name: Joi.string().optional(),
          curve: Joi.string().valid('ed25519', 'secp256k1', 'stark').required(),
          protocol: Joi.string().valid('CGGMP21', 'FROST', 'FROST_BITCOIN').required(),
          minSigners: Joi.number().optional(),
          encryptedShares: Joi.any().required(),
        })
      }),
      this.forwardRequest('POST', '/keys/import')
    );

    router.get('/:id/export',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          encryptionKey: Joi.string().required(),
          supportedSchemes: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/export')
    );

    router.get('/:id/derive',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          domain: Joi.string().required(),
          seed: Joi.string().required(),
        })
      }),
      this.forwardRequest('POST', '/keys/:id/derive')
    );

    return router;
  }
}
