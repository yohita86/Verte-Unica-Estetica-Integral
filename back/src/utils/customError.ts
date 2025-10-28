export class CustomError extends Error {
    public status: number;
    public code: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.code = status; // Para compatibilidad
        this.name = "CustomError";
    }
}