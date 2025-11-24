import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserProfile } from '../services/authService';

export const useUserRole = () => {
    const { currentUser } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchRole = async () => {
        if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
        }

        try {
        const result = await getUserProfile(currentUser.uid);
        if (result.success) {
            setRole(result.data.role);
        }
        } catch (error) {
        console.error('Error al obtener rol:', error);
        setRole(null);
        } finally {
        setLoading(false);
        }
    };

    fetchRole();
    }, [currentUser]);

    const isAdmin = role === 'admin';
    const isSecurity = role === 'security' || role === 'admin';
    const isStudent = role === 'student';

    return {
    role,
    loading,
    isAdmin,
    isSecurity,
    isStudent
    };
};