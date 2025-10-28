import { Router } from "express";
import { getServicesController } from "../controllers/serviceController";

const serviceRouter = Router();

serviceRouter.get("/", getServicesController);

export default serviceRouter;
