import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/helpers';
import styles from './NotificationList.module.css';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
    if (currentUser) {
        fetchNotifications();
    }
    }, [currentUser]);

    const fetchNotifications = async () => {
    setLoading(true);
    try {
        const result = await getUserNotifications(currentUser.uid);
        if (result.success) {
        setNotifications(result.data);
        }
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    } finally {
        setLoading(false);
    }
    };

    const handleMarkAsRead = async (notificationId) => {
    try {
        const result = await markNotificationAsRead(notificationId);
        if (result.success) {
        fetchNotifications();
        }
    } catch (error) {
        console.error('Error al marcar notificación:', error);
    }
    };

    const handleMarkAllAsRead = async () => {
    try {
        const result = await markAllNotificationsAsRead(currentUser.uid);
        if (result.success) {
        fetchNotifications();
        }
    } catch (error) {
        console.error('Error al marcar todas las notificaciones:', error);
    }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
    <div className={styles.notificationContainer}>
        <button 
        className={styles.notificationButton}
        onClick={() => setShowNotifications(!showNotifications)}
        >
        🔔
        {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
        )}
        </button>

        {showNotifications && (
        <div className={styles.notificationDropdown}>
            <div className={styles.header}>
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
                <button 
                onClick={handleMarkAllAsRead}
                className={styles.markAllButton}
                >
                Marcar todas como leídas
                </button>
            )}
            </div>

            <div className={styles.notificationList}>
            {loading ? (
                <p className={styles.loading}>Cargando...</p>
            ) : notifications.length === 0 ? (
                <p className={styles.empty}>No tienes notificaciones</p>
            ) : (
                notifications.map(notification => (
                <div 
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                >
                    <div className={styles.notificationContent}>
                    <h4 className={styles.notificationTitle}>
                        {notification.title}
                    </h4>
                    <p className={styles.notificationMessage}>
                        {notification.message}
                    </p>
                    <span className={styles.notificationTime}>
                        {formatDateTime(notification.createdAt)}
                    </span>
                    </div>
                    {!notification.read && (
                    <span className={styles.unreadDot}></span>
                    )}
                </div>
                ))
            )}
            </div>
        </div>
        )}
    </div>
        );
};

export default NotificationList;