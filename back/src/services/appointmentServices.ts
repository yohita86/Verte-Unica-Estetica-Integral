import { AppointmentRegisterDTO } from "../dtos/AppointmentDto";
import { Appointment } from "../entities/Appointment.Entity";
import { Status } from "../interfaces/AppointmentsInterface";
import { AppointmentRepository } from "../repositories/Appointment.Repository";
import { CustomError } from "../utils/customError";
import { AppDataSource } from "../config/data.source";
import { Service } from "../entities/Service";

export const registerAppointmentService = async (
    appointment: AppointmentRegisterDTO
    ): Promise<Appointment> => {
    try {
        const serviceRepo = AppDataSource.getRepository(Service);
        const service = await serviceRepo.findOneBy({ id: appointment.serviceId });

        if (!service) {
        throw new CustomError(404, "Servicio no encontrado.");
        }

        const [year, month, day] = appointment.date.split('-').map(Number);
        const [hour, minute] = appointment.time.split(':').map(Number);
        const appointmentDate = new Date(year, month - 1, day, hour, minute);

        // Validaciones
        AppointmentRepository.validateAllowAppointment(appointment.date, appointment.time);
        await AppointmentRepository.validateExistingAppoint(
        appointment.userId,
        appointment.date,
        appointment.time
        );

        const newAppointment = AppointmentRepository.create({
        date: appointmentDate,
        time: appointment.time,
        user: { id: appointment.userId },
        status: Status.Active,
        service,
        });

        const savedAppointment = await AppointmentRepository.save(newAppointment);
        return savedAppointment;
    } catch (error) {
        console.error("Error al registrar la cita:", error);
        throw error;
    }
    };

    export const getAppointmentService = async (): Promise<Appointment[]> => {
    const appointments = await AppointmentRepository.find();
    if (appointments.length > 0) return appointments;
    else throw new CustomError(404, "No hay citas registradas.");
    };

    export const getAppointmentByIdService = async (id: string): Promise<Appointment> => {
    const appointmentFound = await AppointmentRepository.findOne({
        where: { id: parseInt(id, 10) },
    });

    if (!appointmentFound) throw new CustomError(404, `La cita con id ${id} no fue encontrada.`);
    return appointmentFound;
    };

    export const cancelStatusAppointmentService = async (id: string): Promise<Appointment> => {
    const appointmentFound = await AppointmentRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["user"],
    });

    if (!appointmentFound) throw new CustomError(404, `La cita con id ${id} no fue encontrada.`);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const appointmentDate = new Date(appointmentFound.date);
    appointmentDate.setUTCHours(0, 0, 0, 0);

    if (appointmentDate <= today) {
        throw new CustomError(400, "Los turnos solo se pueden cancelar hasta el día anterior.");
    }

    appointmentFound.status = Status.Cancelled;
    const savedAppointment = await AppointmentRepository.save(appointmentFound);

    return savedAppointment;
    };

    export const getAppointmentsForUserService = async (
    userId: number
    ): Promise<Appointment[]> => {
    const appointments = await AppointmentRepository.find({
        where: { user: { id: userId } },
    });

    return appointments;
    };

    export const getAppointmentsByUserIdService = async (
    userId: number
    ): Promise<Appointment[]> => {
    const appointments = await AppointmentRepository.find({
        where: { user: { id: userId } },
        relations: ["user", "service"],
    });
    return appointments;
};
