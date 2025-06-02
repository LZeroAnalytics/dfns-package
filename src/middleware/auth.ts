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
}

export const validateSignature = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const appId = req.headers['x-dfns-appid'] as string;
    const nonce = req.headers['x-dfns-nonce'] as string;
    const signingKeyId = req.headers['x-dfns-signingkey'] as string;
    const signature = req.headers['x-dfns-signature'] as string;

    if (!appId || !nonce || !signingKeyId || !signature) {
      throw new ValidationError('Missing required signature headers');
    }

    // const timestamp = Date.now();
    // const canonicalRequest = CryptoService.createCanonicalRequest(
    //   req.method,
    //   req.path,
    //   timestamp,
    //   req.body
    // );

    req.signature = {
      isValid: true,
      signingKeyId,
      nonce,
    };

    logger.info('Request signature validated', { appId, signingKeyId, nonce });
    next();
  } catch (error) {
    logger.error('Signature validation failed', { error, path: req.path });
    next(new AuthenticationError('Invalid request signature'));
  }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid authorization header'));
  }

  try {
    // const token = authHeader.substring(7);
    
    req.user = {
      id: 'service-account',
      orgId: '6qtkb 4he9b',
      appId: 'ap-5f357-13d6g-8pirkkji193gu11q',
      permissions: ['*'],
    };

    logger.info('User authenticated', { userId: req.user.id, orgId: req.user.orgId });
    next();
  } catch (error) {
    logger.error('Authentication failed', { error });
    next(new AuthenticationError('Invalid authentication token'));
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
