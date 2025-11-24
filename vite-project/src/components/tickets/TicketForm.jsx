import { useState } from 'react';
import { createTicket } from '../../services/ticketService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS } from '../../utils/constants';
import { isNotEmpty, isValidPastDate } from '../../utils/validators';
import styles from './TicketForm.module.css';
import PropTypes from 'prop-types';

const TicketForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '',
    size: '',
    lostLocation: '',
    lostDate: ''
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
    if (!isNotEmpty(formData.title)) {
        toast.error('El título es requerido');
        return false;
    }
    if (!isNotEmpty(formData.description)) {
        toast.error('La descripción es requerida');
        return false;
    }
    if (!formData.category) {
        toast.error('La categoría es requerida');
        return false;
    }
    if (!formData.color) {
        toast.error('El color es requerido');
        return false;
    }
    if (!formData.lostLocation) {
        toast.error('La ubicación es requerida');
        return false;
    }
    if (!formData.lostDate) {
        toast.error('La fecha es requerida');
        return false;
    }
    if (!isValidPastDate(formData.lostDate)) {
        toast.error('La fecha no puede ser futura');
        return false;
    }
    return true;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
        const result = await createTicket(formData, currentUser.uid);
        if (result.success) {
        toast.success('Ticket creado exitosamente');
        if (onSuccess) onSuccess();
        } else {
        toast.error('Error al crear el ticket');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al crear el ticket');
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className={styles.formContainer}>
        <h2>Reportar Objeto Perdido</h2>
        <p className={styles.subtitle}>
        Describe tu objeto perdido y te notificaremos si encontramos una coincidencia
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título *</label>
            <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: iPhone 13 negro"
            required
            />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descripción Detallada *</label>
            <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu objeto con el mayor detalle posible (marcas distintivas, accesorios, etc.)"
            rows="4"
            required
            />
        </div>

        <div className={styles.formRow}>
            <div className={styles.formGroup}>
            <label htmlFor="category">Categoría *</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar...</option>
                {OBJECT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            </div>

            <div className={styles.formGroup}>
            <label htmlFor="color">Color *</label>
            <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar...</option>
                {COLORS.map(color => (
                <option key={color.value} value={color.value}>{color.label}</option>
                ))}
            </select>
            </div>
        </div>

        <div className={styles.formRow}>
            <div className={styles.formGroup}>
            <label htmlFor="size">Tamaño/Talla (opcional)</label>
            <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Ej: Mediano, XL, 15 pulgadas"
            />
            </div>

            <div className={styles.formGroup}>
            <label htmlFor="lostLocation">¿Dónde lo perdiste? *</label>
            <select
                id="lostLocation"
                name="lostLocation"
                value={formData.lostLocation}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar...</option>
                {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
            </select>
            </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lostDate">¿Cuándo lo perdiste? *</label>
            <input
            type="date"
            id="lostDate"
            name="lostDate"
            value={formData.lostDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            />
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
            {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
        </div>
        </form>
    </div>
    );
};

TicketForm.propTypes = {
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func
};

export default TicketForm;