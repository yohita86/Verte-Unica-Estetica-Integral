import { Router, Request, Response } from 'express'
import userControllers from '../controllers/userControllers'
import { UserLoginDto, UserRegisterDto } from '../dtos/UserDTO'
import { validationMiddleware } from '../middlewares/validation.middleware'
import { upload } from '../middlewares/uploadMiddlewares'

const userRouter: Router = Router()

userRouter.get("/", userControllers.getUsersController)

userRouter.get("/:id", userControllers.getUserByIdController)

userRouter.post("/register", 
    validationMiddleware(UserRegisterDto), 
    userControllers.registerUserController)

userRouter.post("/login", 
    validationMiddleware(UserLoginDto), 
    userControllers.loginUserController as any)

userRouter.post(
    "/upload-photo",
    upload.single("photo"),
    ((req, res) => {
        const file = req.file as Express.Multer.File | undefined;

        if (!file) {
            return res.status(400).json({ message: "No se recibió ninguna imagen." });
        }

        const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
        return res.status(200).json({ imageUrl });
    }) as (req: Request, res: Response) => void
)

export default userRouter
