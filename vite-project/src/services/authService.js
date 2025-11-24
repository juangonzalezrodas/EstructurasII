import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const createUserProfile = async (uid, userData) => {
    try {
    const userRef = doc(db, 'users', uid);
    
    // Detectar si es admin por email
    const isAdmin = userData.email === 'administrador@uao.edu.co';
    
    await setDoc(userRef, {
        uid,
        email: userData.email,
        name: userData.name,
        idNumber: userData.idNumber,
        role: isAdmin ? 'admin' : (userData.role || 'student'),
        createdAt: new Date()
    });
    
    return { success: true };
    } catch (error) {
    console.error('Error al crear perfil:', error);
    return { success: false, error: error.message };
    }
};

export const getUserProfile = async (uid) => {
    try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
    } else {
        return { success: false, error: 'Usuario no encontrado' };
    }
    } catch (error) {
    console.error('Error al obtener perfil:', error);
    return { success: false, error: error.message };
    }
};