import { Router } from 'express';
import { BaseRoute } from '../base-route';
import { validateRequest } from '@/middleware/validation';
import { requireAuth, extractCredentials } from '@/middleware/auth';
import { getWalletAssets } from '../../implementations/wallets/get-assets';
import { getWalletHistory } from '../../implementations/wallets/get-history';
import { transferAsset } from '../../implementations/wallets/transfer-asset';
import { broadcastTransaction } from '../../implementations/wallets/broadcast-transaction';
import { listTransferRequests } from '../../implementations/wallets/list-transfers';
import { getTransferRequestById } from '../../implementations/wallets/get-transfer';
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
          signingKey: Joi.any().optional(),
          delegateTo: Joi.string().optional(),
          delayDelegation: Joi.boolean().optional(),
          validatorId: Joi.string().optional(),
          tags: Joi.array().items(Joi.string()).optional(),
          externalId: Joi.string().optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets')
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
        }),
        query: Joi.object({
          network: Joi.string().optional(),
          netWorth: Joi.string().optional(),
        })
      }),
      (req, res) => getWalletAssets(req, res)
    );

    router.get('/:id/nfts',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
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
          network: Joi.string().optional(),
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      (req, res) => getWalletHistory(req, res)
    );

    router.put('/:id/tags',
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
      this.forwardRequest('PUT', '/wallets/:id/tags')
    );

    router.delete('/:id/tags',
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
      this.forwardRequest('DELETE', '/wallets/:id/tags')
    );

    router.post('/:id/transfers',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          network: Joi.string().optional(),
        }),
        body: Joi.object({
          kind: Joi.string().valid('Native', 'Asa', 'Aip21', 'Erc20', 'Erc721', 'Sep41', 'Spl', 'Spl2022', 'Tep74', 'Trc10', 'Trc20', 'Trc721').required(),
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
      (req, res) => transferAsset(req, res)
    );

    router.get('/:id/transfers',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          network: Joi.string().optional(),
          limit: Joi.number().integer().min(1).default(100),
          paginationToken: Joi.string().optional(),
        })
      }),
      (req, res) => listTransferRequests(req, res)
    );

    router.get('/:id/transfers/:transferId',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
          transferId: Joi.string().required(),
        }),
        query: Joi.object({
          network: Joi.string().optional(),
        })
      }),
      (req, res) => getTransferRequestById(req, res)
    );

    router.post('/:id/transactions',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        query: Joi.object({
          network: Joi.string().optional(),
        }),
        body: Joi.object({
          kind: Joi.string().required(),
          transaction: Joi.any().optional(),
          externalId: Joi.string().optional(),
          to: Joi.string().optional(),
          value: Joi.any().optional(),
          data: Joi.string().optional(),
          nonce: Joi.any().optional(),
          gasLimit: Joi.any().optional(),
          maxFeePerGas: Joi.any().optional(),
          maxPriorityFeePerGas: Joi.any().optional(),
          gasPrice: Joi.any().optional(),
          psbt: Joi.any().optional()
        })
      }),
      (req, res) => broadcastTransaction(req, res)
    );

    router.get('/:id/transactions',
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

    router.post('/:id/signatures',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
      }),
      this.forwardRequest('POST', '/wallets/:id/signatures')
    );

    router.post('/import',
      extractCredentials,
      requireAuth,
      validateRequest({
        body: Joi.object({
          network: Joi.string().optional(),
          name: Joi.string().optional(),
          protocol: Joi.string().optional(),
          curve: Joi.string().optional(),
          minSigners: Joi.number().optional(),
          encryptedShares: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets/:id/delegate')
    );

    router.post('/:id/export',
      extractCredentials,
      requireAuth,
      validateRequest({
        params: Joi.object({
          id: Joi.string().required(),
        }),
        body: Joi.object({
          encryptionKey: Joi.string().optional(),
          supportedSchemes: Joi.any().optional(),
        })
      }),
      this.forwardRequest('POST', '/wallets/:id/delegate')
    );


    return router;
  }
}
