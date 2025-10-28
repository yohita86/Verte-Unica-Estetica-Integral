import axios from "axios";

export const sendEmail = async ({ to, subject, message }) => {
    const response = await axios.post(
        "http://localhost:3000/api/send-email",
        { to, subject, message },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};
