import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { DfnsApiHelper, extractForwardHeaders } from '../../utils/dfns-api';
import { networks } from '../../config';
import { GetTransferResponse } from '../../types/wallets';

export async function getTransferRequestById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id: walletId, transferId } = req.params;
    const networkKey = req.query.network as string || 'ethereum';

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

    if (!transferId) {
      res.status(400).json({
        error: 'Invalid transfer ID',
        message: 'Transfer ID is required',
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
        'GET',
        `/wallets/${walletId}/transfers/${transferId}`,
        undefined,
        forwardHeaders
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error fetching transfer from DFNS API:', error);
      res.status(404).json({
        error: 'Transfer request not found',
        message: `Transfer request with ID ${transferId} not found`,
      });
      return;
    }
  } catch (error) {
    console.error('Error fetching transfer request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch transfer request',
    });
  }
}
