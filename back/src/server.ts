import express, { Application } from "express";
import "reflect-metadata";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppDataSource } from "./config/data.source";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const server: Application = express();

// Middlewares
server.use(express.json());
server.use(morgan("dev"));
server.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

server.use(cookieParser());

// Middleware de sesión
server.use(session({
    secret: "mi-secreto-seguro",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Rutas
server.use(router);

// Middleware de errores
server.use(errorMiddleware);

export default server;
