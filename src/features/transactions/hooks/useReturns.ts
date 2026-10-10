import { useState, useEffect, useCallback } from 'react';
import type {
    Return,
} from '../types/return.types';
import { returnService } from '../../../services/returnService';
import { getErrorMessage } from '../../../utils/api-helpers';

export interface UseReturnsReturn {
    items: Return[];
    pagination: PaginationMeta;
    loading: boolean;
    error: string | null;
    threshold: number | null;
    refetch: () => Promise<void>;
    approveReturn: (id: number | string) => Promise<void>;
    rejectReturn: (id: number | string, reason: string) => Promise<void>;
}

const DEFAULT_LIMIT = 10;

export const useReturns = (): UseReturnsReturn => {
    const [items, setItems] = useState<Return[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: DEFAULT_LIMIT,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threshold, setThresholdValue] = useState<number | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await returnService.getAll();
            setItems(data ?? []);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: data?.length ?? 0,
                itemsPerPage: DEFAULT_LIMIT,
            });
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch returns'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchThreshold = useCallback(async () => {
        try {
            const data = await returnService.getThreshold();
            setThresholdValue(data.threshold);
        } catch (err: unknown) {
            console.warn('Failed to fetch threshold:', getErrorMessage(err, 'Failed to fetch threshold'));
        }
    }, []);

    useEffect(() => {
        fetchAll();
        fetchThreshold();
    }, [fetchAll, fetchThreshold]);

    const setThreshold = useCallback(async (value: number) => {
        await returnService.setThreshold(value);
        setThresholdValue(value);
    }, []);

    const approveReturn = useCallback(async (id: number | string) => {
        await returnService.approve(id);
        await fetchAll();
    }, [fetchAll]);

    const rejectReturn = useCallback(async (id: number | string, reason: string) => {
        await returnService.reject(id, reason);
        await fetchAll();
    }, [fetchAll]);

    const getReturnById = useCallback(async (id: number | string) => {
        return await returnService.getById(id);
    }, []);

    return {
        items,
        pagination,
        loading,
        error,
        threshold,
        setThreshold,
        refetch: fetchAll,
        approveReturn,
        rejectReturn,
        getReturnById,
    };
};