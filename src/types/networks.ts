export interface Network {
  name: string;
  chainId?: number;
  nativeAsset: {
    symbol: string;
    name: string;
    decimals: number;
  };
  blockExplorerUrl?: string;
  rpcUrl?: string;
}

export interface FeeEstimate {
  gasPrice?: string;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  baseFee?: string;
  priorityFee?: string;
}

export interface ReadContractRequest {
  contractAddress: string;
  functionName: string;
  functionArgs?: any[];
  blockNumber?: number;
}

export interface Validator {
  address: string;
  name?: string;
  commission: string;
  votingPower: string;
  status: string;
}
