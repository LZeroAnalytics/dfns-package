import { Request, Response } from 'express';
import { createMulticallService } from '../../utils/multicall';
import { getTokenCatalog } from '../../utils/token-catalog';
import { networks } from '../../config';

export async function getWalletAssets(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
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

    const multicallService = createMulticallService(networkKey);
    const tokenCatalog = getTokenCatalog();

    const [tokens, nativeBalance] = await Promise.all([
      tokenCatalog.getTopTokensForNetwork(networkKey, 100),
      multicallService.getNativeBalance(walletId),
    ]);

    const erc20Balances = await multicallService.getERC20Balances(
      walletId,
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
