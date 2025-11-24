import { useState } from 'react';
import { useObjects } from '../hooks/useObjects';
import { searchObjects } from '../services/objectService';
import Header from '../components/common/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ObjectCard from '../components/catalog/ObjectCard';
import ObjectFilters from '../components/catalog/ObjectFilters';
import ObjectSearch from '../components/catalog/ObjectSearch';
import ObjectDetails from '../components/catalog/ObjectDetails';
import { toast } from 'react-toastify';
import styles from './Catalog.module.css';

const Catalog = () => {
    const { objects, loading, error, updateFilters, clearFilters, refreshObjects } = useObjects();
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState(null);

    const handleFilterChange = (newFilters) => {
    console.log('📋 Catalog recibió filtros:', newFilters); // Debug
    setSearchResults(null); // Limpiar búsqueda
    updateFilters(newFilters);
    };

    const handleClearFilters = () => {
    console.log('🧹 Limpiando filtros en Catalog'); // Debug
    setSearchResults(null);
    clearFilters();
    };

    const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
        setSearchResults(null);
        toast.info('Mostrando todos los objetos');
        return;
    }

    setIsSearching(true);
    try {
        const result = await searchObjects(searchTerm);
        if (result.success) {
        setSearchResults(result.data);
        toast.success(`${result.data.length} resultado(s) encontrado(s)`);
        } else {
        toast.error('Error al buscar');
        }
    } catch (err) {
        console.error(err);
        toast.error('Error al realizar la búsqueda');
    } finally {
        setIsSearching(false);
    }
    };

    const handleObjectClick = (object) => {
    setSelectedObjectId(object.id);
    };

    const handleCloseModal = () => {
    setSelectedObjectId(null);
    };

    const displayObjects = searchResults !== null ? searchResults : objects;

    return (
    <>
        <Header />
        <div className={styles.catalogPage}>
        <div className="container">
            <div className={styles.header}>
            <h1>Catálogo de Objetos Perdidos</h1>
            <p className={styles.subtitle}>
                Explora todos los objetos encontrados en el campus
            </p>
            </div>

            <ObjectSearch onSearch={handleSearch} />
            <ObjectFilters 
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            />

            {loading || isSearching ? (
            <LoadingSpinner message="Cargando objetos..." />
            ) : error ? (
            <div className={styles.error}>
                <p>Error al cargar los objetos: {error}</p>
                <button onClick={refreshObjects} className={styles.retryButton}>
                Reintentar
                </button>
            </div>
            ) : displayObjects.length === 0 ? (
            <div className={styles.emptyState}>
                <p>No se encontraron objetos con los criterios seleccionados</p>
            </div>
            ) : (
            <>
                <div className={styles.resultsCount}>
                <p>{displayObjects.length} objeto(s) encontrado(s)</p>
                </div>
                <div className={styles.objectsGrid}>
                {displayObjects.map(object => (
                    <ObjectCard 
                    key={object.id} 
                    object={object}
                    onClick={handleObjectClick}
                    />
                ))}
                </div>
            </>
            )}
        </div>
        </div>

        {selectedObjectId && (
        <ObjectDetails 
            objectId={selectedObjectId}
            onClose={handleCloseModal}
        />
        )}
    </>
    );
};

export default Catalog;