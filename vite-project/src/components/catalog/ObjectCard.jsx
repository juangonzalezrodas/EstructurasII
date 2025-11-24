import { formatDate, getStatusText, truncateText } from '../../utils/helpers';
import { OBJECT_CATEGORIES, COLORS, CAMPUS_LOCATIONS } from '../../utils/constants';
import styles from './ObjectCard.scss';
import PropTypes from 'prop-types';

const ObjectCard = ({ object, onClick }) => {
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

    return (
    <div className={styles.card} onClick={() => onClick(object)}>
        <div className={styles.imageContainer}>
        <img 
            src={object.imageUrl || '/placeholder-image.png'} 
            alt={object.title}
            className={styles.image}
        />
        <span className={`${styles.statusBadge} ${styles[object.status]}`}>
            {getStatusText(object.status)}
        </span>
        </div>

        <div className={styles.content}>
        <h3 className={styles.title}>{object.title}</h3>
        <p className={styles.description}>
            {truncateText(object.description, 80)}
        </p>

        <div className={styles.details}>
            <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Categoría:</span>
            <span className={styles.detailValue}>
                {getCategoryLabel(object.category)}
            </span>
            </div>

            <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Color:</span>
            <span className={styles.detailValue}>
                {getColorLabel(object.color)}
            </span>
            </div>

            <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Encontrado en:</span>
            <span className={styles.detailValue}>
                {getLocationLabel(object.location)}
            </span>
            </div>

            <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fecha:</span>
            <span className={styles.detailValue}>
                {formatDate(object.foundDate)}
            </span>
            </div>
        </div>

        <button className={styles.viewButton}>
            Ver Detalles
        </button>
        </div>
    </div>
    );
};

ObjectCard.propTypes = {
    object: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    location: PropTypes.string.isRequired,
    foundDate: PropTypes.any.isRequired,
    status: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default ObjectCard;