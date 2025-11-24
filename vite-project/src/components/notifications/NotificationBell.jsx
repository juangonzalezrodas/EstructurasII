import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/helpers';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
    if (currentUser) {
        fetchNotifications();
      // Actualizar cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }
    }, [currentUser]);

    const fetchNotifications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
        const result = await getUserNotifications(currentUser.uid);
        if (result.success) {
        // Ordenar por fecha, no leídas primero
        const sorted = result.data.sort((a, b) => {
            if (a.read !== b.read) return a.read ? 1 : -1;
            return b.createdAt - a.createdAt;
        });
        setNotifications(sorted);
        }
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    } finally {
        setLoading(false);
    }
    };

    const handleMarkAsRead = async (notificationId) => {
    try {
        await markNotificationAsRead(notificationId);
        fetchNotifications();
    } catch (error) {
        console.error('Error al marcar como leída:', error);
    }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
    <div className={styles.container}>
        <button 
        className={styles.bellButton}
        onClick={() => setShowDropdown(!showDropdown)}
        >
        🔔
        {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
        )}
        </button>

        {showDropdown && (
        <div className={styles.dropdown}>
            <div className={styles.header}>
            <h3>Notificaciones</h3>
            <button onClick={() => setShowDropdown(false)}>✕</button>
            </div>

            <div className={styles.list}>
            {loading ? (
                <p className={styles.loading}>Cargando...</p>
            ) : notifications.length === 0 ? (
                <p className={styles.empty}>No hay notificaciones</p>
            ) : (
                notifications.slice(0, 5).map(notification => (
                <div 
                    key={notification.id}
                    className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                >
                    <div className={styles.icon}>
                    {notification.type === 'match' ? '🎯' : 'ℹ️'}
                    </div>
                    <div className={styles.content}>
                    <p className={styles.title}>{notification.title}</p>
                    <p className={styles.message}>{notification.message}</p>
                    <span className={styles.time}>
                        {formatDateTime(notification.createdAt)}
                    </span>
                    </div>
                    {!notification.read && <span className={styles.dot}>•</span>}
                </div>
                ))
            )}
            </div>
        </div>
        )}
    </div>
    );
};

export default NotificationBell;