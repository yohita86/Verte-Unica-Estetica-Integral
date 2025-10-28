import nodemailer from "nodemailer";

    export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // e.g. tuemail@gmail.com
        pass: process.env.MAIL_PASS, // contraseña o App Password
    },
    });

    export const sendAppointmentEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: `"Verte Única" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
    };
