import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        const { error } = schema.body.validate(req.body);
        if (error) {
          throw new ValidationError(`Body validation failed: ${error.details[0].message}`);
        }
      }

      if (schema.query) {
        const { error } = schema.query.validate(req.query);
        if (error) {
          throw new ValidationError(`Query validation failed: ${error.details[0].message}`);
        }
      }

      if (schema.params) {
        const { error } = schema.params.validate(req.params);
        if (error) {
          throw new ValidationError(`Params validation failed: ${error.details[0].message}`);
        }
      }

      next();
    } catch (error) {
      logger.error('Request validation failed', { error, path: req.path });
      next(error);
    }
  };
};

export const commonSchemas = {
  id: Joi.string().required(),
  orgId: Joi.string().required(),
  pagination: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    paginationToken: Joi.string().optional(),
  }),
  walletId: Joi.string().required(),
  keyId: Joi.string().required(),
  network: Joi.string().required(),
};
