import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import Joi from 'joi';

export class WalletRoutes extends BaseRoute {
  getRouter(): Router {
    const router = Router();

    router.post('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          network: Joi.string().required(),
          name: Joi.string().optional(),
          externalId: Joi.string().optional(),
          tags: Joi.array().items(Joi.string()).optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets')
    );

    router.get('/',
      extractCredentials,
      requireAuth,
      validateRequest({
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/wallets')
    );

    router.get('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id')
    );

    router.put('/:id',
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
      this.forwardRequest('PUT', '/wallets/:id')
    );

    router.delete('/:id',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('DELETE', '/wallets/:id')
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
      this.forwardRequest('POST', '/wallets/:id/delegate')
    );

    router.get('/:id/assets',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/assets')
    );

    router.get('/:id/nfts',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/nfts')
    );

    router.get('/:id/history',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/history')
    );

    router.post('/:id/tag',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          tags: Joi.array().items(Joi.string()).required(),
        })
      }),
      this.forwardRequest('POST', '/wallets/:id/tag')
    );

    router.delete('/:id/untag',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          tags: Joi.array().items(Joi.string()).required(),
        })
      }),
      this.forwardRequest('DELETE', '/wallets/:id/untag')
    );

    router.post('/:id/transfers',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          kind: Joi.string().valid('Transaction', 'Evm', 'Eip1559', 'EvmLegacy').required(),
          to: Joi.string().required(),
          amount: Joi.string().optional(),
          contractAddress: Joi.string().optional(),
          tokenId: Joi.string().optional(),
          data: Joi.string().optional(),
          gasLimit: Joi.string().optional(),
          gasPrice: Joi.string().optional(),
          maxFeePerGas: Joi.string().optional(),
          maxPriorityFeePerGas: Joi.string().optional(),
          nonce: Joi.number().optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets/:id/transfers')
    );

    router.get('/:id/transfers',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/transfers')
    );

    router.get('/:id/transfers/:transferId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          transferId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/transfers/:transferId')
    );

    router.post('/:id/transactions',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          kind: Joi.string().required(),
          transaction: Joi.any().required(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets/:id/transactions')
    );

    router.get('/:id/transactions',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20),
          paginationToken: Joi.string().optional(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/transactions')
    );

    router.get('/:id/transactions/:txId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          txId: Joi.string().required(),
        })
      }),
      this.forwardRequest('GET', '/wallets/:id/transactions/:txId')
    );

    return router;
  }
}
