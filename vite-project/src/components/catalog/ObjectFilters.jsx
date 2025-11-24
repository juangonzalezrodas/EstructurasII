import { useState } from 'react';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS, OBJECT_STATUS } from '../../utils/constants';
import styles from './ObjectFilters.module.css';
import PropTypes from 'prop-types';

const ObjectFilters = ({ onFilterChange, onClearFilters }) => {
    const [localFilters, setLocalFilters] = useState({
    category: '',
    color: '',
    location: '',
    status: ''
    });

    const handleFilterChange = (filterName, value) => {
    const newFilters = {
        ...localFilters,
        [filterName]: value
    };
    
    console.log('🎯 Filtro cambiado:', filterName, '=', value); // Debug
    
    setLocalFilters(newFilters);
    
    // Crear objeto solo con filtros que tienen valor
    const activeFilters = {};
    Object.keys(newFilters).forEach(key => {
        if (newFilters[key] && newFilters[key] !== '') {
        activeFilters[key] = newFilters[key];
        }
    });
    
    console.log('✅ Filtros activos:', activeFilters); // Debug
    onFilterChange(activeFilters);
    };

    const handleClear = () => {
    const emptyFilters = {
        category: '',
        color: '',
        location: '',
        status: ''
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
    };

    return (
    <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
        <label htmlFor="category">Categoría</label>
        <select
            id="category"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
        >
            <option value="">Todas las categorías</option>
            {OBJECT_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
        </select>
        </div>

        <div className={styles.filterGroup}>
        <label htmlFor="color">Color</label>
        <select
            id="color"
            value={localFilters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
        >
            <option value="">Todos los colores</option>
            {COLORS.map(color => (
            <option key={color.value} value={color.value}>{color.label}</option>
            ))}
        </select>
        </div>

        <div className={styles.filterGroup}>
        <label htmlFor="location">Ubicación</label>
        <select
            id="location"
            value={localFilters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
        >
            <option value="">Todas las ubicaciones</option>
            {CAMPUS_LOCATIONS.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
        </select>
        </div>

        <div className={styles.filterGroup}>
        <label htmlFor="status">Estado</label>
        <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
        >
            <option value="">Todos los estados</option>
            <option value={OBJECT_STATUS.AVAILABLE}>Disponible</option>
            <option value={OBJECT_STATUS.DELIVERED}>Entregado</option>
        </select>
        </div>

        <button onClick={handleClear} className={styles.clearButton}>
        Limpiar Filtros
        </button>
    </div>
    );
};

ObjectFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired
};

export default ObjectFilters;