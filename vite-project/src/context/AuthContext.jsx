import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut 
} from 'firebase/auth';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
    });

    return unsubscribe;
    }, []);

    const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
    };

    const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
    return signOut(auth);
    };

    const value = {
    currentUser,
    login,
    register,
    logout,
    loading
    };

    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};