import { useState } from 'react';
import styles from './ObjectSearch.scss';
import PropTypes from 'prop-types';

const ObjectSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    };

    return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
        type="text"
        placeholder="Buscar por título, descripción, categoría o color..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
        Buscar
        </button>
    </form>
    );
};

ObjectSearch.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default ObjectSearch;