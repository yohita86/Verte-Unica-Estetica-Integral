import { Request, Response } from "express";
import { AppointmentRegisterDTO } from "../dtos/AppointmentDto";
import {
    cancelStatusAppointmentService,
    getAppointmentByIdService,
    getAppointmentService,
    registerAppointmentService,
    getAppointmentsForUserService,
    getAppointmentsByUserIdService,
} from "../services/appointmentServices";
import { catchErrors } from "../utils/catchErrors";

    const getAppointmentsController = async (
    req: Request,
    res: Response
    ): Promise<void> => {
    const response = await getAppointmentService();
    res.status(200).json({
        message: "Obtener el listado de todos los turnos de todos los usuarios",
        data: response,
    });
    };

    const getAppointmentByIdController = async (
    req: Request<{ id: string }>,
    res: Response
    ): Promise<void> => {
    const { id } = req.params;
    const response = await getAppointmentByIdService(id);
    res.status(200).json({
        message: `Detalle del turno con ID: ${id}`,
        data: response,
    });
    };

const registerAppointmentController = async (
    req: Request<unknown, unknown, AppointmentRegisterDTO>,
    res: Response
): Promise<void> => {
    const { date, time, userId, serviceId } = req.body;

    // Validación básica de campos vacíos
    if (!date || !time || !userId || !serviceId) {
        throw new Error("Faltan datos obligatorios para registrar el turno.");
    }

    // Validar que la fecha esté en formato válido
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (isNaN(appointmentDateTime.getTime())) {
        throw new Error("Fecha u hora no válidas");
    }

    // Validar que la fecha no sea pasada
    if (appointmentDateTime <= now) {
        throw new Error("El turno debe ser en una fecha y hora futura");
    }

    const response = await registerAppointmentService({
        date,
        time,
        userId,
        serviceId,
    });

    res.status(201).json({
        message: "Turno creado con éxito",
        data: response,
    });
};

    const getAppointmentsForLoggedUser = async (
    req: Request & { session: any },
    res: Response
): Promise<void> => {
    const user = req.session.user;
    if (!user) {
        res.status(401).json({ message: "No autorizado, por favor logueate." });
        return;
    }
    const appointments = await getAppointmentsForUserService(user.id);
    res.status(200).json({ message: "Turnos del usuario", data: appointments });
};

    // NUEVO controlador para obtener turnos por id de usuario (ruta /turns/user/:id)
    const getAppointmentsByUserIdController = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ message: "ID de usuario inválido" });
        return;
    }
    const appointments = await getAppointmentsByUserIdService(userId);
    res.status(200).json({ message: "Turnos por usuario", data: appointments });
};

const cancelStatusAppointmentController = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const response = await cancelStatusAppointmentService(id);
    res.status(200).json({
        message: `Turno con ID: ${id} cancelado exitosamente`,
        data: response,
    });
};

const appointmentControllers = {
    getAppointmentsController: catchErrors(getAppointmentsController),
    getAppointmentByIdController: catchErrors(getAppointmentByIdController),
    registerAppointmentController: catchErrors(registerAppointmentController),
    cancelStatusAppointmentController: catchErrors(cancelStatusAppointmentController),
    getAppointmentsForLoggedUser: catchErrors(getAppointmentsForLoggedUser),
    getAppointmentsByUserIdController: catchErrors(getAppointmentsByUserIdController),
};

export default appointmentControllers;
