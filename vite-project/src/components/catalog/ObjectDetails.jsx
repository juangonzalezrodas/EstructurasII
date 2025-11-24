import { useState, useEffect } from 'react';
import { getObjectById } from '../../services/objectService';
import { formatDate, getStatusText } from '../../utils/helpers';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS, STORAGE_LOCATIONS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import DeliveryForm from '../admin/DeliveryForm';
import styles from './ObjectDetails.scss';
import PropTypes from 'prop-types';

const ObjectDetails = ({ objectId, onClose }) => {
    const [object, setObject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);

    useEffect(() => {
    fetchObjectDetails();
    }, [objectId]);

    const fetchObjectDetails = async () => {
    setLoading(true);
    try {
        const result = await getObjectById(objectId);
        if (result.success) {
        setObject(result.data);
        } else {
        setError(result.error);
        }
    } catch (err) {
        setError('Error al cargar detalles');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

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
    } ;

    const getStorageLabel = (value) => {
    const loc = STORAGE_LOCATIONS.find(l => l.value === value);
    return loc ? loc.label : value;
    };

    const handleDeliverySuccess = () => {
    setShowDeliveryForm(false);
    onClose();
    };

    const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
    };

    if (loading) {
    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent}>
            <LoadingSpinner message="Cargando detalles..." />
        </div>
        </div>
    );
    }

    if (error || !object) {
    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent}>
            <div className={styles.error}>
            <p>{error || 'Objeto no encontrado'}</p>
            <button onClick={onClose} className={styles.closeButton}>
                Cerrar
            </button>
            </div>
        </div>
        </div>
    );
    }

    return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButtonTop}>
            ✕
        </button>

        <div className={styles.detailsContainer}>
            <div className={styles.imageSection}>
            <img 
                src={object.imageUrl || '/placeholder-image.png'} 
                alt={object.title}
                className={styles.image}
                onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                }}
            />
            <span className={`${styles.statusBadge} ${styles[object.status]}`}>
                {getStatusText(object.status)}
            </span>
            </div>

            <div className={styles.infoSection}>
            {showDeliveryForm ? (
                <DeliveryForm 
                object={object}
                onSuccess={handleDeliverySuccess}
                onCancel={() => setShowDeliveryForm(false)}
                />
            ) : (
                <>
                <h2 className={styles.title}>{object.title}</h2>
                
                <div className={styles.description}>
                    <h3>Descripción</h3>
                    <p>{object.description}</p>
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Categoría</span>
                    <span className={styles.detailValue}>
                        {getCategoryLabel(object.category)}
                    </span>
                    </div>

                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Color</span>
                    <span className={styles.detailValue}>
                        {getColorLabel(object.color)}
                    </span>
                    </div>

                    {object.size && (
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Tamaño</span>
                        <span className={styles.detailValue}>{object.size}</span>
                    </div>
                    )}

                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Encontrado en</span>
                    <span className={styles.detailValue}>
                        {getLocationLabel(object.location)}
                    </span>
                    </div>

                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha de hallazgo</span>
                    <span className={styles.detailValue}>
                        {formatDate(object.foundDate)}
                    </span>
                    </div>

                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Almacenado en</span>
                    <span className={styles.detailValue}>
                        {getStorageLabel(object.storageLocation)}
                    </span>
                    </div>

                    <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Registrado el</span>
                    <span className={styles.detailValue}>
                        {formatDate(object.createdAt)}
                    </span>
                    </div>
                </div>

                {object.observations && (
                    <div className={styles.observations}>
                    <h3>Observaciones</h3>
                    <p>{object.observations}</p>
                    </div>
                )}

                {object.status === 'available' && (
                    <div className={styles.contactInfo}>
                    <h3>¿Es tuyo?</h3>
                    <p>
                        Si este objeto te pertenece, acércate a <strong>{getStorageLabel(object.storageLocation)}</strong> con tu documento de identidad para reclamarlo.
                    </p>
                    </div>
                )}

                <div className={styles.actions}>
                    {object.status === 'available' && (
                    <button 
                        onClick={() => setShowDeliveryForm(true)} 
                        className={styles.deliverButton}
                    >
                        Registrar Entrega
                    </button>
                    )}
                    <button onClick={onClose} className={styles.closeButton}>
                    Cerrar
                    </button>
                </div>
                </>
            )}
            </div>
        </div>
        </div>
    </div>
    );
};

ObjectDetails.propTypes = {
    objectId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ObjectDetails;