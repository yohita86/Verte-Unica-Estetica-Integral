import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import styles from './App.module.css';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import BackgroundVideo from './components/BackgroundVideo/BackgroundVideo';
import Home from './views/Home/Home'; // contiene Navbar + HomeLanding
import MisTurnos from './views/MisTurnos/MisTurnos';
import Register from './views/Register/Register';
import Login from './views/Login/Login';
import Navbar from './components/Navbar/Navbar';
import CreateAppointment from './views/CreateAppointment/CreateAppointment';
import EmailForm from './components/EmailForm/EmailForm';
import { useUser } from './context/UserContext';

function PrivateRoute({ children }) {
    const { user } = useUser();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    const location = useLocation();
    const { user } = useUser();

    return (
        <>
            {location.pathname !== "/" && <Navbar />}
            <div className={styles.appWrapper}>
                <BackgroundVideo />
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/MisTurnos" />} />
                        <Route path="/register" element={!user ? <Register /> : <Navigate to="/MisTurnos" />} />
                        <Route path="/contact" element={<EmailForm />} />
                        <Route 
                            path="/MisTurnos" 
                            element={
                                <PrivateRoute>
                                    <MisTurnos />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/turns/create" 
                            element={
                                <PrivateRoute>
                                    <CreateAppointment />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </motion.div>
            </div>
        </>
    );
}

export default App;
