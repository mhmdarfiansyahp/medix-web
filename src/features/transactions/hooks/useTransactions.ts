import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
    Transaction,
    CreateTransactionRequest,
} from '../types/transaction.types';
import type { PaginationMeta } from '../../../types/api.types';
import { transactionService } from '../../../services/transactionService';
import { getErrorMessage } from '../../../utils/api-helpers';

const DEFAULT_LIMIT = 10;

export const useTransactions = () => {
    const [allItems, setAllItems] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionService.getAll();
            setAllItems(data ?? []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch transactions'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll();
    }, [fetchAll]);

    const pagination = useMemo<PaginationMeta>(() => {
        const totalItems = allItems.length;
        const totalPages = Math.ceil(totalItems / limit) || 1;
        return {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
        };
    }, [allItems.length, page, limit]);

    const items = useMemo<Transaction[]>(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return allItems.slice(start, end);
    }, [allItems, page, limit]);

    const createItem = async (payload: CreateTransactionRequest) => {
        const newItem = await transactionService.create(payload);
        await fetchAll();
        return newItem;
    };

    const cancelItem = async (id: number | string) => {
        const updated = await transactionService.cancel(id);
        await fetchAll();
        return updated;
    };

    return {
        items,
        allItems,
        pagination,
        loading,
        error,
        page,
        setPage,
        limit,
        setLimit,
        refetch: fetchAll,
        createItem,
        cancelItem,
    };
};
