export interface Key {
  id: string;
  name?: string;
  scheme: string;
  curve: string;
  publicKey: string;
  status: 'Active' | 'Archived';
  dateCreated: string;
  externalId?: string;
  tags: string[];
}

export interface CreateKeyRequest {
  scheme: string;
  curve: string;
  name?: string;
  externalId?: string;
  tags?: string[];
}

export interface UpdateKeyRequest {
  name?: string;
  externalId?: string;
}

export interface DelegateKeyRequest {
  userId: string;
}

export interface GenerateSignatureRequest {
  kind: 'Hash' | 'Message' | 'Transaction' | 'Psbt';
  hash?: string;
  message?: string;
  transaction?: any;
  psbt?: string;
  externalId?: string;
}

export interface SignatureRequest {
  id: string;
  keyId: string;
  requester: {
    userId: string;
    tokenId: string;
    appId: string;
  };
  requestBody: GenerateSignatureRequest;
  status: 'Pending' | 'Executing' | 'Signed' | 'Failed' | 'Rejected';
  signature?: {
    r: string;
    s: string;
    recid?: number;
    encoded?: string;
  };
  dateCreated: string;
  dateSigned?: string;
}
