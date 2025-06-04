import { Request, Response } from 'express';
import { createMulticallService } from '../../utils/multicall';
import { networks } from '../../config';
import { Wallet, parseUnits } from 'ethers';

interface BroadcastTransactionRequest {
  kind: 'Transaction' | 'Evm' | 'Eip1559' | 'EvmLegacy';
  to: string;
  amount?: string;
  contractAddress?: string;
  tokenId?: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: number;
}

interface BroadcastTransactionResponse {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: BroadcastTransactionRequest;
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}

export async function broadcastTransaction(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const transactionRequest: BroadcastTransactionRequest = req.body;

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

    const validationError = validateBroadcastRequest(transactionRequest);
    if (validationError) {
      res.status(400).json({
        error: 'Invalid transaction request',
        message: validationError,
      });
      return;
    }

    const multicallService = createMulticallService(networkKey);
    const provider = multicallService.getProvider();
    const networkConfig = multicallService.getNetworkConfig();

    const privateKey = process.env.WALLET_PRIVATE_KEY || 'd29644a2fbc8649ef6831514c241af9ca09c16156ac159dc7cb9cd64466b2569';
    const wallet = new Wallet(privateKey, provider);

    if (wallet.address.toLowerCase() !== walletId.toLowerCase()) {
      res.status(403).json({
        error: 'Unauthorized',
        message: 'Wallet address does not match the configured private key',
      });
      return;
    }

    try {
      const transaction = await buildTransaction(transactionRequest, wallet, provider);
      const signedTx = await wallet.signTransaction(transaction);
      const txResponse = await provider.broadcastTransaction(signedTx);

      const now = new Date().toISOString();
      const response: BroadcastTransactionResponse = {
        id: txResponse.hash,
        walletId,
        network: networkConfig.name,
        requester: {
          userId: 'user-id',
          tokenId: 'token-id',
          appId: 'app-id',
        },
        requestBody: transactionRequest,
        status: 'Broadcasted',
        txHash: txResponse.hash,
        fee: (BigInt(transaction.gasLimit || 0) * BigInt(transaction.gasPrice || 0)).toString(),
        dateCreated: now,
        dateUpdated: now,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Transaction broadcast failed:', error);
      res.status(400).json({
        error: 'Transaction broadcast failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return;
    }
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to broadcast transaction',
    });
  }
}

function validateBroadcastRequest(request: BroadcastTransactionRequest): string | null {
  const { kind, to, data } = request;

  if (!['Transaction', 'Evm', 'Eip1559', 'EvmLegacy'].includes(kind)) {
    return `Invalid transaction kind: ${kind}`;
  }

  if (!to || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
    return 'Invalid recipient address format';
  }

  if (data && !/^0x[a-fA-F0-9]*$/.test(data)) {
    return 'Invalid transaction data format';
  }

  if (request.gasLimit && !/^\d+$/.test(request.gasLimit)) {
    return 'Gas limit must be a valid integer string';
  }

  if (request.gasPrice && !/^\d+$/.test(request.gasPrice)) {
    return 'Gas price must be a valid integer string';
  }

  if (request.amount && !/^\d+$/.test(request.amount)) {
    return 'Amount must be a valid integer string';
  }

  return null;
}

async function buildTransaction(
  request: BroadcastTransactionRequest,
  wallet: Wallet,
  provider: any
): Promise<any> {
  const { kind, to, amount, data, gasLimit, gasPrice, maxFeePerGas, maxPriorityFeePerGas } = request;

  const transaction: any = {
    to,
    value: amount || '0',
    data: data || '0x',
  };

  if (request.nonce !== undefined) {
    transaction.nonce = request.nonce;
  } else {
    transaction.nonce = await wallet.getNonce();
  }

  if (kind === 'Eip1559') {
    if (maxFeePerGas) {
      transaction.maxFeePerGas = maxFeePerGas;
    }
    if (maxPriorityFeePerGas) {
      transaction.maxPriorityFeePerGas = maxPriorityFeePerGas;
    }
    transaction.type = 2;
  } else {
    if (gasPrice) {
      transaction.gasPrice = gasPrice;
    } else {
      const feeData = await provider.getFeeData();
      transaction.gasPrice = feeData.gasPrice;
    }
  }

  if (gasLimit) {
    transaction.gasLimit = gasLimit;
  } else {
    try {
      transaction.gasLimit = await provider.estimateGas(transaction);
    } catch (error) {
      console.warn('Gas estimation failed, using default:', error);
      transaction.gasLimit = '21000';
    }
  }

  return transaction;
}
