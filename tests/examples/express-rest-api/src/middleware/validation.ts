import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * User validation schemas
 */
export const userSchemas = {
  create: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required',
    }),
  }),

  update: Joi.object({
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address',
    }),
    name: Joi.string().min(2).max(100).messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
    }),
  }).min(1),
};

/**
 * Post validation schemas
 */
export const postSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('', null).optional(),
    published: Joi.boolean().optional(),
    authorId: Joi.string().uuid().required().messages({
      'string.uuid': 'Author ID must be a valid UUID',
      'any.required': 'Author ID is required',
    }),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200).messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters',
    }),
    content: Joi.string().allow('', null),
    published: Joi.boolean(),
  }).min(1),
};

/**
 * UUID parameter validation
 */
export const validateUUID = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    const schema = Joi.string().uuid();
    const { error } = schema.validate(id);

    if (error) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName}`,
        message: `${paramName} must be a valid UUID`,
      });
    }

    next();
  };
};
