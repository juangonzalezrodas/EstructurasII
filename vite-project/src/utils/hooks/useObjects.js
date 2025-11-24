import { useState, useEffect } from 'react';
import { getAllObjects } from '../services/objectService';

export const useObjects = (initialFilters = {}) => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchObjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Aplicando filtros:', filters); 
        const result = await getAllObjects(filters);

        if (result.success) {
        console.log('📦 Objetos obtenidos:', result.data.length); 
        setObjects(result.data);
        } else {
        setError(result.error);
        }
    } catch (err) {
        setError('Error al cargar los objetos');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchObjects();

  }, [filters]); 

    const refreshObjects = () => {
    fetchObjects();
    };

    const updateFilters = (newFilters) => {
    console.log('🔄 Actualizando filtros:', newFilters); 
    setFilters(newFilters);
    };

    const clearFilters = () => {
    console.log('🧹 Limpiando filtros'); 
    setFilters({});
    };

    return {
    objects,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refreshObjects
    };
};