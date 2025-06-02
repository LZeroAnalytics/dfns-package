# DFNS API Implementation Plan

## Overview
Build a complete Express.js TypeScript API that mirrors the DFNS API behavior exactly, including authentication, request signing, and all endpoint categories.

## Project Structure
```
dfns-package/
├── src/
│   ├── app.ts                    # Main Express app
│   ├── config/
│   │   ├── index.ts             # Configuration management
│   │   └── dfns.ts              # DFNS API configuration
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   ├── signing.ts           # Request signing middleware
│   │   └── validation.ts        # Request validation
│   ├── services/
│   │   ├── dfns-client.ts       # DFNS API client
│   │   ├── crypto.ts            # Cryptographic operations
│   │   └── user-action-signing.ts # User action signing service
│   ├── routes/
│   │   ├── index.ts             # Route aggregation
│   │   ├── auth/                # Authentication routes
│   │   │   ├── index.ts
│   │   │   ├── delegated.ts     # Delegated authentication
│   │   │   ├── service-accounts.ts # Service account management
│   │   │   ├── user-action-signing.ts # User action signing
│   │   │   ├── registration.ts   # User registration
│   │   │   ├── login.ts         # User login
│   │   │   ├── users.ts         # User management
│   │   │   ├── applications.ts   # Application management
│   │   │   ├── personal-access-tokens.ts # PAT management
│   │   │   ├── credentials.ts    # Credential management
│   │   │   └── recovery.ts      # Account recovery
│   │   ├── wallets/             # Wallet management
│   │   │   ├── index.ts
│   │   │   ├── create.ts        # Create wallet
│   │   │   ├── update.ts        # Update wallet
│   │   │   ├── delete.ts        # Delete wallet
│   │   │   ├── delegate.ts      # Delegate wallet
│   │   │   ├── get.ts           # Get wallet by ID
│   │   │   ├── list.ts          # List wallets
│   │   │   ├── assets.ts        # Get wallet assets
│   │   │   ├── nfts.ts          # Get wallet NFTs
│   │   │   ├── history.ts       # Get wallet history
│   │   │   ├── tag.ts           # Tag wallet
│   │   │   ├── untag.ts         # Untag wallet
│   │   │   ├── transfer.ts      # Transfer asset
│   │   │   ├── transfer-requests.ts # Transfer request management
│   │   │   ├── transactions.ts   # Transaction management
│   │   │   └── advanced.ts      # Advanced wallet APIs
│   │   ├── fee-sponsors/        # Fee sponsor management
│   │   │   ├── index.ts
│   │   │   ├── create.ts        # Create fee sponsor
│   │   │   ├── get.ts           # Get fee sponsor
│   │   │   ├── list.ts          # List fee sponsors
│   │   │   ├── activate.ts      # Activate fee sponsor
│   │   │   ├── deactivate.ts    # Deactivate fee sponsor
│   │   │   ├── delete.ts        # Delete fee sponsor
│   │   │   └── sponsored-fees.ts # List sponsored fees
│   │   ├── keys/                # Key management
│   │   │   ├── index.ts
│   │   │   ├── create.ts        # Create key
│   │   │   ├── update.ts        # Update key
│   │   │   ├── delete.ts        # Delete key
│   │   │   ├── delegate.ts      # Delegate key
│   │   │   ├── get.ts           # Get key by ID
│   │   │   ├── list.ts          # List keys
│   │   │   ├── generate-signature.ts # Generate signature
│   │   │   ├── signature-requests.ts # Signature request management
│   │   │   └── advanced.ts      # Advanced key APIs
│   │   ├── networks/            # Network information
│   │   │   ├── index.ts
│   │   │   ├── estimate-fees.ts # Estimate fees
│   │   │   ├── read-contract.ts # Read contract
│   │   │   └── validators.ts    # Validator information
│   │   ├── policy-engine/       # Policy management
│   │   │   ├── index.ts
│   │   │   ├── policies.ts      # Policy overview
│   │   │   └── api-reference.ts # API reference
│   │   ├── permissions/         # Permission management
│   │   │   ├── index.ts
│   │   │   ├── overview.ts      # Permissions overview
│   │   │   └── api-reference.ts # API reference
│   │   └── webhooks/            # Webhook management
│   │       ├── index.ts
│   │       ├── create.ts        # Create webhook
│   │       ├── update.ts        # Update webhook
│   │       ├── delete.ts        # Delete webhook
│   │       ├── list.ts          # List webhooks
│   │       └── test.ts          # Test webhook
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts              # Authentication types
│   │   ├── wallets.ts           # Wallet types
│   │   ├── fee-sponsors.ts      # Fee sponsor types
│   │   ├── keys.ts              # Key types
│   │   ├── networks.ts          # Network types
│   │   ├── policy-engine.ts     # Policy engine types
│   │   ├── permissions.ts       # Permission types
│   │   ├── webhooks.ts          # Webhook types
│   │   └── common.ts            # Common types
│   └── utils/
│       ├── logger.ts            # Logging utility
│       ├── errors.ts            # Error handling
│       └── validation.ts        # Validation utilities
├── docs/
│   └── openapi.yaml             # OpenAPI specification
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test fixtures
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## Authentication Implementation

### 1. Service Account Authentication
- RSA private key signing for API requests
- JWT token generation and validation
- Request signature verification using provided credentials:
  - App ID: `ap-5f357-13d6g-8pirkkji193gu11q`
  - Private Key: (provided RSA key)
  - Org ID: `6qtkb 4he9b`
  - Signing Key Cred ID: `Y2ktN2FwNjUtMTRpcTItODN1OHFvdmo2djFqNjk4ZQ`

### 2. User Action Signing
- Three-step process implementation:
  1. Get challenge from DFNS system
  2. Sign challenge with user's private key
  3. Return signed challenge with original API call
- Support for both local signing and external signers (AWS KMS)

### 3. Delegated Authentication
- End-user registration and login flows
- Service account delegation to end users
- White-label authentication support

## Request Forwarding Strategy

### Core Principle
Each endpoint will:
1. **Validate incoming requests** using middleware
2. **Apply custom logic hooks** (pre-processing)
3. **Forward to DFNS API** at `api.dfns.io`
4. **Apply custom logic hooks** (post-processing)
5. **Return response** with proper error handling

### Custom Logic Integration Points
```typescript
interface CustomLogicHooks {
  preProcess?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  postProcess?: (dfnsResponse: any, req: Request, res: Response) => Promise<any>;
  onError?: (error: any, req: Request, res: Response) => Promise<void>;
}
```

## API Categories Implementation

### 1. Authentication Routes
- **Delegated Authentication**
  - `POST /auth/delegated/registration`
  - `POST /auth/delegated/registration/restart`
  - `POST /auth/delegated/login`
- **User Action Signing**
  - `POST /auth/action/init`
  - `POST /auth/action/sign`
- **Service Accounts**
  - `GET /auth/service-accounts`
  - `POST /auth/service-accounts`
  - `GET /auth/service-accounts/:id`
  - `PUT /auth/service-accounts/:id`
  - `POST /auth/service-accounts/:id/activate`
  - `POST /auth/service-accounts/:id/deactivate`
  - `DELETE /auth/service-accounts/:id`
- **Users, Applications, PATs, Credentials, Recovery** (all endpoints)

### 2. Wallet Routes
- **Core Operations**
  - `POST /wallets` (Create wallet)
  - `PUT /wallets/:id` (Update wallet)
  - `DELETE /wallets/:id` (Delete wallet)
  - `POST /wallets/:id/delegate` (Delegate wallet)
  - `GET /wallets/:id` (Get wallet by ID)
  - `GET /wallets` (List wallets)
- **Asset Management**
  - `GET /wallets/:id/assets` (Get wallet assets)
  - `GET /wallets/:id/nfts` (Get wallet NFTs)
  - `GET /wallets/:id/history` (Get wallet history)
- **Tagging**
  - `POST /wallets/:id/tag` (Tag wallet)
  - `DELETE /wallets/:id/untag` (Untag wallet)
- **Transfers**
  - `POST /wallets/:id/transfers` (Transfer asset)
  - `GET /wallets/:id/transfers/:transferId` (Get transfer request)
  - `GET /wallets/:id/transfers` (List transfer requests)
- **Transactions**
  - `POST /wallets/:id/transactions` (Sign and broadcast)
  - `GET /wallets/:id/transactions/:txId` (Get transaction)
  - `GET /wallets/:id/transactions` (List transactions)
- **Advanced APIs** (all endpoints)

### 3. Fee Sponsor Routes
- `POST /fee-sponsors` (Create fee sponsor)
- `GET /fee-sponsors/:id` (Get fee sponsor)
- `GET /fee-sponsors` (List fee sponsors)
- `POST /fee-sponsors/:id/activate` (Activate)
- `POST /fee-sponsors/:id/deactivate` (Deactivate)
- `DELETE /fee-sponsors/:id` (Delete)
- `GET /fee-sponsors/:id/sponsored-fees` (List sponsored fees)

### 4. Key Routes
- **Core Operations**
  - `POST /keys` (Create key)
  - `PUT /keys/:id` (Update key)
  - `DELETE /keys/:id` (Delete key)
  - `POST /keys/:id/delegate` (Delegate key)
  - `GET /keys/:id` (Get key by ID)
  - `GET /keys` (List keys)
- **Signature Operations**
  - `POST /keys/:id/signatures` (Generate signature)
  - `GET /keys/:id/signatures/:sigId` (Get signature request)
  - `GET /keys/:id/signatures` (List signature requests)
- **Advanced APIs** (all endpoints)

### 5. Network Routes
- `GET /networks/:network/fee-estimates` (Estimate fees)
- `POST /networks/:network/read-contract` (Read contract)
- `GET /networks/:network/validators` (Get validators)

### 6. Policy Engine Routes
- Policy overview and API reference endpoints
- Policy creation, update, deletion
- Approval workflow management

### 7. Permission Routes
- Permission overview and API reference endpoints
- Permission assignment and management

### 8. Webhook Routes
- `POST /webhooks` (Create webhook)
- `PUT /webhooks/:id` (Update webhook)
- `DELETE /webhooks/:id` (Delete webhook)
- `GET /webhooks` (List webhooks)
- `POST /webhooks/:id/test` (Test webhook)

## Headers and Metadata Handling

### Required Headers
```typescript
const requiredHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'dfns-package/1.0.0',
  'Authorization': 'Bearer <token>',
  'X-DFNS-APPID': process.env.DFNS_APP_ID,
  'X-DFNS-NONCE': generateNonce(),
  'X-DFNS-SIGNINGKEY': process.env.DFNS_SIGNING_KEY_ID,
  'X-DFNS-SIGNATURE': generateSignature(request)
};
```

### Request Signing Process
1. **Create canonical request** (method + path + timestamp + body)
2. **Generate signature** using RSA-SHA256 with private key
3. **Add signature headers** to outgoing request
4. **Forward to DFNS API** with all required headers

## TypeScript Types

### Comprehensive type definitions for:
- All request/response interfaces
- Authentication payloads
- Wallet operations
- Key management
- Network information
- Policy definitions
- Permission structures
- Webhook configurations

## OpenAPI Specification

### Complete OpenAPI 3.0 specification including:
- All endpoint definitions
- Request/response schemas
- Authentication schemes
- Error responses
- Example requests/responses

## Testing Strategy

### Test Credentials (Provided)
- App ID: `ap-5f357-13d6g-8pirkkji193gu11q`
- Private Key: (RSA private key provided)
- Org ID: `6qtkb 4he9b`
- Signing Key Cred ID: `Y2ktN2FwNjUtMTRpcTItODN1OHFvdmo2djFqNjk4ZQ`

### Test Coverage
- Unit tests for all services and utilities
- Integration tests for API endpoints
- Authentication flow testing
- Request signing verification
- Error handling validation

## Development Tools

### Linting and Formatting
- ESLint with TypeScript support
- Prettier for code formatting
- Husky for pre-commit hooks

### Build and Development
- TypeScript compilation
- Nodemon for development
- Docker support for deployment

## Implementation Priority

1. **Phase 1: Core Infrastructure**
   - Project setup and configuration
   - Authentication middleware
   - Request signing service
   - DFNS client service

2. **Phase 2: Authentication APIs**
   - Service account management
   - User action signing
   - Delegated authentication

3. **Phase 3: Core APIs**
   - Wallet management
   - Key management
   - Transfer operations

4. **Phase 4: Extended APIs**
   - Fee sponsors
   - Networks
   - Policy engine
   - Permissions
   - Webhooks

5. **Phase 5: Documentation and Testing**
   - OpenAPI specification
   - Comprehensive testing
   - Documentation

## Custom Logic Extension Points

Each route handler will support custom logic through:
- **Pre-processing hooks**: Modify requests before forwarding
- **Post-processing hooks**: Transform responses before returning
- **Error handling hooks**: Custom error processing
- **Validation hooks**: Additional request validation
- **Logging hooks**: Custom logging and monitoring

This ensures the API can be extended with business logic while maintaining exact DFNS API compatibility.
