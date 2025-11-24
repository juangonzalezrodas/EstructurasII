import { useState } from 'react';
import { registerObject } from '../../services/objectService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS, STORAGE_LOCATIONS } from '../../utils/constants';
import { isNotEmpty, isValidPastDate, isValidImageFile } from '../../utils/validators';
import styles from './ObjectRegistrationForm.module.css';
import PropTypes from 'prop-types';

const ObjectRegistrationForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '',
    size: '',
    location: '',
    foundDate: '',
    storageLocation: '',
    observations: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
        if (!isValidImageFile(file)) {
        toast.error('Archivo inválido. Usa JPG, PNG o WEBP (máx 20MB)');
        return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
        setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
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
    if (!formData.location) {
        toast.error('La ubicación donde se encontró es requerida');
        return false;
    }
    if (!formData.foundDate) {
        toast.error('La fecha es requerida');
        return false;
    }
    if (!isValidPastDate(formData.foundDate)) {
        toast.error('La fecha no puede ser futura');
        return false;
    }
    if (!formData.storageLocation) {
        toast.error('La ubicación de almacenamiento es requerida');
        return false;
    }
    if (!imageFile) {
        toast.error('La fotografía es requerida');
        return false;
    }
    return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
        const objectData = {
        ...formData,
        registeredBy: currentUser.uid
    };

    const result = await registerObject(objectData, imageFile);
    
    if (result.success) {
        toast.success('✅ Objeto registrado exitosamente');

      // Limpiar formulario
        setFormData({
        title: '',
        description: '',
        category: '',
        color: '',
        size: '',
        location: '',
        foundDate: '',
        storageLocation: '',
        observations: ''
        });
        setImageFile(null);
        setImagePreview(null);

      // Llamar callback de éxito después de un pequeño delay
        setTimeout(() => {
        if (onSuccess) onSuccess();
        }, 500);
    } else {
        toast.error(`❌ Error: ${result.error}`);
    }
    } catch (error) {
    console.error('Error:', error);
    toast.error('❌ Error al registrar el objeto');
    } finally {
    setLoading(false);
    }

    // Después de registrar el objeto exitosamente
if (result.success) {
    toast.success('✅ Objeto registrado exitosamente');
    
  // NUEVO: Buscar coincidencias automáticas
    try {
    const matchResult = await findMatchesForObject({
        id: result.id,
        ...formData
    });
    
    if (matchResult.success && matchResult.data.length > 0) {
        toast.info(`🎯 Se encontraron ${matchResult.data.length} posible(s) coincidencia(s)`);

      // Crear notificaciones para cada coincidencia
        for (const match of matchResult.data) {
        await notifyMatch(
            match.ticket.userId,
            formData.title,
            match.ticket.title,
            match.similarity
        );
        
        // Crear registro de coincidencia
        await createMatch(
            result.id,
            match.ticket.id,
            match.ticket.userId,
            match.similarity
        );
        
        // Actualizar estado del ticket
        await updateTicketStatus(match.ticket.id, 'matched', {
            matchedObjectId: result.id
        });
        }
    }
    } catch (error) {
    console.error('Error al buscar coincidencias:', error);
    }
  // Continuar con el resto...
}
};

    return (
    <div className={styles.formContainer}>
        <h2>Registrar Objeto Encontrado</h2>
        <p className={styles.subtitle}>
        Registra un objeto encontrado con fotografía y detalles
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>Fotografía del Objeto *</label>

            {imagePreview ? (
            <div className={styles.imagePreviewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                <button 
                type="button" 
                onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                }}
                className={styles.removeImageButton}
                >
                Cambiar Imagen
                </button>
            </div>
            ) : (
            <div className={styles.uploadArea}>
                <input
                type="file"
                id="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className={styles.fileInput}
                />
                <label htmlFor="image" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>📷</div>
                <p>Click para seleccionar imagen</p>
                <p className={styles.uploadHint}>JPG, PNG o WEBP (máx 20MB)</p>
                </label>
            </div>
            )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">Título *</label>
            <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Celular Samsung Galaxy negro"
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
            placeholder="Describe el objeto con detalles (marcas, accesorios, estado, etc.)"
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
                placeholder="Ej: Grande, M, 15 pulgadas"
            />
            </div>

            <div className={styles.formGroup}>
            <label htmlFor="location">¿Dónde se encontró? *</label>
            <select
                id="location"
                name="location"
                value={formData.location}
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

        <div className={styles.formRow}>
            <div className={styles.formGroup}>
            <label htmlFor="foundDate">Fecha en que se encontró *</label>
            <input
                type="date"
                id="foundDate"
                name="foundDate"
                value={formData.foundDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
            />
            </div>

            <div className={styles.formGroup}>
            <label htmlFor="storageLocation">Portería de almacenamiento *</label>
            <select
                id="storageLocation"
                name="storageLocation"
                value={formData.storageLocation}
                onChange={handleChange}
                required
            >
                <option value="">Seleccionar...</option>
                {STORAGE_LOCATIONS.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
            </select>
            </div>
        </div>

        <div className={styles.formGroup}>
            <label htmlFor="observations">Observaciones (opcional)</label>
            <textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            placeholder="Cualquier observación adicional sobre el estado físico del objeto"
            rows="3"
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
            {loading ? 'Registrando...' : 'Registrar Objeto'}
            </button>
        </div>
        </form>
    </div>
    );
};

ObjectRegistrationForm.propTypes = {
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func
};

export default ObjectRegistrationForm;