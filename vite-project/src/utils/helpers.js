import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date) => {
    if (!date) return '';
    try {
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '';
    }
};

export const formatDateTime = (date) => {
    if (!date) return '';
    try {
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return format(dateObj, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es });
    } catch (error) {
    console.error('Error al formatear fecha/hora:', error);
    return '';
    }
};

export const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 100;
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    let matches = 0;
    words1.forEach(word => {
    if (words2.includes(word)) matches++;
    });
  const similarity = (matches / Math.max(words1.length, words2.length)) * 100;
    return Math.round(similarity);
};

export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getStatusText = (status) => {
    const statusTexts = {
    available: 'Disponible',
    delivered: 'Entregado',
    pending: 'Pendiente',
    matched: 'Coincidencia Encontrada',
    resolved: 'Resuelto',
    cancelled: 'Cancelado'
    };
    return statusTexts[status] || status;
};