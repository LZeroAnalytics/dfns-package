import { Request, Response } from 'express';
import { createMulticallService } from '../../utils/multicall';
import { networks } from '../../config';
import { rpc } from '../../utils/rpc';

interface TransactionHistory {
  id: string;
  walletId: string;
  network: string;
  status: 'Confirmed' | 'Failed' | 'Pending';
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  gasPrice?: string;
  fee?: string;
  kind: 'Native' | 'Erc20' | 'Contract';
  asset?: {
    symbol: string;
    contractAddress?: string;
    decimals: number;
  };
}

export async function getWalletHistory(req: Request, res: Response): Promise<void> {
  try {
    const { walletId } = req.params;
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

    if (!walletId || !/^0x[a-fA-F0-9]{40}$/.test(walletId)) {
      res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Wallet ID must be a valid Ethereum address',
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

    const multicallService = createMulticallService(networkKey);
    const provider = multicallService.getProvider();

    let fromBlock = 0;
    if (paginationToken) {
      try {
        fromBlock = parseInt(paginationToken);
      } catch (error) {
        res.status(400).json({
          error: 'Invalid pagination token',
          message: 'Pagination token must be a valid block number',
        });
        return;
      }
    }

    const latestBlock = await provider.getBlockNumber();
    const toBlock = Math.min(fromBlock + 10000, latestBlock);

    const [incomingTxs, outgoingTxs] = await Promise.all([
      getTransactionsByAddress(provider, walletId, fromBlock, toBlock, 'to'),
      getTransactionsByAddress(provider, walletId, fromBlock, toBlock, 'from'),
    ]);

    const allTransactions = [...incomingTxs, ...outgoingTxs]
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, limit);

    const transactions: TransactionHistory[] = await Promise.all(
      allTransactions.map(async (tx) => {
        const receipt = await provider.getTransactionReceipt(tx.hash);
        const block = await provider.getBlock(tx.blockNumber);
        
        return {
          id: tx.hash,
          walletId,
          network: networks[networkKey].name,
          status: receipt?.status === 1 ? 'Confirmed' : 'Failed',
          txHash: tx.hash,
          blockNumber: tx.blockNumber,
          timestamp: new Date(block!.timestamp * 1000).toISOString(),
          from: tx.from,
          to: tx.to || '',
          value: tx.value.toString(),
          gasUsed: receipt?.gasUsed.toString(),
          gasPrice: tx.gasPrice?.toString(),
          fee: receipt ? (receipt.gasUsed * (tx.gasPrice || 0n)).toString() : undefined,
          kind: tx.data === '0x' ? 'Native' : 'Contract',
          asset: {
            symbol: networks[networkKey].nativeSymbol,
            decimals: 18,
          },
        };
      })
    );

    const nextPageToken = toBlock < latestBlock ? toBlock.toString() : undefined;

    const response = {
      walletId,
      network: networks[networkKey].name,
      transactions,
      nextPageToken,
      hasMore: !!nextPageToken,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching wallet history:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch wallet history',
    });
  }
}

async function getTransactionsByAddress(
  provider: any,
  address: string,
  fromBlock: number,
  toBlock: number,
  direction: 'to' | 'from'
): Promise<any[]> {
  try {
    const filter = direction === 'to' 
      ? { toAddress: address, fromBlock, toBlock }
      : { fromAddress: address, fromBlock, toBlock };

    const logs = await provider.getLogs({
      ...filter,
      topics: [],
    });

    const txHashes = [...new Set(logs.map((log: any) => log.transactionHash))];
    const transactions = await Promise.all(
      txHashes.slice(0, 50).map((hash: any) => provider.getTransaction(hash))
    );

    return transactions.filter(tx => tx !== null);
  } catch (error) {
    console.warn(`Failed to get ${direction} transactions:`, error);
    return [];
  }
}
