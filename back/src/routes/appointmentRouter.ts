import { Router } from 'express'
import appointmentControllers from '../controllers/appointmentControllers'
import { validateAppointmentRegisterData } from '../middlewares'

const appointmentRouter: Router = Router()

// Obtener todos los turnos
appointmentRouter.get("/", appointmentControllers.getAppointmentsController)

// Obtener turno por id
appointmentRouter.get("/:id", appointmentControllers.getAppointmentByIdController)

// Obtener turnos de un usuario por id (PARÁMETRO)
appointmentRouter.get("/user/:id", appointmentControllers.getAppointmentsByUserIdController)

// Para obtener turnos del usuario logueado (usando sesión o token)
appointmentRouter.get("/user", appointmentControllers.getAppointmentsForLoggedUser)

// Registrar turno
appointmentRouter.post("/schedule", 
    validateAppointmentRegisterData,
    appointmentControllers.registerAppointmentController
)

// Cancelar turno (PUT /turns/:id/cancel)
appointmentRouter.put("/:id/cancel", appointmentControllers.cancelStatusAppointmentController)

export default appointmentRouter
