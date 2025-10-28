import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './MisTurnos.module.css';
import NoAppointments from './NoAppointments';
import Swal from 'sweetalert2';

const SERVICES = [
    { id: 1, name: "Cosmetología", duration: "90 min" },
    { id: 2, name: "Lifting de pestañas", duration: "60 min" },
    { id: 3, name: "Perfilado de cejas", duration: "30 min" },
    { id: 4, name: "Depilación definitiva", duration: "30 min" },
    { id: 5, name: "Maderoterapia", duration: "60 min" },
    { id: 6, name: "Extensión de pestañas", duration: "90 min" }
];

const MisTurnos = () => {
    const navigate = useNavigate();
    const {
        user,
        appointments,
        fetchUserAppointments,
        cancelAppointment
    } = useUser();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAppointments = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                await fetchUserAppointments(user.id);
            } catch (err) {
                console.error('Error al cargar los turnos:', err);
                setError(err.message || 'No se pudieron cargar los turnos');
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, [user, fetchUserAppointments, navigate]);

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await cancelAppointment(appointmentId);
            Swal.fire({
                icon: "success",
                title: "¡Turno cancelado exitosamente!",
                text: "El turno ha sido cancelado.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error('Error al cancelar el turno:', err);
            const errorMessage = err.message || 'No se pudo cancelar el turno';
            Swal.fire({
                icon: "error",
                title: "Error al cancelar",
                text: errorMessage,
            });
            setError(errorMessage);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Cargando turnos...</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mis Turnos</h2>
            
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.appointmentsList}>
                {appointments.length > 0 ? (
                    appointments.map((appointment) => {
                        const isCancelled = appointment.status?.toLowerCase() === 'cancelled';
                        const fechaUTC = new Date(appointment.date);
                        const fechaFormateada = `${fechaUTC.getUTCDate()}/${fechaUTC.getUTCMonth() + 1}/${fechaUTC.getUTCFullYear()}`;
                        const servicio = SERVICES.find(s => s.id === appointment.service?.id);

                        return (
                            <div
                                key={appointment.id}
                                className={`${styles.appointmentCard} ${isCancelled ? styles.cancelledCard : ''}`}
                            >
                                <div className={styles.appointmentInfo}>
                                    <h3>{appointment.service?.name || "Servicio"}</h3>
                                    <p><strong>Fecha:</strong> {fechaFormateada}</p>
                                    <p><strong>Hora:</strong> {appointment.time}</p>
                                    <p><strong>Duración:</strong> {servicio?.duration || 'N/A'}</p>
                                    <p>
                                        <strong>Estado:</strong>{' '}
                                        <span className={isCancelled ? styles.statusCancelled : styles.statusActive}>
                                            {appointment.status}
                                        </span>
                                    </p>
                                </div>
                                {!isCancelled && (
                                    <button
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                        className={styles.cancelButton}
                                    >
                                        Cancelar Turno
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <NoAppointments />
                )}
            </div>
        </div>
    );
};

export default MisTurnos;
