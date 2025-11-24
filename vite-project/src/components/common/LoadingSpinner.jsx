import styles from './LoadingSpinner.module.css';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
    return (
    <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
    </div>
    );
};

LoadingSpinner.propTypes = {
    message: PropTypes.string
};

export default LoadingSpinner;