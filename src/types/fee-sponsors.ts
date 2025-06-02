export interface FeeSponsor {
  id: string;
  name: string;
  network: string;
  isActive: boolean;
  balance: string;
  address: string;
  dateCreated: string;
  dateActivated?: string;
  dateDeactivated?: string;
}

export interface CreateFeeSponsorRequest {
  name: string;
  network: string;
}

export interface SponsoredFee {
  id: string;
  feeSponsorId: string;
  walletId: string;
  txHash: string;
  network: string;
  amount: string;
  dateCreated: string;
}
