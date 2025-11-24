import { useState } from 'react';
import { useObjects } from '../hooks/useObjects';
import Header from '../components/common/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Dashboard from '../components/admin/Dashboard';
import ObjectRegistrationForm from '../components/admin/ObjectRegistrationForm';
import ObjectCard from '../components/catalog/ObjectCard';
import { toast } from 'react-toastify';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const { objects, loading, error, refreshObjects } = useObjects();
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'objects', 'register'

    const handleFormSuccess = () => {
    setShowForm(false);
    setActiveTab('objects');
    refreshObjects();
    };

    const handleFormCancel = () => {
    setShowForm(false);
    setActiveTab('dashboard');
    };

    const handleObjectClick = (object) => {
    toast.info(`Objeto: ${object.title}`);
    };

    return (
    <>
        <Header />
        <div className={styles.adminPage}>
        <div className="container">
            <div className={styles.header}>
            <h1>Panel de Administración</h1>
            <p className={styles.subtitle}>
                Gestión de objetos perdidos
            </p>
            </div>

            <div className={styles.tabs}>
            <button 
                className={`${styles.tab} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}
                onClick={() => {
                setActiveTab('dashboard');
                setShowForm(false);
                }}
            >
                📊 Dashboard
            </button>
            <button 
                className={`${styles.tab} ${activeTab === 'objects' ? styles.activeTab : ''}`}
                onClick={() => {
                setActiveTab('objects');
                setShowForm(false);
                }}
            >
                📦 Objetos
            </button>
            <button 
                className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
                onClick={() => {
                setActiveTab('register');
                setShowForm(true);
                }}
            >
                ➕ Registrar Objeto
            </button>
            </div>

            <div className={styles.content}>
            {activeTab === 'dashboard' && <Dashboard />}

            {activeTab === 'objects' && (
                <>
                {loading ? (
                    <LoadingSpinner message="Cargando objetos..." />
                ) : error ? (
                    <div className={styles.error}>
                    <p>Error al cargar los objetos: {error}</p>
                    <button onClick={refreshObjects} className={styles.retryButton}>
                        Reintentar
                    </button>
                    </div>
                ) : objects.length === 0 ? (
                    <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📦</div>
                    <h2>No hay objetos registrados</h2>
                    <p>Comienza registrando el primer objeto encontrado</p>
                    <button 
                        onClick={() => {
                        setActiveTab('register');
                        setShowForm(true);
                        }} 
                        className={styles.registerButton}
                    >
                        Registrar Objeto
                    </button>
                    </div>
                ) : (
                    <>
                    <div className={styles.objectsHeader}>
                        <p className={styles.objectsCount}>
                        {objects.length} objeto(s) registrado(s)
                        </p>
                    </div>
                    <div className={styles.objectsGrid}>
                        {objects.map(object => (
                        <ObjectCard 
                            key={object.id} 
                            object={object}
                            onClick={handleObjectClick}
                        />
                        ))}
                    </div>
                    </>
                )}
                </>
            )}

            {activeTab === 'register' && showForm && (
                <ObjectRegistrationForm 
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                />
            )}
            </div>
        </div>
        </div>
    </>
    );
};

export default AdminPanel;