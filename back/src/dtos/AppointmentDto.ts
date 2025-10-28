import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class AppointmentRegisterDTO {
    @IsNotEmpty({ message: "La fecha es requerida" })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de fecha debe ser YYYY-MM-DD" })
    date: string;

    @IsNotEmpty({ message: "La hora es requerida" })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "El formato de hora debe ser HH:mm" })
    time: string;

    @IsNotEmpty({ message: "El ID del servicio es requerido" })
    @IsNumber({}, { message: "El ID del servicio debe ser un número" })
    serviceId: number;

    @IsNotEmpty({ message: "El ID del usuario es requerido" })
    @IsNumber({}, { message: "El ID del usuario debe ser un número" })
    userId: number;
}

export class CancelAppointmentDto {
    @IsNotEmpty({ message: "El ID del turno es requerido" })
    @IsNumber({}, { message: "El ID del turno debe ser un número" })
    id: number;
}
