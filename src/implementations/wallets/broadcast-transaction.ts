import { Request, Response } from 'express';
import { createMulticallService } from '../../utils/multicall';
import { networks } from '../../config';
import { Wallet, parseUnits } from 'ethers';
import { BroadcastTransactionBody, BroadcastTransactionResponse } from '../../types/wallets';

export async function broadcastTransaction(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const transactionRequest: BroadcastTransactionBody = req.body;

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
        network: 'Ethereum' as any,
        requester: {
          userId: 'user-id',
          tokenId: 'token-id',
          appId: 'app-id',
        },
        requestBody: transactionRequest,
        status: 'Broadcasted',
        txHash: txResponse.hash,
        fee: (BigInt(transaction.gasLimit || 0) * BigInt(transaction.gasPrice || 0)).toString(),
        dateRequested: now,
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

function validateBroadcastRequest(request: BroadcastTransactionBody): string | null {
  if (!['Transaction', 'Evm', 'Eip1559', 'EvmLegacy', 'Psbt', 'Json'].includes(request.kind)) {
    return `Invalid transaction kind: ${request.kind}`;
  }

  if (request.kind === 'Evm' || request.kind === 'Eip1559' || request.kind === 'EvmLegacy') {
    if (request.to && !/^0x[a-fA-F0-9]{40}$/.test(request.to)) {
      return 'Invalid recipient address format';
    }

    if (request.data && !/^0x[a-fA-F0-9]*$/.test(request.data)) {
      return 'Invalid transaction data format';
    }
  }

  return null;
}

async function buildTransaction(
  request: BroadcastTransactionBody,
  wallet: Wallet,
  provider: any
): Promise<any> {
  if (request.kind === 'Transaction') {
    throw new Error('Raw transaction broadcasting not supported in this implementation');
  }

  if (request.kind === 'Psbt' || request.kind === 'Json') {
    throw new Error(`${request.kind} transactions not supported for EVM networks`);
  }

  const transaction: any = {
    to: request.to || '0x0000000000000000000000000000000000000000',
    value: request.value || '0',
    data: request.data || '0x',
  };

  if (request.nonce !== undefined) {
    transaction.nonce = request.nonce;
  } else {
    transaction.nonce = await wallet.getNonce();
  }

  if (request.kind === 'Eip1559') {
    if (request.maxFeePerGas) {
      transaction.maxFeePerGas = request.maxFeePerGas;
    }
    if (request.maxPriorityFeePerGas) {
      transaction.maxPriorityFeePerGas = request.maxPriorityFeePerGas;
    }
    transaction.type = 2;
  } else if (request.kind === 'EvmLegacy') {
    if (request.gasPrice) {
      transaction.gasPrice = request.gasPrice;
    } else {
      const feeData = await provider.getFeeData();
      transaction.gasPrice = feeData.gasPrice;
    }
  } else {
    const feeData = await provider.getFeeData();
    transaction.gasPrice = feeData.gasPrice;
  }

  if (request.gasLimit) {
    transaction.gasLimit = request.gasLimit;
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
