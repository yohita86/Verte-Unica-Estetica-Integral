import { Appointment } from "../entities/Appointment.Entity";
import { AppDataSource } from "../config/data.source";
import { CustomError } from "../utils/customError";

export const AppointmentRepository = AppDataSource.getRepository(Appointment).extend({
    validateAllowAppointment: function(date: Date | string, time: string): void {
    // Asegurar que date sea string en formato YYYY-MM-DD
    let dateString: string;
    if (date instanceof Date) {
        // Formato YYYY-MM-DD
        dateString = date.toISOString().split('T')[0];
    } else {
        dateString = date;
    }
    // Parsear manualmente la fecha y hora para crear una fecha local
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    // Crear la fecha local exacta (sin desfase UTC)
    const appointmentDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    // Validar que la fecha no sea anterior a hoy
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const appointmentDateOnly = new Date(year, month - 1, day);
    if (appointmentDateOnly < now) {
        throw new CustomError(400, "No puedes agendar turnos en fechas pasadas.");
    }
    // Validar que la fecha sea al menos 24 horas en el futuro
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (appointmentDateOnly < tomorrow) {
        throw new CustomError(400, "Los turnos deben agendarse con al menos 24 horas de anticipación.");
    }
    // Validar que no sea sábado (6) ni domingo (0)
    const dayOfWeek = appointmentDateOnly.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        throw new CustomError(400, "No se pueden agendar turnos los fines de semana.");
    }
    // Validar horario (8:00 a 19:30)
    if (hours < 8 || (hours === 19 && minutes > 30) || hours > 19) {
        throw new CustomError(400, "Los turnos solo pueden agendarse entre las 8:00 y las 19:30.");
    }
},

    validateExistingAppoint: async function(userId: number, date: string, time: string): Promise<void> {
        const existingAppointment = await this.findOne({
            where: {
                user: { id: userId },
                date: new Date(date),
                time: time
            }
        });

        if (existingAppointment) {
            throw new CustomError(409, "Ya tienes un turno agendado para esta fecha y hora.");
        }
    }
});
