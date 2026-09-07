import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/user.types';
import { authService } from '../../../services/authService';
import { getErrorMessage } from '../../../utils/api-helpers';

export interface UseProfileReturn {
    profile: User | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateProfile: (payload: Partial<User>) => Promise<User>;
}

export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.getProfile();
            setProfile(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch profile'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (payload: Partial<User>): Promise<User> => {
        const updated = await authService.updateProfile(payload);
        setProfile(updated);
        return updated;
    };

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateProfile,
    };
};
