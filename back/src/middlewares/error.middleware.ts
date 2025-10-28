import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
    status?: number;
    code?: number;
    errors?: unknown;
}

export function errorMiddleware(error: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
    // Soporta tanto HttpException (status) como CustomError (code)
    const status = error.status || error.code || 500;
    const message = error.message || 'Something went wrong';
    const errors = error.errors || null;

    res.status(status).json({
        status,
        message,
        errors,
    });
} 