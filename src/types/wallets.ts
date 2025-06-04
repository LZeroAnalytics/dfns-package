export { 
  CreateWalletRequest,
  CreateWalletResponse as Wallet,
  UpdateWalletRequest,
  DelegateWalletRequest,
  GetWalletAssetsResponse,
  GetWalletHistoryResponse,
  TransferAssetBody,
  TransferAssetResponse,
  BroadcastTransactionBody,
  BroadcastTransactionResponse,
  ListTransfersResponse,
  GetTransferResponse
} from '@dfns/sdk/generated/wallets/types';

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
