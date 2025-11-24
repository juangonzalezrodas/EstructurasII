import { db } from '../firebase/config';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    query, 
    where,
    orderBy,
    Timestamp,
    getDoc
} from 'firebase/firestore';

export const createTicket = async (ticketData, userId) => {
    try {
    const ticketsRef = collection(db, 'tickets');
    const docRef = await addDoc(ticketsRef, {
        ...ticketData,
        userId,
        status: 'pending',
        createdAt: Timestamp.now(),
        lostDate: Timestamp.fromDate(new Date(ticketData.lostDate))
    });

    return { success: true, id: docRef.id };
    } catch (error) {
    console.error('Error al crear ticket:', error);
    return { success: false, error: error.message };
    }
};

export const getUserTickets = async (userId) => {
    try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(
        ticketsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tickets = [];
    
    querySnapshot.forEach((doc) => {
        tickets.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: tickets };
    } catch (error) {
    console.error('Error al obtener tickets:', error);
    return { success: false, error: error.message };
    }
};

export const getAllTickets = async () => {
    try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const tickets = [];
    
    querySnapshot.forEach((doc) => {
        tickets.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: tickets };
    } catch (error) {
    console.error('Error al obtener tickets:', error);
    return { success: false, error: error.message };
    }
};

export const updateTicketStatus = async (ticketId, newStatus, additionalData = {}) => {
    try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
        status: newStatus,
        ...additionalData,
        updatedAt: Timestamp.now()
    });

    return { success: true };
    } catch (error) {
    console.error('Error al actualizar ticket:', error);
    return { success: false, error: error.message };
    }
};

export const cancelTicket = async (ticketId) => {
    try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
        status: 'cancelled',
        cancelledAt: Timestamp.now()
    });

    return { success: true };
    } catch (error) {
    console.error('Error al cancelar ticket:', error);
    return { success: false, error: error.message };
    }
};

export const getTicketById = async (ticketId) => {
    try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);
    
    if (ticketSnap.exists()) {
        return { 
        success: true, 
        data: { id: ticketSnap.id, ...ticketSnap.data() } 
        };
    } else {
        return { success: false, error: 'Ticket no encontrado' };
    }
    } catch (error) {
    console.error('Error al obtener ticket:', error);
    return { success: false, error: error.message };
    }
};