export class DfnsApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'DfnsApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class AuthenticationError extends DfnsApiError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends DfnsApiError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends DfnsApiError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class SigningError extends DfnsApiError {
  constructor(message: string = 'Request signing failed', details?: any) {
    super(message, 400, 'SIGNING_ERROR', details);
    this.name = 'SigningError';
  }
}

export class NetworkError extends DfnsApiError {
  constructor(message: string = 'Network error occurred', details?: any) {
    super(message, 503, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}
