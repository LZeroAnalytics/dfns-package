import { Router } from 'express';
import { AuthRoutes } from './auth';
import { WalletRoutes } from './wallets';
import { KeyRoutes } from './keys';
import { FeeSponsorRoutes } from './fee-sponsors';
import { NetworkRoutes } from './networks';
import { WebhookRoutes } from './webhooks';
import { PolicyEngineRoutes } from './policy-engine';
import { PermissionRoutes } from './permissions';
import { AssetsRoutes } from './assets';
import { PolicyExecutionRoutes } from './policy-execution';
import { PublicKeysRoutes } from './public-keys';
import { CustomLogicHooks } from '@/types/common';
import { PolicyApprovalRoutes } from '@/routes/policy-approvals';

export class ApiRoutes {
  private router: Router;
  private hooks: CustomLogicHooks;

  constructor(hooks: CustomLogicHooks = {}) {
    this.router = Router();
    this.hooks = hooks;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const authRoutes = new AuthRoutes(this.hooks);
    const walletRoutes = new WalletRoutes(this.hooks);
    const keyRoutes = new KeyRoutes(this.hooks);
    const feeSponsorRoutes = new FeeSponsorRoutes(this.hooks);
    const networkRoutes = new NetworkRoutes(this.hooks);
    const webhookRoutes = new WebhookRoutes(this.hooks);
    const policyEngineRoutes = new PolicyEngineRoutes(this.hooks);
    const policyApprovalRoutes = new PolicyApprovalRoutes(this.hooks);
    const permissionRoutes = new PermissionRoutes(this.hooks);
    const assetsRoutes = new AssetsRoutes();
    const policyExecutionRoutes = new PolicyExecutionRoutes();
    const publicKeysRoutes = new PublicKeysRoutes();

    this.router.use('/auth', authRoutes.getRouter());
    this.router.use('/wallets', walletRoutes.getRouter());
    this.router.use('/keys', keyRoutes.getRouter());
    this.router.use('/fee-sponsors', feeSponsorRoutes.getRouter());
    this.router.use('/networks', networkRoutes.getRouter());
    this.router.use('/webhooks', webhookRoutes.getRouter());
    this.router.use('/v2/policies', policyEngineRoutes.getRouter());
    this.router.use('/v2/policy-approvals', policyApprovalRoutes.getRouter());
    this.router.use('/permissions', permissionRoutes.getRouter());
    this.router.use('/assets', assetsRoutes.getRouter());
    this.router.use('/policy-executions', policyExecutionRoutes.getRouter());
    this.router.use('/public-keys', publicKeysRoutes.getRouter());

    this.router.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
