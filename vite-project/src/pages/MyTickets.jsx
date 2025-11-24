import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import Header from '../components/common/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TicketCard from '../components/tickets/TicketCard';
import TicketForm from '../components/tickets/TicketForm';
import styles from './MyTickets.module.css';

const MyTickets = () => {
    const { tickets, loading, error, refreshTickets } = useTickets();
    const [showForm, setShowForm] = useState(false);

    const handleFormSuccess = () => {
    setShowForm(false);
    refreshTickets();
    };

    const handleFormCancel = () => {
    setShowForm(false);
    };

    return (
    <>
        <Header />
        <div className={styles.myTicketsPage}>
        <div className="container">
            <div className={styles.header}>
            <div>
                <h1>Mis Reportes</h1>
                <p className={styles.subtitle}>
                Gestiona tus reportes de objetos perdidos
                </p>
            </div>
            {!showForm && (
                <button 
                onClick={() => setShowForm(true)} 
                className={styles.newTicketButton}
                >
                + Nuevo Reporte
                </button>
            )}
            </div>

            {showForm && (
            <div className={styles.formSection}>
                <TicketForm 
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                />
            </div>
            )}

            {!showForm && (
            <>
                {loading ? (
                <LoadingSpinner message="Cargando tus tickets..." />
                ) : error ? (
                <div className={styles.error}>
                    <p>Error al cargar los tickets: {error}</p>
                    <button onClick={refreshTickets} className={styles.retryButton}>
                    Reintentar
                    </button>
                </div>
                    ) : tickets.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h2>No tienes reportes</h2>
                    <p>Crea tu primer reporte de objeto perdido</p>
                    <button 
                    onClick={() => setShowForm(true)} 
                    className={styles.createButton}
                    >
                    Crear Reporte
                    </button>
                </div>
                ) : (
                <div className={styles.ticketsGrid}>
                    {tickets.map(ticket => (
                    <TicketCard 
                        key={ticket.id} 
                        ticket={ticket}
                        onUpdate={refreshTickets}
                    />
                    ))}
                </div>
                )}
            </>
            )}
        </div>
        </div>
    </>
    );
};

export default MyTickets;