
    export const saveUserToLocalStorage = (user) => {
    localStorage.setItem("loggedUser", JSON.stringify(user));
    };

export function getUserFromLocalStorage() {
    try {
        const userStr = localStorage.getItem("loggedUser");
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (error) {
        console.error("Error leyendo el usuario desde localStorage", error);
        return null;
    }
}

    export const saveAppointmentsToLocalStorage = (appointments) => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
    };

    export const getAppointmentsFromLocalStorage = () => {
    const stored = localStorage.getItem("appointments");
    return stored ? JSON.parse(stored) : [];
    };
