import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { HttpException } from '../utils/HttpException';

export function validationMiddleware<T extends object>(type: ClassConstructor<T>, skipMissingProperties = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dtoObj = plainToClass(type, req.body);
            const errors: ValidationError[] = await validate(dtoObj, { skipMissingProperties });

            if (errors.length > 0) {
                const messages = errors.map((error: ValidationError) => {
                    return {
                        property: error.property,
                        constraints: error.constraints,
                    };
                });

                throw new HttpException(400, 'Validation failed', { messages });
            }

            req.body = dtoObj;
            next();
        } catch (error) {
            next(error);
        }
    };
} 