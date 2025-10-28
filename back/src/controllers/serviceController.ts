import { Request, Response } from "express";
import { getAllServices } from "../services/serviceService";

export const getServicesController = async (req: Request, res: Response) => {
    const services = await getAllServices();
    res.json(services);
};
