import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
    <div className={styles.notFoundPage}>
        <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Página no encontrada</h2>
        <p className={styles.errorMessage}>
            Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <button 
            onClick={() => navigate('/')} 
            className={styles.homeButton}
        >
            Volver al Inicio
        </button>
        </div>
    </div>
    );
};

export default NotFound;