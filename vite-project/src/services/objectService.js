import { db, storage } from '../firebase/config';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

export const compressImage = async (imageFile) => {
    const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true
    };

    try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
    } catch (error) {
    console.error('Error al comprimir imagen:', error);
    return imageFile;
    }
};

export const uploadObjectImage = async (imageFile, objectId) => {
    try {
    const compressedImage = await compressImage(imageFile);
    const storageRef = ref(storage, `objects/${objectId}/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, compressedImage);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
    } catch (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, error: error.message };
    }
};

export const registerObject = async (objectData, imageFile) => {
    try {
    const objectsRef = collection(db, 'objects');
    const docRef = await addDoc(objectsRef, {
        ...objectData,
        status: 'available',
        createdAt: Timestamp.now(),
        foundDate: Timestamp.fromDate(new Date(objectData.foundDate))
    });

    const imageResult = await uploadObjectImage(imageFile, docRef.id);
    
    if (imageResult.success) {
        await updateDoc(doc(db, 'objects', docRef.id), {
        imageUrl: imageResult.url
        });
    }

    return { success: true, id: docRef.id };
    } catch (error) {
    console.error('Error al registrar objeto:', error);
    return { success: false, error: error.message };
    }
};

export const getAllObjects = async (filters = {}) => {
    try {
    const objectsRef = collection(db, 'objects');
    const q = query(objectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let objects = [];
    querySnapshot.forEach((doc) => {
        objects.push({
        id: doc.id,
        ...doc.data()
        });
    });

    console.log('📦 Total objetos antes de filtrar:', objects.length); // Debug
    console.log('🔍 Filtros recibidos en servicio:', filters); // Debug

    // FILTRAR EN EL CLIENTE
    if (filters.status) {
        console.log('🎯 Filtrando por status:', filters.status);
        objects = objects.filter(obj => obj.status === filters.status);
    }
    
    if (filters.category) {
        console.log('🎯 Filtrando por categoría:', filters.category);
        objects = objects.filter(obj => obj.category === filters.category);
    }
    
    if (filters.color) {
        console.log('🎯 Filtrando por color:', filters.color);
        objects = objects.filter(obj => obj.color === filters.color);
    }
    
    if (filters.location) {
        console.log('🎯 Filtrando por ubicación:', filters.location);
        objects = objects.filter(obj => obj.location === filters.location);
    }

    console.log('✅ Objetos después de filtrar:', objects.length); // Debug

    return { success: true, data: objects };
    } catch (error) {
    console.error('❌ Error al obtener objetos:', error);
    return { success: false, error: error.message };
    }
};

export const getObjectById = async (objectId) => {
    try {
    const objectRef = doc(db, 'objects', objectId);
    const objectSnap = await getDoc(objectRef);
    
    if (objectSnap.exists()) {
        return { 
        success: true, 
        data: { id: objectSnap.id, ...objectSnap.data() } 
        };
    } else {
        return { success: false, error: 'Objeto no encontrado' };
    }
    } catch (error) {
    console.error('Error al obtener objeto:', error);
    return { success: false, error: error.message };
    }
};

export const updateObjectStatus = async (objectId, newStatus, additionalData = {}) => {
    try {
    const objectRef = doc(db, 'objects', objectId);
    await updateDoc(objectRef, {
        status: newStatus,
        ...additionalData,
        updatedAt: Timestamp.now()
    });

    return { success: true };
    } catch (error) {
    console.error('Error al actualizar objeto:', error);
    return { success: false, error: error.message };
    }
};

export const searchObjects = async (searchTerm) => {
    try {
    const objectsRef = collection(db, 'objects');
    const q = query(objectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const objects = [];
    querySnapshot.forEach((doc) => {
        objects.push({
        id: doc.id,
        ...doc.data()
        });
    });

    const searchLower = searchTerm.toLowerCase();
    const filtered = objects.filter(obj => 
        obj.title.toLowerCase().includes(searchLower) ||
        obj.description.toLowerCase().includes(searchLower) ||
        obj.category.toLowerCase().includes(searchLower) ||
        obj.color.toLowerCase().includes(searchLower)
    );

    return { success: true, data: filtered };
    } catch (error) {
    console.error('Error al buscar objetos:', error);
    return { success: false, error: error.message };
    }
};