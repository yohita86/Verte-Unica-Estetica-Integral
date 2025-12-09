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

// 👉 CORS COMPLETO Y ANTES DE TODO
server.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
    })
);

// 👉 Manejo de preflight (evita 500 en OPTIONS)
server.options("*", (req, res) => {
    res.sendStatus(204);
});

// Middlewares
server.use(express.json());
server.use(morgan("dev"));
server.use(cookieParser());

// 👉 Sesiones SIEMPRE después de CORS
server.use(
    session({
        secret: "mi-secreto-seguro",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        },
    })
);

// Rutas
server.use(router);

// Middleware de errores
server.use(errorMiddleware);

export default server;
