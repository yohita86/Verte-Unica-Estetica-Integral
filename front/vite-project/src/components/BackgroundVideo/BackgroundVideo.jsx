import React from "react";
import styles from "./BackgroundVideo.module.css";

const BackgroundVideo = () => {
    return (
        <div className={styles.backgroundVideoContainer}>
        <video autoPlay muted loop playsInline preload="auto" className={styles.backgroundVideo}>
            <source src="/videos/Background_medium.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
        </video>
        <div className="videoOverlay"></div>
        </div>
    );
};

export default BackgroundVideo;
