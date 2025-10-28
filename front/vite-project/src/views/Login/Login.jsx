import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import Styles from "./Login.module.css";
import { UserContext } from "../../context/UserContext";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("El nombre de usuario es requerido"),
    password: Yup.string()
    .required("La contraseña es requerida")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const Login = () => {
    const navigate = useNavigate();
    const { loginUser, user } = useContext(UserContext);

    // ✅ Redirigir automáticamente a /turnos si ya está logueado
    useEffect(() => {
        if (user) {
            navigate("/MisTurnos");
        }
    }, [user, navigate]);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            await loginUser(values);
            Swal.fire({
                icon: "success",
                title: "¡Inicio de sesión exitoso!",
                text: "Serás redirigido a tus turnos.",
                timer: 2000,
                showConfirmButton: false,
            });
            setTimeout(() => {
                navigate("/MisTurnos");
            }, 2000);
        } catch (error) {
            console.error("Error en login:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error al iniciar sesión. Por favor, intenta nuevamente.";
            setFieldError("username", errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={Styles.container}>
            {!user ? (
                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className={Styles.glassForm}>
                            <h2 className={Styles.title}>Iniciar Sesión</h2>

                            <div className={Styles.formGroup}>
                                <Field
                                    type="text"
                                    name="username"
                                    placeholder="Nombre de usuario"
                                    className={errors.username && touched.username ? Styles.error : Styles.input}
                                />
                                <ErrorMessage name="username" component="div" className={Styles.errorMessage} />
                            </div>

                            <div className={Styles.formGroup}>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    className={errors.password && touched.password ? Styles.error : Styles.input}
                                />
                                <ErrorMessage name="password" component="div" className={Styles.errorMessage} />
                            </div>

                            <button
                                type="submit"
                                className={Styles.button}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>
                        </Form>
                    )}
                </Formik>
            ) : (
                <p className={Styles.title}>Ya iniciaste sesión.</p>
            )}
        </div>
    );
};

export default Login;
