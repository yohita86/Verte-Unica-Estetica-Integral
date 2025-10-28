import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    saveUserToLocalStorage,
    getUserFromLocalStorage,
    saveAppointmentsToLocalStorage,
    getAppointmentsFromLocalStorage
} from "../helpers/LocalStorage";

const API_URL = 'http://localhost:3000';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Configuración base de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Aceptar respuestas entre 200 y 499
    }
});

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Error de respuesta:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error('Error de red:', error.request);
            return Promise.reject({ message: 'Error de conexión. Por favor, verifica tu conexión a internet.' });
        } else {
            console.error('Error:', error.message);
            return Promise.reject({ message: 'Error al procesar la petición.' });
        }
    }
);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => getUserFromLocalStorage());
    const [appointments, setAppointments] = useState(() => getAppointmentsFromLocalStorage());
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        saveUserToLocalStorage(user);
    }, [user]);

    useEffect(() => {
        saveAppointmentsToLocalStorage(appointments);
    }, [appointments]);

    const extractErrorMessage = (error) => {
        // Si es un error de respuesta HTTP
        if (error.response?.data) {
            const errorData = error.response.data;
            
            // Si es un string que contiene CustomError
            if (typeof errorData === 'string' && errorData.includes('CustomError:')) {
                const match = errorData.match(/CustomError: (.*?)<br>/);
                if (match) {
                    return match[1].trim();
                }
            }
            
            // Si es un objeto con message
            if (typeof errorData === 'object' && errorData.message) {
                return errorData.message;
            }
            
            // Si es un string directo
            if (typeof errorData === 'string') {
                return errorData;
            }
        }
        
        // Si es un error directo con message
        if (error.message) {
            return error.message;
        }
        
        return 'Error al procesar la solicitud';
    };

    const loginUser = async (values) => {
        try {
            setLoadingUser(true);
            const res = await api.post("/users/login", values);
            setUser(res.data.user);
            await fetchUserAppointments(res.data.user.id);
            return res.data;
        } catch (error) {
            console.error("Error en login:", error);
            const errorMessage = extractErrorMessage(error);
            throw new Error(errorMessage);
        } finally {
            setLoadingUser(false);
        }
    };

    const registerUser = async (userData) => {
        try {
            setLoadingUser(true);
            const response = await api.post("/users/register", userData);
            return response.data;
        } catch (error) {
            console.error('Error en registro:', error);
            const errorMessage = extractErrorMessage(error);
            throw new Error(errorMessage);
        } finally {
            setLoadingUser(false);
        }
    };

    const logoutUser = () => {
        setUser(null);
        setAppointments([]);
    };

    const fetchUserAppointments = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const res = await api.get(`/turns/user/${userId}`);
            setAppointments(res.data.data || []);
        } catch (error) {
            console.error("Error al obtener turnos:", error);
            throw error;
        }
    }, []);

    const cancelAppointment = useCallback(async (appointmentId) => {
        try {
            const response = await api.put(`/turns/${appointmentId}/cancel`);
            if (response.status === 200) {
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appt) =>
                    appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
                    )
                );
                return { success: true, message: "Turno cancelado exitosamente" };
            } else {
                throw new Error(response.data.message || "Error al cancelar el turno");
            }
        } catch (error) {
            console.error("Error al cancelar el turno:", error);
            throw error;
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loginUser,
                registerUser,
                logoutUser,
                appointments,
                fetchUserAppointments,
                cancelAppointment,
                loadingUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export { UserContext };
