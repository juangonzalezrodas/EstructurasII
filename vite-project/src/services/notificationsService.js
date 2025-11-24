import { db } from '../firebase/config';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where,
    orderBy,
    updateDoc,
    doc,
    Timestamp 
} from 'firebase/firestore';

// Crear una notificación
export const createNotification = async (userId, title, message, type = 'info', metadata = {}) => {
    try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
        userId,
        title,
        message,
      type, // 'info', 'success', 'warning', 'match'
        read: false,
        metadata,
        createdAt: Timestamp.now()
    });

    return { success: true, id: docRef.id };
    } catch (error) {
    console.error('Error al crear notificación:', error);
    return { success: false, error: error.message };
    }
};

// Obtener notificaciones de un usuario
export const getUserNotifications = async (userId) => {
    try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
        notificationsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
        notifications.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: notifications };
    } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return { success: false, error: error.message };
    }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (notificationId) => {
    try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
        read: true,
        readAt: Timestamp.now()
    });

    return { success: true };
    } catch (error) {
    console.error('Error al marcar notificación:', error);
    return { success: false, error: error.message };
    }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async (userId) => {
        try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
        notificationsRef, 
        where('userId', '==', userId),
        where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = [];
    querySnapshot.forEach((document) => {
        const notificationRef = doc(db, 'notifications', document.id);
        updatePromises.push(updateDoc(notificationRef, {
        read: true,
        readAt: Timestamp.now()
        }));
    });

    await Promise.all(updatePromises);

    return { success: true };
    } catch (error) {
    console.error('Error al marcar notificaciones:', error);
    return { success: false, error: error.message };
    }
};

// Notificar coincidencia a un usuario
export const notifyMatch = async (userId, objectTitle, ticketTitle, similarity) => {
    const title = '🎉 ¡Posible Coincidencia Encontrada!';
    const message = `Encontramos un objeto que coincide ${similarity}% con tu reporte "${ticketTitle}". El objeto es: "${objectTitle}".`;
  
    return await createNotification(userId, title, message, 'match', {
    objectTitle,
    ticketTitle,
    similarity
    });
};