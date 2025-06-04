import { Request, Response } from 'express';
import { networks } from '../../config';

interface TransferRequestItem {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: {
    kind: string;
    to: string;
    amount?: string;
    contractAddress?: string;
    tokenId?: string;
    data?: string;
    gasLimit?: string;
    priority?: string;
    memo?: string;
    externalId?: string;
  };
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}

interface ListTransfersResponse {
  items: TransferRequestItem[];
  nextPageToken?: string;
  hasMore: boolean;
}

export async function listTransferRequests(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const limit = parseInt(req.query.limit as string) || 50;
    const paginationToken = req.query.paginationToken as string;

    if (!networks[networkKey]) {
      res.status(400).json({
        error: 'Invalid network',
        message: `Supported networks: ${Object.keys(networks).join(', ')}`,
      });
      return;
    }

    if (!walletId || !/^0x[a-fA-F0-9]{40}$/.test(walletId)) {
      res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Wallet ID must be a valid Ethereum address',
      });
      return;
    }

    if (limit > 100) {
      res.status(400).json({
        error: 'Invalid limit',
        message: 'Limit cannot exceed 100',
      });
      return;
    }

    let offset = 0;
    if (paginationToken) {
      try {
        offset = parseInt(paginationToken);
      } catch (error) {
        res.status(400).json({
          error: 'Invalid pagination token',
          message: 'Pagination token must be a valid number',
        });
        return;
      }
    }

    const mockTransfers = generateMockTransfers(walletId, networkKey, offset, limit);
    const hasMore = mockTransfers.length === limit;
    const nextPageToken = hasMore ? (offset + limit).toString() : undefined;

    const response: ListTransfersResponse = {
      items: mockTransfers,
      nextPageToken,
      hasMore,
    };

    res.json(response);
  } catch (error) {
    console.error('Error listing transfer requests:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to list transfer requests',
    });
  }
}

function generateMockTransfers(
  walletId: string,
  networkKey: string,
  offset: number,
  limit: number
): TransferRequestItem[] {
  const transfers: TransferRequestItem[] = [];
  const network = networks[networkKey];
  
  const mockData = [
    {
      kind: 'Native',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: '1000000000000000000',
      status: 'Confirmed' as const,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      fee: '21000000000000000',
    },
    {
      kind: 'Erc20',
      to: '0x8ba1f109551bD432803012645Hac136c30C6756',
      amount: '1000000',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      status: 'Pending' as const,
      fee: '65000000000000000',
    },
    {
      kind: 'Erc721',
      to: '0x9ca2f109551bD432803012645Hac136c30C6756',
      tokenId: '123',
      contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      status: 'Failed' as const,
      fee: '85000000000000000',
    },
  ];

  for (let i = 0; i < limit && (offset + i) < 50; i++) {
    const mockIndex = (offset + i) % mockData.length;
    const mock = mockData[mockIndex];
    const transferId = `transfer-${walletId.slice(-8)}-${offset + i + 1}`;
    const now = new Date(Date.now() - (offset + i) * 3600000).toISOString();

    transfers.push({
      id: transferId,
      walletId,
      network: network.name,
      requester: {
        userId: 'user-123',
        tokenId: 'token-456',
        appId: 'app-789',
      },
      requestBody: {
        kind: mock.kind,
        to: mock.to,
        amount: mock.amount,
        contractAddress: mock.contractAddress,
        tokenId: mock.tokenId,
        priority: 'Standard',
        memo: `Transfer ${i + 1}`,
      },
      status: mock.status,
      txHash: mock.txHash,
      fee: mock.fee,
      dateCreated: now,
      dateUpdated: now,
    });
  }

  return transfers;
}
