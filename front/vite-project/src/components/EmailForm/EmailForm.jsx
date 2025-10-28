import React, { useState } from "react";
import { sendEmail } from "../../services/emailService";
import styles from "./EmailForm.module.css";
import Swal from "sweetalert2";

export default function EmailForm() {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Enviando email:", { to, subject, message });
            const response = await sendEmail({ to, subject, message });
            console.log("Respuesta del servidor:", response);
            
            Swal.fire({
                icon: "success",
                title: "¡Email enviado exitosamente!",
                text: "Nos pondremos en contacto contigo pronto.",
                timer: 3000,
                showConfirmButton: false,
            });
            
            setTo("");
            setSubject("");
            setMessage("");
        } catch (err) {
            console.error("Error completo al enviar email:", err);
            const errorMessage = err.response?.data?.message || err.message || "Error al enviar el correo";
            
            Swal.fire({
                icon: "error",
                title: "Error al enviar",
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={`${styles.glass} ${styles.glassHover}`}>
                <h2>Contáctanos</h2>
                <p className={styles.description}>
                    ¿Tienes alguna pregunta? Envíanos un mensaje y te responderemos pronto.
                </p>
                
                <input
                    type="email"
                    placeholder="Tu email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className={styles.input}
                />
                
                <input
                    type="text"
                    placeholder="Asunto"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className={styles.input}
                />
                
                <textarea
                    placeholder="Tu mensaje"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className={styles.textarea}
                />
                
                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                </button>
            </form>
        </div>
    );
}
