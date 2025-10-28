// routes/index.ts
import { Router, Request, Response } from 'express';
import userRouter from './userRouter';
import appointmentRouter from './appointmentRouter';
import authRouter from './authRouter'; 
import serviceRouter from "./serviceRouter";
import { transporter } from '../utils/mailer';
import { catchErrors } from '../utils/catchErrors';

const router: Router = Router();

router.use("/users", userRouter);
router.use("/turns", appointmentRouter);
router.use("/auth", authRouter); // ✅ Ruta para login
router.use("/services", serviceRouter);

const sendEmailController = async (req: Request, res: Response): Promise<void> => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        res.status(400).json({ 
            message: "El destinatario, asunto y mensaje son requeridos." 
        });
        return;
    }

    await transporter.sendMail({
        from: `"Verte Única" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
            <h3>Has recibido un nuevo mensaje de contacto desde tu web:</h3>
            <p><strong>De:</strong> ${to}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
        `,
    });
    
    res.status(200).json({ 
        message: "Email enviado exitosamente." 
    });
};

router.post("/api/send-email", catchErrors(sendEmailController));

export default router;
