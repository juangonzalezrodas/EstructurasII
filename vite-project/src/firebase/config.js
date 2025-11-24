// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMBQD-C6a3WCPvhyIoVACT8BcNqCGr08k",
    authDomain: "nexo-uao.firebaseapp.com",
    projectId: "nexo-uao",
    storageBucket: "nexo-uao.firebasestorage.app",
    messagingSenderId: "16371093885",
    appId: "1:16371093885:web:be08180c08ac7608e2bc14",
    measurementId: "G-ZY37GC4GVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)