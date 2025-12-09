import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const sendEmail = async ({ to, subject, message }) => {
    const response = await axios.post(
        `${API_URL}/api/send-email`,
        { to, subject, message },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};
