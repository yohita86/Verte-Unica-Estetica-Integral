import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import styles from "./Register.module.css";
import { useUser } from "../../context/UserContext";

const Register = () => {
    const navigate = useNavigate();
    const { registerUser } = useUser();

    // Validación manual: recibe values, devuelve objeto { campo: mensaje }
    const validate = (values) => {
        const errors = {};

        // Validación de nombre
        if (!values.name || values.name.trim().length < 2) {
            errors.name = "El nombre debe tener al menos 2 caracteres";
        }

        // Validación de username
        if (!values.username || values.username.trim().length < 4) {
            errors.username = "El nombre de usuario debe tener al menos 4 caracteres";
        }

        // Validación de email
        if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = "Formato de email inválido";
        }

        // Validación de contraseña
        if (!values.password || values.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres";
        } else if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(values.password)) {
            errors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
        }

        // Validación de confirmación de contraseña
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        // Validación de fecha
        if (!values.birthdate) {
            errors.birthdate = "La fecha de nacimiento es requerida";
        } else {
            const birthdate = new Date(values.birthdate);
            if (isNaN(birthdate.getTime())) {
                errors.birthdate = "Fecha de nacimiento inválida";
            }
        }

        // Validación de DNI
        if (!values.nDni || !Number.isInteger(Number(values.nDni)) || Number(values.nDni) < 1000000) {
            errors.nDni = "El DNI debe ser un número entero de al menos 7 dígitos";
        }

        return errors;
    };

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const userData = {
                name: values.name.trim(),
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
                birthdate: new Date(values.birthdate).toISOString(),
                nDni: parseInt(values.nDni, 10)
            };

            await registerUser(userData);
            
            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Te redirigimos al login...",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
            resetForm();
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Error en registro:", error);
            const errorMessage = error.message || "Error al registrarse. Por favor, intenta nuevamente.";
            Swal.fire({
                title: "Error al registrar",
                text: errorMessage,
                icon: "error"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
        <Formik
            initialValues={{
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            birthdate: "",
            nDni: "",
            }}
            validate={validate}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
            <Form className={styles.glass}>
                <h2 className={styles.title}>Registro de Usuario</h2>

                <Field name="name" placeholder="Nombre" />
                <ErrorMessage name="name" component="p" className={styles.error} />

                <Field name="username" placeholder="Usuario" />
                <ErrorMessage name="username" component="p" className={styles.error} />

                <Field type="email" name="email" placeholder="Correo electrónico" />
                <ErrorMessage name="email" component="p" className={styles.error} />

                <Field type="password" name="password" placeholder="Contraseña" />
                <ErrorMessage name="password" component="p" className={styles.error} />

                <Field type="password" name="confirmPassword" placeholder="Confirmar contraseña" />
                <ErrorMessage name="confirmPassword" component="p" className={styles.error} />

                <Field type="date" name="birthdate" />
                <ErrorMessage name="birthdate" component="p" className={styles.error} />

                <Field name="nDni" placeholder="DNI" />
                <ErrorMessage name="nDni" component="p" className={styles.error} />

                <button
                type="submit"
                className={styles.glassHover}
                disabled={isSubmitting}
                >
                {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
            </Form>
            )}
        </Formik>
        </div>
    );
};

export default Register;
