import { Request, Response, NextFunction } from "express"

export const catchErrors = <Params, ResBody, ReqBody> (controlador: (req: Request<Params, ResBody, ReqBody>, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request<Params, ResBody, ReqBody>, res: Response, next: NextFunction) => {
        controlador(req, res, next)
            .catch(error => next(error))
            }  
    }