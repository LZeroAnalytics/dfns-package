import { Request, Response } from 'express';
import { createMulticallService } from '../../utils/multicall';
import { networks } from '../../config';
import { v4 as uuidv4 } from 'uuid';

interface TransferRequest {
  kind: 'Native' | 'Erc20' | 'Erc721' | 'Erc1155';
  to: string;
  amount?: string;
  contractAddress?: string;
  tokenId?: string;
  data?: string;
  gasLimit?: string;
  priority?: 'Slow' | 'Standard' | 'Fast';
  memo?: string;
  externalId?: string;
}

interface TransferResponse {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: TransferRequest;
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}

export async function transferAsset(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const transferRequest: TransferRequest = req.body;

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

    if (!transferRequest.to || !/^0x[a-fA-F0-9]{40}$/.test(transferRequest.to)) {
      res.status(400).json({
        error: 'Invalid recipient address',
        message: 'Recipient address must be a valid Ethereum address',
      });
      return;
    }

    const validationError = validateTransferRequest(transferRequest);
    if (validationError) {
      res.status(400).json({
        error: 'Invalid transfer request',
        message: validationError,
      });
      return;
    }

    const multicallService = createMulticallService(networkKey);
    const provider = multicallService.getProvider();

    let estimatedGas: bigint;
    let gasPrice: bigint;

    try {
      [estimatedGas, gasPrice] = await Promise.all([
        estimateGasForTransfer(provider, walletId, transferRequest),
        provider.getFeeData().then(feeData => feeData.gasPrice || 0n),
      ]);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      res.status(400).json({
        error: 'Gas estimation failed',
        message: 'Unable to estimate gas for this transaction',
      });
      return;
    }

    const transferId = uuidv4();
    const now = new Date().toISOString();
    const estimatedFee = (estimatedGas * gasPrice).toString();

    const response: TransferResponse = {
      id: transferId,
      walletId,
      network: networks[networkKey].name,
      requester: {
        userId: 'user-id',
        tokenId: 'token-id',
        appId: 'app-id',
      },
      requestBody: {
        ...transferRequest,
        gasLimit: transferRequest.gasLimit || estimatedGas.toString(),
      },
      status: 'Pending',
      fee: estimatedFee,
      dateCreated: now,
      dateUpdated: now,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating transfer request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create transfer request',
    });
  }
}

function validateTransferRequest(request: TransferRequest): string | null {
  const { kind, amount, contractAddress, tokenId } = request;

  switch (kind) {
    case 'Native':
      if (!amount) {
        return 'Amount is required for native transfers';
      }
      if (contractAddress) {
        return 'Contract address should not be provided for native transfers';
      }
      break;

    case 'Erc20':
      if (!amount) {
        return 'Amount is required for ERC20 transfers';
      }
      if (!contractAddress) {
        return 'Contract address is required for ERC20 transfers';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        return 'Invalid contract address format';
      }
      break;

    case 'Erc721':
      if (!tokenId) {
        return 'Token ID is required for ERC721 transfers';
      }
      if (!contractAddress) {
        return 'Contract address is required for ERC721 transfers';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        return 'Invalid contract address format';
      }
      break;

    case 'Erc1155':
      if (!tokenId) {
        return 'Token ID is required for ERC1155 transfers';
      }
      if (!amount) {
        return 'Amount is required for ERC1155 transfers';
      }
      if (!contractAddress) {
        return 'Contract address is required for ERC1155 transfers';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        return 'Invalid contract address format';
      }
      break;

    default:
      return `Unsupported transfer kind: ${kind}`;
  }

  if (amount && !/^\d+$/.test(amount)) {
    return 'Amount must be a valid integer string';
  }

  return null;
}

async function estimateGasForTransfer(
  provider: any,
  from: string,
  request: TransferRequest
): Promise<bigint> {
  try {
    const transaction: any = {
      from,
      to: request.to,
      value: request.kind === 'Native' ? request.amount || '0' : '0',
      data: request.data || '0x',
    };

    if (request.kind === 'Erc20' && request.contractAddress && request.amount) {
      const erc20Interface = new (await import('ethers')).Interface([
        'function transfer(address to, uint256 amount) returns (bool)',
      ]);
      
      transaction.to = request.contractAddress;
      transaction.data = erc20Interface.encodeFunctionData('transfer', [
        request.to,
        request.amount,
      ]);
      transaction.value = '0';
    }

    const gasEstimate = await provider.estimateGas(transaction);
    return gasEstimate;
  } catch (error) {
    console.warn('Gas estimation failed, using default:', error);
    return 21000n; // Default gas limit for simple transfers
  }
}
