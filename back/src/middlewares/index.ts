import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";

export const validateUserRegisterData = (req: Request, res: Response, next: NextFunction): void => {
    const campos: string[] = ["birthdate", "email", "nDni", "name", "password","username"]
    const camposFiltrados: string[] = campos.filter(campo => !req.body[campo])
    if(camposFiltrados.length > 0){
        return next(new CustomError(400, `Falta información para poder crear el usuario: ${camposFiltrados.join(",")}`));
    }   else next()
}

export const validateAppointmentRegisterData = (req: Request, res: Response, next: NextFunction): void => {
    const campos: string[] = ["date", "time", "userId"]
    const camposFiltrados: string[] = campos.filter(campo => !req.body[campo])
    if(camposFiltrados.length > 0){
        return next(new CustomError(400, `Falta información para poder crear la cita: ${camposFiltrados.join(",")}`));
    }   else next()
}