import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
    status?: number;
    code?: number | string;
    errors?: unknown;
}

export function errorMiddleware(error: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
    // Solo aceptamos códigos numéricos válidos
    let status = 500;

    if (typeof error.status === "number") {
        status = error.status;
    } else if (typeof error.code === "number") {
        status = error.code;
    }

    const message = error.message || "Something went wrong";
    const errors = error.errors || null;

    res.status(status).json({
        status,
        message,
        errors,
    });
}
