import { Request, Response } from 'express';
import { mean } from 'simple-statistics';
import { rpc } from '@/utils/rpc';
import { config } from '@/config';
import { GetFeesResponse } from '../../types/custom-networks';

export async function getNetworkFees(req: Request, res: Response): Promise<void> {
  try {
    const { network } = req.query;

    if (network !== config.network.name) {
      res.status(400).json({
        error: `Network ${network} is not supported. Only ${config.network.name} is supported.`
      });
      return;
    }

    const block = await rpc("eth_getBlockByNumber", ["latest", false]);
    const baseFee = parseInt(block.baseFeePerGas, 16);
    const blockNumber = parseInt(block.number, 16);

    const feeHistory = await rpc("eth_feeHistory", [30, "latest", [5, 50, 95]]);
    
    const rewards = feeHistory.reward[0].map((_: any, colIndex: number) => 
      feeHistory.reward.map((row: string[]) => parseInt(row[colIndex], 16))
    );
    
    const p5 = Math.round(mean(rewards[0]));
    const p50 = Math.round(mean(rewards[1]));
    const p95 = Math.round(mean(rewards[2]));

    const envelope = (priority: number): number => baseFee + 2 * priority;

    const result: GetFeesResponse = {
      kind: "Eip1559",
      network: network as any,
      baseFeePerGas: baseFee.toString(),
      blockNumber: blockNumber,
      slow: {
        maxPriorityFeePerGas: p5.toString(),
        maxFeePerGas: envelope(p5).toString()
      },
      standard: {
        maxPriorityFeePerGas: p50.toString(),
        maxFeePerGas: envelope(p50).toString()
      },
      fast: {
        maxPriorityFeePerGas: p95.toString(),
        maxFeePerGas: envelope(p95).toString()
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error getting network fees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
