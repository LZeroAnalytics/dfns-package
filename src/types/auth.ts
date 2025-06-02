export interface ServiceAccount {
  id: string;
  name: string;
  publicKey: string;
  isActive: boolean;
  dateCreated: string;
  credentialId: string;
  orgId: string;
  permissions: string[];
}

export interface CreateServiceAccountRequest {
  name: string;
  publicKey: string;
  permissions?: string[];
}

export interface UpdateServiceAccountRequest {
  name?: string;
  permissions?: string[];
}

export interface DelegatedRegistrationRequest {
  username: string;
  orgId: string;
  externalId?: string;
}

export interface DelegatedLoginRequest {
  username: string;
  orgId: string;
}

export interface UserActionSigningRequest {
  userActionPayload: string;
  userActionHttpMethod: string;
  userActionHttpPath: string;
  userActionServerKind: string;
}

export interface User {
  id: string;
  username: string;
  orgId: string;
  isActive: boolean;
  dateCreated: string;
  externalId?: string;
}

export interface Application {
  id: string;
  name: string;
  appId: string;
  orgId: string;
  isActive: boolean;
  dateCreated: string;
  reliedParty: {
    name: string;
    origins: string[];
  };
}

export interface PersonalAccessToken {
  id: string;
  name: string;
  dateCreated: string;
  lastUsed?: string;
  permissions: string[];
}

export interface Credential {
  id: string;
  name: string;
  kind: string;
  isActive: boolean;
  dateCreated: string;
  publicKey?: string;
}

export interface RecoveryRequest {
  id: string;
  status: string;
  dateCreated: string;
  dateResolved?: string;
}
