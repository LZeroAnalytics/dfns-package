import { Request, Response } from 'express';
import { networks } from '../../config';
import { GetTransferResponse } from '../../types/wallets';

export async function getTransferRequestById(req: Request, res: Response): Promise<void> {
  try {
    const { walletId, transferId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';

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

    if (!transferId) {
      res.status(400).json({
        error: 'Invalid transfer ID',
        message: 'Transfer ID is required',
      });
      return;
    }

    const transferRequest = getMockTransferById(transferId, walletId, networkKey);

    if (!transferRequest) {
      res.status(404).json({
        error: 'Transfer request not found',
        message: `Transfer request with ID ${transferId} not found`,
      });
      return;
    }

    res.json(transferRequest);
  } catch (error) {
    console.error('Error fetching transfer request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch transfer request',
    });
  }
}

function getMockTransferById(
  transferId: string,
  walletId: string,
  networkKey: string
): GetTransferResponse | null {
  const network = networks[networkKey];
  
  const mockTransfers: Record<string, Partial<GetTransferResponse>> = {
    'transfer-confirmed-1': {
      requestBody: {
        kind: 'Native',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        amount: '1000000000000000000',
        priority: 'Standard',
        memo: 'Native ETH transfer',
      },
      status: 'Confirmed',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      fee: '21000000000000000',
    },
    'transfer-pending-2': {
      requestBody: {
        kind: 'Erc20',
        to: '0x8ba1f109551bD432803012645Hac136c30C6756',
        amount: '1000000',
        contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        priority: 'Fast',

      },
      status: 'Pending',
      fee: '65000000000000000',
    },
    'transfer-failed-3': {
      requestBody: {
        kind: 'Erc721',
        to: '0x9ca2f109551bD432803012645Hac136c30C6756',
        tokenId: '123',
        contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        priority: 'Standard',

      },
      status: 'Failed',
      fee: '85000000000000000',
    },
    'transfer-broadcasted-4': {
      requestBody: {
        kind: 'Erc20',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        amount: '500000000',
        contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48',
        priority: 'Standard',

      },
      status: 'Broadcasted',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      fee: '45000000000000000',
    },
  };

  const mockData = mockTransfers[transferId];
  if (!mockData) {
    return null;
  }

  const now = new Date().toISOString();
  const createdTime = new Date(Date.now() - 3600000).toISOString();

  return {
    id: transferId,
    walletId,
    network: 'Ethereum' as any,
    requester: {
      userId: 'user-123',
      tokenId: 'token-456',
      appId: 'app-789',
    },
    requestBody: mockData.requestBody as any,
    metadata: {
      asset: {
        symbol: network.nativeSymbol,
        decimals: 18,
      }
    },
    status: mockData.status || 'Pending',
    txHash: mockData.txHash,
    fee: mockData.fee,
    dateRequested: createdTime,
  };
}
