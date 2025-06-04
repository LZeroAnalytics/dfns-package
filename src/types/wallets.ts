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
  type?: 'native' | 'erc20' | 'erc721' | 'erc1155';
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
  status: 'Confirmed' | 'Failed' | 'Pending';
  dateCreated: string;
  metadata?: any;
}

export interface TransactionHistory {
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

export interface TransferRequest {
  kind: 'Native' | 'Erc20' | 'Erc721' | 'Erc1155' | 'Transaction' | 'Evm' | 'Eip1559' | 'EvmLegacy';
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
  priority?: 'Slow' | 'Standard' | 'Fast';
  memo?: string;
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
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
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

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

export interface TokenMetadata extends TokenInfo {
  name: string;
  logoURI?: string;
}

export interface AssetBalance {
  type: 'native' | 'erc20';
  contract: string | null;
  symbol: string;
  decimals: number;
  balance: string;
}

export interface MulticallResult {
  success: boolean;
  returnData: string;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  multicallAddress: string;
  nativeSymbol: string;
  coingeckoId: string;
}

export interface BroadcastTransactionRequest {
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
}

export interface BroadcastTransactionResponse {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: BroadcastTransactionRequest;
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface TransferRequestItem {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: {
    kind: string;
    to: string;
    amount?: string;
    contractAddress?: string;
    tokenId?: string;
    data?: string;
    gasLimit?: string;
    priority?: string;
    memo?: string;
    externalId?: string;
  };
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ListTransfersResponse {
  items: TransferRequestItem[];
  nextPageToken?: string;
  hasMore: boolean;
}

export interface TransferRequestDetails {
  id: string;
  walletId: string;
  network: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: {
    kind: string;
    to: string;
    amount?: string;
    contractAddress?: string;
    tokenId?: string;
    data?: string;
    gasLimit?: string;
    priority?: string;
    memo?: string;
    externalId?: string;
  };
  status: 'Pending' | 'Executing' | 'Broadcasted' | 'Confirmed' | 'Failed';
  txHash?: string;
  fee?: string;
  dateCreated: string;
  dateUpdated: string;
}
