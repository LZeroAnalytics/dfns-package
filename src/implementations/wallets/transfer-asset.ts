import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { DfnsApiHelper } from '../../utils/dfns-api';
import { networks } from '../../config';
import { TransferAssetBody, TransferAssetResponse } from '../../types/wallets';

export async function transferAsset(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';
    const transferRequest: TransferAssetBody = req.body;

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

    if (!req.dfnsCredentials) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'DFNS credentials are required',
      });
      return;
    }

    try {
      const response = await DfnsApiHelper.callDfnsApi(
        req.dfnsCredentials,
        'POST',
        `/wallets/${walletId}/transfers`,
        transferRequest
      );

      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error creating transfer via DFNS API:', error);
      res.status(500).json({
        error: 'Transfer creation failed',
        message: 'Unable to create transfer request via DFNS API',
      });
      return;
    }
  } catch (error) {
    console.error('Error creating transfer request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create transfer request',
    });
  }
}

function validateTransferRequest(request: TransferAssetBody): string | null {
  switch (request.kind) {
    case 'Native':
      if (!request.amount) {
        return 'Amount is required for native transfers';
      }
      break;

    case 'Erc20':
      if (!request.amount) {
        return 'Amount is required for ERC20 transfers';
      }
      if (!request.contract) {
        return 'Contract address is required for ERC20 transfers';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(request.contract)) {
        return 'Invalid contract address format';
      }
      break;

    case 'Erc721':
      if (!request.tokenId) {
        return 'Token ID is required for ERC721 transfers';
      }
      if (!request.contract) {
        return 'Contract address is required for ERC721 transfers';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(request.contract)) {
        return 'Invalid contract address format';
      }
      break;

    default:
      return `Unsupported transfer kind: ${request.kind}`;
  }

  if ('amount' in request && request.amount && !/^\d+$/.test(request.amount)) {
    return 'Amount must be a valid integer string';
  }

  return null;
}
