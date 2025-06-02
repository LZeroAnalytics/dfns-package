export interface Wallet {
  id: string;
  network: string;
  name?: string;
  address: string;
  signingKey: {
    scheme: string;
    curve: string;
    publicKey: string;
  };
  status: 'Active' | 'Archived';
  dateCreated: string;
  custodial: boolean;
  imported: boolean;
  exported: boolean;
  dateExported?: string;
  externalId?: string;
  tags: string[];
}

export interface CreateWalletRequest {
  network: string;
  name?: string;
  externalId?: string;
  tags?: string[];
}

export interface UpdateWalletRequest {
  name?: string;
  externalId?: string;
}

export interface DelegateWalletRequest {
  userId: string;
}

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  contractAddress?: string;
  tokenId?: string;
}

export interface WalletNft {
  contractAddress: string;
  tokenId: string;
  name?: string;
  description?: string;
  image?: string;
  metadata?: any;
}

export interface WalletHistory {
  id: string;
  walletId: string;
  network: string;
  txHash?: string;
  operation: string;
  status: string;
  dateCreated: string;
  metadata?: any;
}

export interface TransferRequest {
  kind: 'Transaction' | 'Evm' | 'Eip1559' | 'EvmLegacy';
  to: string;
  amount?: string;
  contractAddress?: string;
  tokenId?: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: number;
  externalId?: string;
}

export interface TransferResponse {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: TransferRequest;
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed' | 'Rejected';
  txHash?: string;
  dateCreated: string;
  dateBroadcasted?: string;
  dateConfirmed?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  network: string;
  txHash: string;
  status: 'Pending' | 'Confirmed' | 'Failed';
  dateCreated: string;
  dateConfirmed?: string;
  blockNumber?: number;
  blockHash?: string;
  gasUsed?: string;
  gasPrice?: string;
  fee?: string;
}
