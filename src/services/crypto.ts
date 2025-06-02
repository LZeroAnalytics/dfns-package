import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SigningError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export class CryptoService {
  static generateNonce(): string {
    return uuidv4();
  }

  static generateTimestamp(): number {
    return Date.now();
  }

  static createCanonicalRequest(
    method: string,
    path: string,
    timestamp: number,
    body?: any
  ): string {
    const bodyString = body ? JSON.stringify(body) : '';
    return `${method.toUpperCase()}\n${path}\n${timestamp}\n${bodyString}`;
  }

  static signRequest(
    canonicalRequest: string,
    privateKey: string
  ): string {
    try {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(canonicalRequest);
      sign.end();
      
      const signature = sign.sign(privateKey, 'base64');
      return signature;
    } catch (error) {
      logger.error('Failed to sign request', { error, canonicalRequest });
      throw new SigningError('Failed to sign request', error);
    }
  }

  static verifySignature(
    canonicalRequest: string,
    signature: string,
    publicKey: string
  ): boolean {
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(canonicalRequest);
      verify.end();
      
      return verify.verify(publicKey, signature, 'base64');
    } catch (error) {
      logger.error('Failed to verify signature', { error });
      return false;
    }
  }

  static extractPublicKey(privateKey: string): string {
    try {
      const keyObject = crypto.createPrivateKey(privateKey);
      const publicKey = crypto.createPublicKey(keyObject);
      return publicKey.export({ type: 'spki', format: 'pem' }) as string;
    } catch (error) {
      logger.error('Failed to extract public key', { error });
      throw new SigningError('Failed to extract public key from private key', error);
    }
  }

  static generateKeyPair(): { privateKey: string; publicKey: string } {
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      return { privateKey, publicKey };
    } catch (error) {
      logger.error('Failed to generate key pair', { error });
      throw new SigningError('Failed to generate key pair', error);
    }
  }
}
