import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Styles from "./Turno.module.css";

function Turno({ id, date, Time, status }) {
    const { cancelAppointment } = useContext(UserContext);
    const [error, setError] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        if (window.confirm("¿Estás segura de cancelar este turno?")) {
            try {
                setError("");
                setIsCancelling(true);
                await cancelAppointment(id);
            } catch (error) {
                setError(error.message || "Error al cancelar el turno");
            } finally {
                setIsCancelling(false);
            }
        }
    };

    const isCancelled = status === "Cancelled";
    const formattedDate = new Date(date).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={`${Styles.card} ${Styles[status.toLowerCase()]}`}>
            <h3>Turno #{id}</h3>
            <p><strong>Fecha:</strong> {formattedDate}</p>
            <p><strong>Hora:</strong> {Time}</p>
            <p className={Styles[status.toLowerCase()]}>
                <strong>Estado:</strong> {status}
            </p>
            {error && <p className={Styles.error}>{error}</p>}
            {!isCancelled && (
                <button
                    onClick={handleCancel}
                    className={Styles.deleteTurno}
                    disabled={isCancelling}
                >
                    {isCancelling ? "Cancelando..." : "Cancelar"}
                </button>
            )}
        </div>
    );
}

export default Turno;