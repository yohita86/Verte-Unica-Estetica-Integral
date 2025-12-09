import express, { Application } from "express";
import "reflect-metadata";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const server: Application = express();

// 👉 CORS CORRECTO PARA PRODUCCIÓN
server.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            "http://localhost:5173"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["set-cookie"]
    })
);

// 👉 MUY IMPORTANTE: responder preflight ANTES DE TODO
server.options("*", cors());

// Middlewares básicos
server.use(express.json());
server.use(morgan("dev"));
server.use(cookieParser());

// 👉 CONFIG DE SESIÓN (segura para Render)
server.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecreto",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// 👉 Tus rutas
server.use(router);

// 👉 Manejo de errores
server.use(errorMiddleware);

export default server;
