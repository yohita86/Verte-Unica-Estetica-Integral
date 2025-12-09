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
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// 👉 Header necesario para cookies cross-site
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// 👉 Manejo de preflight OPTIONS
server.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// Rutas
server.use(router);

// Middleware de errores
server.use(errorMiddleware);

export default server;
