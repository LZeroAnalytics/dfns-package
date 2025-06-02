import { Request, Response, NextFunction } from 'express';
import { DfnsApiError, AuthenticationError, ValidationError, SigningError, NetworkError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof ValidationError) {
    res.status((error as ValidationError).statusCode).json({
      success: false,
      error: {
        code: (error as ValidationError).code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    res.status((error as AuthenticationError).statusCode).json({
      success: false,
      error: {
        code: (error as AuthenticationError).code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof SigningError) {
    res.status((error as SigningError).statusCode).json({
      success: false,
      error: {
        code: (error as SigningError).code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof NetworkError) {
    res.status((error as NetworkError).statusCode).json({
      success: false,
      error: {
        code: (error as NetworkError).code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof DfnsApiError) {
    res.status((error as DfnsApiError).statusCode).json({
      success: false,
      error: {
        code: (error as DfnsApiError).code,
        message: error.message,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};
