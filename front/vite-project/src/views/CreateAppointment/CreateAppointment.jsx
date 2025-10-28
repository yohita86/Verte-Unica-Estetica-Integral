import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './CreateAppointment.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000';

const SERVICES = [
    { id: 1, name: "Cosmetología", duration: "90 min" },
    { id: 2, name: "Lifting de pestañas", duration: "60 min" },
    { id: 3, name: "Perfilado de cejas", duration: "30 min" },
    { id: 4, name: "Depilación definitiva", duration: "30 min" },
    { id: 5, name: "Maderoterapia", duration: "60 min" },
    { id: 6, name: "Extensión de pestañas", duration: "90 min" }
];

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

const CreateAppointment = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        serviceId: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeSlots] = useState(generateTimeSlots());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.date || !formData.time || !formData.serviceId) {
            setError('Por favor complete todos los campos');
            return;
        }

        const selectedService = SERVICES.find(s => s.id === parseInt(formData.serviceId));
        if (!selectedService) {
            setError('Servicio no válido');
            return;
        }

        const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
        const now = new Date();

        if (appointmentDateTime <= now) {
            setError('La fecha y hora deben ser futuras');
            return;
        }

        const [hourStr, minuteStr] = formData.time.split(':');
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        if (hour < 8 || (hour >= 20 && minute > 0)) {
            setError('El turno debe estar dentro del horario hábil (08:00 a 20:00)');
            return;
        }

        try {
            setLoading(true);

            const appointmentData = {
                date: formData.date, 
                time: formData.time,
                userId: user.id,
                serviceId: selectedService.id
            };
            console.log('Datos enviados para turno:', appointmentData);

            const response = await axios.post(`${API_URL}/turns/schedule`, appointmentData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "¡Turno creado exitosamente!",
                    text: "Serás redirigido a tus turnos.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setFormData({ date: '', time: '', serviceId: '' });
                setTimeout(() => {
                    navigate('/MisTurnos');
                }, 2000);
            } else {
                throw new Error(response.data?.error || 'Error inesperado al crear el turno');
            }
        } catch (error) {
            console.error('Error al crear turno:', error);
            const errorMessage = error?.response?.data?.message || error.message || 'Error desconocido';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Crear Turno</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Fecha</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Horario</label>
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.select}
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un horario</option>
                            {timeSlots.map((timeSlot) => (
                                <option key={timeSlot} value={timeSlot}>
                                    {timeSlot}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Servicio</label>
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.select}
                            value={formData.serviceId}
                            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un servicio</option>
                            {SERVICES.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} ({service.duration})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button 
                    type="submit" 
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Creando turno...' : 'Crear Turno'}
                </button>
            </form>
        </div>
    );
};

export default CreateAppointment;
