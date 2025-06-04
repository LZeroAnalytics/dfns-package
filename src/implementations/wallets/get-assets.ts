import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { createMulticallService } from '../../utils/multicall';
import { getTokenCatalog } from '../../utils/token-catalog';
import { networks } from '../../config';
import { getWalletAddress } from '../../utils/wallet-address';
import { extractForwardHeaders } from '../../utils/dfns-api';

export async function getWalletAssets(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id: walletId } = req.params;
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

    if (!req.dfnsCredentials) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'DFNS credentials are required',
      });
      return;
    }

    const forwardHeaders = extractForwardHeaders(req);
    
    let walletAddress;
    try {
      walletAddress = await getWalletAddress(req.dfnsCredentials, walletId, forwardHeaders);
    } catch (error) {
      console.error('Error fetching wallet address from DFNS:', error);
      res.status(404).json({
        error: 'Wallet not found',
        message: 'Unable to fetch wallet details from DFNS API',
      });
      return;
    }

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Wallet does not have a valid Ethereum address',
      });
      return;
    }

    const multicallService = createMulticallService(networkKey);
    const tokenCatalog = getTokenCatalog();

    const [tokens, nativeBalance] = await Promise.all([
      tokenCatalog.getTopTokensForNetwork(networkKey, 100),
      multicallService.getNativeBalance(walletAddress),
    ]);

    const erc20Balances = await multicallService.getERC20Balances(
      walletAddress,
      tokens.map(token => ({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
      }))
    );

    const allAssets = [nativeBalance, ...erc20Balances];

    const response = {
      walletId,
      network: networks[networkKey].name,
      assets: allAssets.map(asset => ({
        symbol: asset.symbol,
        name: asset.symbol,
        balance: asset.balance,
        decimals: asset.decimals,
        contractAddress: asset.contract,
        type: asset.type,
      })),
      totalAssets: allAssets.length,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching wallet assets:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch wallet assets',
    });
  }
}
