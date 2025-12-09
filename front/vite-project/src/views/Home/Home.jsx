// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import HomeLanding from '../HomeLanding/HomeLanding';
import { UserContext } from '../../context/UserContext';

function Home() {

    return (
        <div className={styles.homeWrapper}>
            <motion.div
                className={styles.glassHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.h1
                    className={styles.titulo}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    Verte Única
                </motion.h1>

                <motion.h2
                    className={styles.titulo2}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    Estética Integral
                </motion.h2>

            </motion.div>
            <Navbar />
            <HomeLanding />
        </div>

    );
}


export default Home;
