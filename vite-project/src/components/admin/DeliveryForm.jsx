import { useState } from 'react';
import { createDelivery } from '../../services/deliveryService';
import { updateObjectStatus } from '../../services/objectService';
import { updateTicketStatus } from '../../services/ticketService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { isValidIdNumber, isNotEmpty } from '../../utils/validators';
import styles from './DeliveryForm.scss';
import PropTypes from 'prop-types';

const DeliveryForm = ({ object, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
    claimantName: '',
    claimantIdNumber: '',
    ticketId: ''
    });
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const validateForm = () => {
    if (!isNotEmpty(formData.claimantName)) {
        toast.error('El nombre del reclamante es requerido');
        return false;
    }
    if (!isValidIdNumber(formData.claimantIdNumber)) {
        toast.error('Documento de identidad inválido (6-10 dígitos)');
        return false;
    }
    return true;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Crear comprobante de entrega
        const deliveryData = {
        objectId: object.id,
        ticketId: formData.ticketId || null,
        claimantId: null, // Podría buscar el usuario por email si existe
        claimantName: formData.claimantName,
        claimantIdNumber: formData.claimantIdNumber,
        deliveredBy: currentUser.uid
        };

        const deliveryResult = await createDelivery(deliveryData);
    
        if (!deliveryResult.success) {
        toast.error('Error al crear el comprobante');
        setLoading(false);
        return;
        }

      // Actualizar estado del objeto
        const objectResult = await updateObjectStatus(object.id, 'delivered', {
        deliveredTo: formData.claimantIdNumber,
        deliveredAt: new Date()
        });

        if (!objectResult.success) {
        toast.error('Error al actualizar el objeto');
        setLoading(false);
        return;
        }

      // Si hay un ticket asociado, actualizarlo
        if (formData.ticketId) {
        await updateTicketStatus(formData.ticketId, 'resolved', {
            resolvedAt: new Date()
        });
        }

        toast.success('Entrega registrada exitosamente');
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al registrar la entrega');
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className={styles.formContainer}>
        <h2>Registrar Entrega</h2>
        <p className={styles.subtitle}>
        Objeto: <strong>{object.title}</strong>
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="claimantName">Nombre Completo del Reclamante *</label>
            <input
            type="text"
            id="claimantName"
            name="claimantName"
            value={formData.claimantName}
            onChange={handleChange}
            placeholder="Juan Pérez García"
            required
            />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="claimantIdNumber">Documento de Identidad *</label>
            <input
            type="text"
            id="claimantIdNumber"
            name="claimantIdNumber"
            value={formData.claimantIdNumber}
            onChange={handleChange}
            placeholder="1234567890"
            required
            />
        </div>

        <div className={styles.formGroup}>
            <label htmlFor="ticketId">ID del Ticket (opcional)</label>
            <input
            type="text"
            id="ticketId"
            name="ticketId"
            value={formData.ticketId}
            onChange={handleChange}
            placeholder="Si el usuario tiene un ticket, ingresar el ID"
            />
            <small className={styles.hint}>
            El ID del ticket se encuentra en la página "Mis Reportes" del usuario
            </small>
        </div>

        <div className={styles.warning}>
            <p>⚠️ Asegúrate de verificar el documento de identidad del reclamante antes de entregar el objeto.</p>
        </div>

        <div className={styles.formActions}>
            <button 
            type="button" 
            onClick={onCancel} 
            className={styles.cancelButton}
            disabled={loading}
            >
            Cancelar
            </button>
            <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
            >
            {loading ? 'Registrando...' : 'Registrar Entrega'}
            </button>
        </div>
        </form>
    </div>
    );
};

DeliveryForm.propTypes = {
    object: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
    }).isRequired,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func
};

export default DeliveryForm;