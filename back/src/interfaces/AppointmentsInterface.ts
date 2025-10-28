export interface Appointment {
    id: number
    date: Date
    time: string
    userId: number
    status: Status
}

export enum Status {
    Active = "active",
    Cancelled = "cancelled"
}

export interface BusinessHours {
    start: string;  // formato "HH:mm"
    end: string;    // formato "HH:mm"
}

export interface BusinessConfig {
    hours: BusinessHours;
    workingDays: number[];  // 0 = domingo, 1 = lunes, ..., 6 = sábado
    cancellationDeadline: number;  // horas antes de la cita para permitir cancelación
}

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
    hours: {
        start: "09:00",
        end: "18:00"
    },
    workingDays: [1, 2, 3, 4, 5],  // Lunes a Viernes
    cancellationDeadline: 24  // 24 horas antes
};