import { Request, Response } from 'express';
import { rpc } from '../../utils/rpc';
import { config } from '../../config';
import { ReadContractBody, ReadContractResponse } from '../../types/custom-networks';

export async function readContract(req: Request, res: Response): Promise<void> {
  try {
    const body: ReadContractBody = req.body;

    if (body.kind !== "Evm") {
      res.status(400).json({
        error: `Kind ${body.kind} is not supported. Only "Evm" is supported.`
      });
      return;
    }

    if (body.network !== config.network.name) {
      res.status(400).json({
        error: `Network ${body.network} is not supported. Only ${config.network.name} is supported.`
      });
      return;
    }

    const result = await rpc("eth_call", [
      {
        to: body.contract,
        data: body.data
      },
      "latest"
    ]);

    const response: ReadContractResponse = {
      kind: "Evm",
      data: result
    };

    res.json(response);
  } catch (error) {
    console.error('Error reading contract:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
