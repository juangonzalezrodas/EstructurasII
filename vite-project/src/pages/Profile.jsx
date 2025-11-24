import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/authService';
import Header from '../components/common/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import { USER_ROLES } from '../utils/constants';
import styles from './Profile.module.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    fetchProfile();
    }, [currentUser]);

    const fetchProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
        const result = await getUserProfile(currentUser.uid);
        if (result.success) {
        setProfile(result.data);
        } else {
        setError(result.error);
        }
    } catch (err) {
        setError('Error al cargar perfil');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    const getRoleLabel = (role) => {
    const roles = {
        [USER_ROLES.STUDENT]: 'Estudiante',
        [USER_ROLES.TEACHER]: 'Profesor',
        [USER_ROLES.SECURITY]: 'Personal de Seguridad',
        [USER_ROLES.ADMIN]: 'Administrador',
        [USER_ROLES.VISITOR]: 'Visitante'
    };
    return roles[role] || role;
    };

    if (loading) {
    return (
        <>
        <Header />
        <div className={styles.profilePage}>
            <div className="container">
            <LoadingSpinner message="Cargando perfil..." />
            </div>
        </div>
        </>
    );
    }

    if (error || !profile) {
    return (
        <>
        <Header />
        <div className={styles.profilePage}>
            <div className="container">
            <div className={styles.error}>
                <p>{error || 'No se pudo cargar el perfil'}</p>
            </div>
            </div>
        </div>
        </>
    );
    }

    return (
    <>
        <Header />
        <div className={styles.profilePage}>
        <div className="container">
            <div className={styles.header}>
            <h1>Mi Perfil</h1>
            <p className={styles.subtitle}>Información de tu cuenta</p>
            </div>

            <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                {profile.name.charAt(0).toUpperCase()}
                </div>
                <h2 className={styles.userName}>{profile.name}</h2>
                <span className={styles.userRole}>{getRoleLabel(profile.role)}</span>
            </div>

            <div className={styles.infoSection}>
                <h3>Información Personal</h3>
              
                <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Correo Electrónico</span>
                    <span className={styles.infoValue}>{profile.email}</span>
                </div>

                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Documento de Identidad</span>
                    <span className={styles.infoValue}>{profile.idNumber}</span>
                </div>

                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Rol</span>
                    <span className={styles.infoValue}>{getRoleLabel(profile.role)}</span>
                </div>

                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Miembro desde</span>
                    <span className={styles.infoValue}>
                    {formatDate(profile.createdAt)}
                    </span>
                </div>
                </div>
            </div>

            <div className={styles.actionsSection}>
                <h3>Acciones</h3>
                <div className={styles.actionsGrid}>
                <button className={styles.actionButton}>
                    📝 Editar Perfil
                </button>
                <button className={styles.actionButton}>
                    🔒 Cambiar Contraseña
                </button>
                <button className={styles.actionButton}>
                    🔔 Notificaciones
                </button>
                <button className={styles.actionButton}>
                    📊 Mi Actividad
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
    );
};

export default Profile;