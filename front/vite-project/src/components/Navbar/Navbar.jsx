import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isDark, setIsDark] = useState(false);
    const { user, logoutUser, loadingUser } = useContext(UserContext);
    const navigate = useNavigate();

    if (loadingUser) return null;

    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <nav className={`${styles.navbar} ${isDark ? styles.dark : styles.light}`}>
            <ul className={styles.navbar__links}>
                <li><Link to="/">Home</Link></li>

                {/* Mostrar solo si hay usuario logueado */}
                {user && (
                    <>
                        <li><Link to="/MisTurnos">Mis Turnos</Link></li>
                        <li><Link to="/turns/create">Crear Turno</Link></li>
                    </>
                )}

                {/* Mostrar solo si NO hay usuario logueado */}
                {!user && <li><Link to="/login">Login</Link></li>}
                {!user && <li><Link to="/register">Register</Link></li>}

                <li><Link to="/contact">Contact</Link></li>

                {/* Saludo y botón cerrar sesión si hay usuario */}
                {user && (
                    <>
                        <li className={styles.navbar__saludo}>Hola, {user.name}</li>
                        <li>
                            <button className={styles.logout_btn} onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </li>
                    </>
                )}
            </ul>

            <button onClick={toggleDarkMode} className={styles.toggle_button}>
                <span className={styles.emoji_icon}>
                    {isDark ? '✨' : '🧖‍♀️'}
                </span>
            </button>
        </nav>
    );
};

export default Navbar;
