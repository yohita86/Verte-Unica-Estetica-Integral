declare module "express";
declare module "express-session";
declare module "cookie-parser";
declare module "cors";
declare module "morgan";
declare module "multer";
declare module "nodemailer";

// Esto evita errores por req/file/cb con tipo implícito
declare namespace Express {
  export interface Request {}
}
