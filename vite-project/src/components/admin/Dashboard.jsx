import { useState, useEffect } from 'react';
import { getAllObjects } from '../../services/objectService';
import { getAllTickets } from '../../services/ticketService';
import { OBJECT_STATUS, TICKET_STATUS } from '../../utils/constants';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
    totalObjects: 0,
    availableObjects: 0,
    deliveredObjects: 0,
    totalTickets: 0,
    pendingTickets: 0,
    matchedTickets: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchStats();
    }, []);

    const fetchStats = async () => {
    setLoading(true);
    try {
        const [objectsResult, ticketsResult] = await Promise.all([
        getAllObjects(),
        getAllTickets()
        ]);

        if (objectsResult.success && ticketsResult.success) {
        const objects = objectsResult.data;
        const tickets = ticketsResult.data;

        setStats({
            totalObjects: objects.length,
            availableObjects: objects.filter(o => o.status === OBJECT_STATUS.AVAILABLE).length,
            deliveredObjects: objects.filter(o => o.status === OBJECT_STATUS.DELIVERED).length,
            totalTickets: tickets.length,
            pendingTickets: tickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
            matchedTickets: tickets.filter(t => t.status === TICKET_STATUS.MATCHED).length
        });
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    } finally {
        setLoading(false);
    }
    };

    if (loading) {
    return <div className={styles.loading}>Cargando estadísticas...</div>;
    }

    return (
    <div className={styles.dashboard}>
        <h2 className={styles.title}>Panel de Estadísticas</h2>

        <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Objetos</p>
            <p className={styles.statValue}>{stats.totalObjects}</p>
            </div>
        </div>

        <div className={`${styles.statCard} ${styles.success}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Disponibles</p>
            <p className={styles.statValue}>{stats.availableObjects}</p>
            </div>
        </div>

        <div className={`${styles.statCard} ${styles.info}`}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Entregados</p>
            <p className={styles.statValue}>{stats.deliveredObjects}</p>
            </div>
        </div>

        <div className={`${styles.statCard} ${styles.warning}`}>
            <div className={styles.statIcon}>🎫</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Tickets</p>
            <p className={styles.statValue}>{stats.totalTickets}</p>
            </div>
        </div>

        <div className={`${styles.statCard} ${styles.pending}`}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Tickets Pendientes</p>
            <p className={styles.statValue}>{stats.pendingTickets}</p>
            </div>
        </div>

        <div className={`${styles.statCard} ${styles.matched}`}>
            <div className={styles.statIcon}>🔔</div>
            <div className={styles.statContent}>
            <p className={styles.statLabel}>Coincidencias</p>
            <p className={styles.statValue}>{stats.matchedTickets}</p>
            </div>
        </div>
        </div>
    </div>
    );
};

export default Dashboard;