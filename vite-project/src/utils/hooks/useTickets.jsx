import { useState, useEffect } from 'react';
import { getUserTickets } from '../services/ticketService';
import { useAuth } from './useAuth';

export const useTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const fetchTickets = async () => {
    if (!currentUser) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
        const result = await getUserTickets(currentUser.uid);

        if (result.success) {
        setTickets(result.data);
        } else {
        setError(result.error);
        }
    } catch (err) {
        setError('Error al cargar los tickets');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchTickets();
    }, [currentUser]);

    const refreshTickets = () => {
    fetchTickets();
    };

    return {
    tickets,
    loading,
    error,
    refreshTickets
    };
};