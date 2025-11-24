import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './LoginForm.scss';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
        toast.error('Por favor completa todos los campos');
        return;
    }

    setLoading(true);
    
    try {
        await login(email, password);
        toast.success('¡Bienvenido!');
        navigate('/catalog');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        toast.error('Credenciales incorrectas');
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className={styles.container}>
        <div className={styles.formCard}>
        <h2>Iniciar Sesión</h2>
        <p className={styles.subtitle}>Sistema de Objetos Perdidos UAO</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@uao.edu.co"
                required
            />
            </div>

            <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
            />
            </div>

            <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
            >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
        </form>

        <p className={styles.registerLink}>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
        </div>
    </div>
    );
};

export default LoginForm;