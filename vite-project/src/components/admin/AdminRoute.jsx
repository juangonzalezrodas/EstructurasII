import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import LoadingSpinner from '../common/LoadingSpinner';
import PropTypes from 'prop-types';
import styles from './AdminRoute.scss';

const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useUserRole();

    if (loading) {
    return <LoadingSpinner message="Verificando permisos..." />;
    }

    if (!isAdmin) {
    return (
        <div className={styles.accessDenied}>
        <div className={styles.content}>
            <div className={styles.icon}>🚫</div>
            <h1>Acceso Denegado</h1>
            <p>No tienes permisos para acceder a esta página.</p>
            <p className={styles.hint}>
            Solo usuarios administradores pueden acceder al panel de administración.
            </p>
            <button onClick={() => window.history.back()} className={styles.backButton}>
            Volver Atrás
            </button>
        </div>
        </div>
    );
    }

    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminRoute;