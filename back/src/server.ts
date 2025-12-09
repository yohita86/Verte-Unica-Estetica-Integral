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

const corsConfig = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const whitelist = [
            process.env.FRONTEND_URL || "https://verte-unica-estetica-integral.onrender.com",
            "http://localhost:5173",
            "http://localhost:3000"
        ];
        
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS blocked"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["set-cookie"]
};

// CORS para TODAS las rutas
server.use(cors(corsConfig));

// Preflight con la misma config
server.options("*", cors(corsConfig));

server.use(express.json());
server.use(morgan("dev"));
server.use(cookieParser());

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

// Ruta raíz
server.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

server.use(router);
server.use(errorMiddleware);

export default server;
