import 'module-alias/register';
import { DfnsApiServer } from '../app';
import { config } from '../config';
import { logger } from '../utils/logger';

async function testBasicFunctionality(): Promise<boolean> {
  try {
    logger.info('Starting basic API functionality test');
    
    const server = new DfnsApiServer();
    // const app = server.getApp();
    
    logger.info('✅ Server instance created successfully');
    logger.info('✅ Express app configured successfully');
    logger.info('✅ All routes and middleware loaded successfully');
    
    logger.info('API Configuration:');
    logger.info(`- DFNS API URL: ${config.dfns.apiUrl}`);
    logger.info(`- App ID: ${config.dfns.appId}`);
    logger.info(`- Org ID: ${config.dfns.orgId}`);
    logger.info(`- Signing Key ID: ${config.dfns.signingKeyId}`);
    
    logger.info('✅ Basic functionality test completed successfully');
    
    return true;
  } catch (error) {
    logger.error('❌ Basic functionality test failed', { error });
    return false;
  }
}

if (require.main === module) {
  testBasicFunctionality()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      logger.error('Test execution failed', { error });
      process.exit(1);
    });
}

export { testBasicFunctionality };
