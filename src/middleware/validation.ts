import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ModifiedRequest } from '../types/index';

export const validate = (schema: Joi.ObjectSchema) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errorMessages,
        });
    }

    req.body = value;
    next();
};

export const validateParams = (schema: Joi.ObjectSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errorMessages,
        });
    }

    req.params = value;
    next();
};

export const validateQuery = (schema: Joi.ObjectSchema) => (
    req: ModifiedRequest,
    res: Response,
    next: NextFunction
) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
   
    if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errorMessages,
        });
    }

    req.validatedQuery = value;
    next();
};
