import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { networks } from '../../config';
import { ListTransfersResponse } from '../../types/wallets';
import { DfnsApiHelper, extractForwardHeaders } from '../../utils/dfns-api';

export async function listTransferRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id: walletId } = req.params;
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

    if (!walletId) {
      res.status(400).json({
        error: 'Invalid wallet ID',
        message: 'Wallet ID is required',
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

    if (!req.dfnsCredentials) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'DFNS credentials are required',
      });
      return;
    }

    const forwardHeaders = extractForwardHeaders(req);
    
    let transfersData;
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        ...(paginationToken && { paginationToken }),
      });

      transfersData = await DfnsApiHelper.callDfnsApi(
        req.dfnsCredentials,
        'GET',
        `/wallets/${walletId}/transfers?${queryParams.toString()}`,
        undefined,
        forwardHeaders
      );
    } catch (error) {
      console.error('Error fetching transfers from DFNS:', error);
      res.status(500).json({
        error: 'Failed to fetch transfers',
        message: 'Unable to retrieve transfer requests from DFNS API',
      });
      return;
    }

    const response: ListTransfersResponse = {
      walletId,
      items: transfersData.data.items || [],
      nextPageToken: transfersData.data.nextPageToken,
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
