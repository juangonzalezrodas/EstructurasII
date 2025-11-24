import { formatDate, getStatusText } from '../../utils/helpers';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS, TICKET_STATUS } from '../../utils/constants';
import { cancelTicket } from '../../services/ticketService';
import { toast } from 'react-toastify';
import styles from './TicketCard.module.css';
import PropTypes from 'prop-types';

const TicketCard = ({ ticket, onUpdate }) => {
    const getCategoryLabel = (value) => {
    const cat = OBJECT_CATEGORIES.find(c => c.value === value);
    return cat ? cat.label : value;
    };

    const getColorLabel = (value) => {
    const col = COLORS.find(c => c.value === value);
    return col ? col.label : value;
    };

    const getLocationLabel = (value) => {
    const loc = CAMPUS_LOCATIONS.find(l => l.value === value);
    return loc ? loc.label : value;
    };

    const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de cancelar este ticket?')) return;

    try {
        const result = await cancelTicket(ticket.id);
        if (result.success) {
        toast.success('Ticket cancelado');
        if (onUpdate) onUpdate();
        } else {
        toast.error('Error al cancelar ticket');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cancelar ticket');
    }
    };

    const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.id);
    toast.success('ID copiado al portapapeles');
    };

    return (
    <div className={styles.card}>
        <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <span className={`${styles.statusBadge} ${styles[ticket.status]}`}>
            {getStatusText(ticket.status)}
        </span>
        </div>

      {/* SECCIÓN DEL ID - NUEVO */}
        <div className={styles.idSection}>
        <span className={styles.idLabel}>ID del Ticket:</span>
        <div className={styles.idContainer}>
            <code className={styles.idCode}>{ticket.id}</code>
            <button 
            onClick={handleCopyId} 
            className={styles.copyButton}
            title="Copiar ID"
            >
            📋
            </button>
        </div>
        <small className={styles.idHint}>
            Proporciona este ID al personal de seguridad al reclamar tu objeto
        </small>
        </div>

        <p className={styles.description}>{ticket.description}</p>

        <div className={styles.details}>
        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Categoría:</span>
            <span className={styles.detailValue}>
            {getCategoryLabel(ticket.category)}
            </span>
        </div>

        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Color:</span>
            <span className={styles.detailValue}>
            {getColorLabel(ticket.color)}
            </span>
        </div>

        {ticket.size && (
            <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Tamaño:</span>
            <span className={styles.detailValue}>{ticket.size}</span>
            </div>
        )}

        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Ubicación:</span>
            <span className={styles.detailValue}>
            {getLocationLabel(ticket.lostLocation)}
            </span>
        </div>

        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fecha de pérdida:</span>
            <span className={styles.detailValue}>
            {formatDate(ticket.lostDate)}
            </span>
        </div>

        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Creado el:</span>
            <span className={styles.detailValue}>
            {formatDate(ticket.createdAt)}
            </span>
        </div>
        </div>

        {ticket.status === TICKET_STATUS.PENDING && (
        <div className={styles.actions}>
            <button onClick={handleCancel} className={styles.cancelButton}>
            Cancelar Ticket
            </button>
        </div>
        )}

        {ticket.status === TICKET_STATUS.MATCHED && (
        <div className={styles.matchAlert}>
            <p>🎉 ¡Encontramos una posible coincidencia! Revisa tu correo.</p>
        </div>
        )}
    </div>
    );
};

TicketCard.propTypes = {
    ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.string,
    lostLocation: PropTypes.string.isRequired,
    lostDate: PropTypes.any.isRequired,
    createdAt: PropTypes.any.isRequired,
    status: PropTypes.string.isRequired
    }).isRequired,
    onUpdate: PropTypes.func
};

export default TicketCard;