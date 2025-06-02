import { DfnsClient } from './dfns-client';
import { UserActionSignatureChallenge, UserActionSignature } from '@/types/common';
import { logger } from '@/utils/logger';
import { DfnsApiError } from '@/utils/errors';

export class UserActionSigningService {
  private dfnsClient: DfnsClient;

  constructor() {
    this.dfnsClient = new DfnsClient();
  }

  async initUserActionSigning(
    userActionPayload: string,
    userActionHttpMethod: string,
    userActionHttpPath: string,
    userActionServerKind: string = 'Api'
  ): Promise<UserActionSignatureChallenge> {
    try {
      const response = await this.dfnsClient.post('/auth/action/init', {
        userActionPayload,
        userActionHttpMethod,
        userActionHttpPath,
        userActionServerKind,
      });

      if (!response.success || !response.data) {
        throw new DfnsApiError('Failed to initialize user action signing');
      }

      logger.info('User action signing initialized', {
        challengeIdentifier: response.data.challengeIdentifier,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to initialize user action signing', { error });
      throw error;
    }
  }

  async signUserAction(
    challengeIdentifier: string,
    firstFactor?: any,
    secondFactor?: any
  ): Promise<any> {
    try {
      const response = await this.dfnsClient.post('/auth/action/sign', {
        challengeIdentifier,
        firstFactor,
        secondFactor,
      });

      if (!response.success || !response.data) {
        throw new DfnsApiError('Failed to sign user action');
      }

      logger.info('User action signed successfully', { challengeIdentifier });

      return response.data;
    } catch (error) {
      logger.error('Failed to sign user action', { error, challengeIdentifier });
      throw error;
    }
  }

  async executeWithUserActionSigning<T>(
    userActionPayload: string,
    userActionHttpMethod: string,
    userActionHttpPath: string,
    signatureData: UserActionSignature
  ): Promise<T> {
    try {
      const challenge = await this.initUserActionSigning(
        userActionPayload,
        userActionHttpMethod,
        userActionHttpPath
      );

      const signedAction = await this.signUserAction(
        challenge.challengeIdentifier,
        signatureData.firstFactor,
        signatureData.secondFactor
      );

      const response = await this.dfnsClient.request<T>(
        userActionHttpMethod,
        userActionHttpPath,
        JSON.parse(userActionPayload),
        {
          'X-DFNS-USERACTION': signedAction.userAction,
        }
      );

      if (!response.success) {
        throw new DfnsApiError('Failed to execute user action');
      }

      return response.data!;
    } catch (error) {
      logger.error('Failed to execute user action with signing', { error });
      throw error;
    }
  }
}
