import { db } from '../firebase/config';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where,
    Timestamp 
} from 'firebase/firestore';

export const createDelivery = async (deliveryData) => {
    try {
    const deliveriesRef = collection(db, 'deliveries');
    const docRef = await addDoc(deliveriesRef, {
        ...deliveryData,
        deliveredAt: Timestamp.now()
    });

    return { success: true, id: docRef.id };
    } catch (error) {
    console.error('Error al crear comprobante:', error);
    return { success: false, error: error.message };
    }
};

export const getDeliveriesForObject = async (objectId) => {
    try {
    const deliveriesRef = collection(db, 'deliveries');
    const q = query(deliveriesRef, where('objectId', '==', objectId));
    const querySnapshot = await getDocs(q);
    
    const deliveries = [];
    querySnapshot.forEach((doc) => {
        deliveries.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: deliveries };
    } catch (error) {
    console.error('Error al obtener entregas:', error);
    return { success: false, error: error.message };
    }
};

export const getDeliveriesByUser = async (userId) => {
    try {
    const deliveriesRef = collection(db, 'deliveries');
    const q = query(deliveriesRef, where('deliveredBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const deliveries = [];
    querySnapshot.forEach((doc) => {
        deliveries.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: deliveries };
    } catch (error) {
    console.error('Error al obtener entregas:', error);
    return { success: false, error: error.message };
    }
};

export const getDeliveriesReceivedByUser = async (userId) => {
    try {
    const deliveriesRef = collection(db, 'deliveries');
    const q = query(deliveriesRef, where('claimantId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const deliveries = [];
    querySnapshot.forEach((doc) => {
        deliveries.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: deliveries };
    } catch (error) {
    console.error('Error al obtener entregas:', error);
    return { success: false, error: error.message };
    }
};