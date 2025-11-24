import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
    return (
        <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
        }}>
        <p>Cargando...</p>
        </div>
    );
    }

    return currentUser ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;