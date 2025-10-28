export class HttpException extends Error {
    public status: number;
    public message: string;
    public errors?: Record<string, unknown>;

    constructor(status: number, message: string, errors?: Record<string, unknown>) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
} 