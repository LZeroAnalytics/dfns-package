import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, ValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    orgId: string;
    appId: string;
    permissions: string[];
  };
  signature?: {
    isValid: boolean;
    signingKeyId: string;
    nonce: string;
  };
  dfnsCredentials?: {
    appId: string;
    authToken?: string;
    signingKeyId?: string;
    privateKey?: string;
    appSecret?: string;
  };
}

export const extractCredentials = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const appId = req.headers['x-dfns-appid'] as string;
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    const signingKeyId = req.headers['x-dfns-signingkey'] as string;
    const appSecret = req.headers['x-dfns-appsecret'] as string;
    const nonce = req.headers['x-dfns-nonce'] as string;
    const signature = req.headers['x-dfns-signature'] as string;

    if (!appId) {
      throw new ValidationError('Missing required x-dfns-appid header');
    }

    req.dfnsCredentials = {
      appId,
      authToken,
      signingKeyId,
      appSecret,
    };

    if (signingKeyId && nonce && signature) {
      req.signature = {
        isValid: true,
        signingKeyId,
        nonce,
      };
    }

    logger.info('DFNS credentials extracted', { appId, hasAuthToken: !!authToken, hasSignature: !!(signingKeyId && signature) });
    next();
  } catch (error) {
    logger.error('Credential extraction failed', { error, path: req.url });
    next(new AuthenticationError('Invalid DFNS credentials'));
  }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.dfnsCredentials?.appId) {
    return next(new AuthenticationError('Missing DFNS credentials'));
  }

  const hasAuthToken = !!req.dfnsCredentials.authToken;
  const hasSignature = !!req.signature?.isValid;

  if (!hasAuthToken && !hasSignature) {
    return next(new AuthenticationError('Missing authentication: either Bearer token or valid signature required'));
  }

  try {
    req.user = {
      id: 'service-account',
      orgId: 'dynamic-org',
      appId: req.dfnsCredentials.appId,
      permissions: ['*'],
    };

    logger.info('User authenticated', { userId: req.user.id, appId: req.user.appId, authMethod: hasAuthToken ? 'token' : 'signature' });
    next();
  } catch (error) {
    logger.error('Authentication failed', { error });
    next(new AuthenticationError('Authentication failed'));
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!req.user.permissions.includes('*') && !req.user.permissions.includes(permission)) {
      return next(new AuthenticationError(`Insufficient permissions: ${permission} required`));
    }

    next();
  };
};
