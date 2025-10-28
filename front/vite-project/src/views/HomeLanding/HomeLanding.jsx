import React from 'react';
import styles from './HomeLanding.module.css';

function HomeLanding() {
    return (
        <div className={styles.landingContent}>
        <h1>Bienvenida/o a nuestra clínica de Estética Integral</h1>
        <p>
            Ofrecemos una amplia gama de tratamientos para ayudarte a sentirte y verte mejor.
            Desde tratamientos faciales hasta procedimientos corporales, tenemos todo lo que necesitas para realzar tu belleza natural.
        </p>
        <div className={styles.cta}>
            <p>¡Contáctanos hoy mismo para programar tu cita!</p>
        </div>
        </div>
        );
}

export default HomeLanding;

