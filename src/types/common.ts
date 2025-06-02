export interface DfnsResponse<T = any> {
  data?: T;
  error?: DfnsError;
  success: boolean;
}

export interface DfnsError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextPageToken?: string;
}

export interface CustomLogicHooks {
  preProcess?: (req: any, res: any, next: any) => Promise<void>;
  postProcess?: (dfnsResponse: any, req: any, res: any) => Promise<any>;
  onError?: (error: any, req: any, res: any) => Promise<void>;
}

export interface DfnsRequestHeaders {
  'Content-Type': string;
  'User-Agent': string;
  'Authorization'?: string;
  'X-DFNS-APPID': string;
  'X-DFNS-NONCE': string;
  'X-DFNS-SIGNINGKEY': string;
  'X-DFNS-SIGNATURE': string;
}

export interface SignedRequest {
  method: string;
  path: string;
  body?: any;
  timestamp: number;
  nonce: string;
}

export interface UserActionSignatureChallenge {
  challenge: string;
  challengeIdentifier: string;
  allowCredentials?: Array<{
    type: string;
    id: string;
  }>;
  externalAuthenticationUrl?: string;
}

export interface UserActionSignature {
  challengeIdentifier: string;
  firstFactor?: any;
  secondFactor?: any;
}
