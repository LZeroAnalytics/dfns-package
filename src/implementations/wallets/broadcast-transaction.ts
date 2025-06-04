import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { DfnsApiHelper, extractForwardHeaders } from '../../utils/dfns-api';
import { networks } from '../../config';
import { BroadcastTransactionBody, BroadcastTransactionResponse } from '../../types/wallets';

export async function broadcastTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id: walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const transactionRequest: BroadcastTransactionBody = req.body;

    if (!networks[networkKey]) {
      res.status(400).json({
        error: 'Invalid network',
        message: `Supported networks: ${Object.keys(networks).join(', ')}`,
      });
      return;
    }

    if (!walletId) {
      res.status(400).json({
        error: 'Invalid wallet ID',
        message: 'Wallet ID is required',
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

    if (!req.dfnsCredentials) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'DFNS credentials are required',
      });
      return;
    }

    const forwardHeaders = extractForwardHeaders(req);
    
    try {
      const response = await DfnsApiHelper.callDfnsApi(
        req.dfnsCredentials,
        'POST',
        `/wallets/${walletId}/transactions`,
        transactionRequest,
        forwardHeaders
      );

      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error broadcasting transaction via DFNS API:', error);
      res.status(500).json({
        error: 'Transaction broadcast failed',
        message: 'Unable to broadcast transaction via DFNS API',
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
  if (!request.kind) {
    return 'Transaction kind is required';
  }

  return null;
}
