import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import Header from '../components/common/Header';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const { isAdmin } = useUserRole();

    return (
    <>
        <Header />
        <div className={styles.homePage}>
        <div className={styles.hero}>
            <div className="container">
            <h1 className={styles.heroTitle}>Nexo</h1>
            <p className={styles.heroTagline}>Encuentra buscando menos</p>
            <p className={styles.heroDescription}>
                Sistema inteligente de gestión de objetos perdidos para la Universidad Autónoma de Occidente
            </p>
            <div className={styles.heroActions}>
                <button 
                onClick={() => navigate('/catalog')} 
                className={styles.primaryButton}
                >
                Ver Catálogo
                </button>
                <button 
                onClick={() => navigate('/my-tickets')} 
                className={styles.secondaryButton}
                >
                Reportar Pérdida
                </button>

              {/* MOSTRAR SOLO SI ES ADMIN */}
                {isAdmin && (
                <button 
                    onClick={() => navigate('/admin')} 
                    className={styles.adminButton}
                >
                    Panel Admin
                </button>
                )}
            </div>
            </div>
        </div>

        <div className={styles.features}>
            <div className="container">
            <h2 className={styles.featuresTitle}>¿Cómo funciona?</h2>
            <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📸</div>
                <h3>Registro con Foto</h3>
                <p>
                    El personal de seguridad registra cada objeto encontrado con fotografía y descripción detallada
                </p>
                </div>

                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔍</div>
                <h3>Búsqueda Fácil</h3>
                <p>
                    Explora el catálogo en línea y filtra por categoría, color, ubicación y fecha
                </p>
                </div>

                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎫</div>
                <h3>Reporta tu Pérdida</h3>
                <p>
                    Crea un ticket describiendo tu objeto perdido y recibe notificaciones de coincidencias
                </p>
                </div>

                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔔</div>
                <h3>Notificaciones</h3>
                <p>
                    El sistema te avisa automáticamente cuando encuentra una posible coincidencia
                </p>
                </div>

                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>✅</div>
                <h3>Validación Segura</h3>
                <p>
                    La entrega se realiza con verificación de identidad en portería para garantizar seguridad
                </p>
                </div>

                <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3>Transparencia Total</h3>
                <p>
                    Cada proceso queda registrado con historial completo y trazabilidad
                </p>
                </div>
            </div>
            </div>
        </div>

        <div className={styles.cta}>
            <div className="container">
            <h2>¿Perdiste algo?</h2>
            <p>No te preocupes, estamos aquí para ayudarte a recuperarlo</p>
            <button 
                onClick={() => navigate('/catalog')} 
                className={styles.ctaButton}
            >
                Buscar Ahora
            </button>
            </div>
        </div>
        </div>
    </>
    );
};

export default Home;