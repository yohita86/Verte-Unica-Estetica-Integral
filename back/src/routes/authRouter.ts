// routes/authRouter.ts
import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  // Aquí pondrías la lógica real con tu controlador de login
    res.status(200).json({ message: 'Login endpoint funcionando' });
});

export default authRouter;
