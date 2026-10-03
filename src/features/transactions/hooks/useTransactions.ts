import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
    Transaction,
    CreateTransactionRequest,
    TodayTransactionResponse,
} from '../types/transaction.types';
import type { PaginationMeta } from '../../../types/api.types';
import { transactionService } from '../../../services/transactionService';
import { getErrorMessage } from '../../../utils/api-helpers';

const DEFAULT_LIMIT = 10;

export const useTransactions = () => {
    const [allItems, setAllItems] = useState<Transaction[]>([]);
    const [todayData, setTodayData] = useState<TodayTransactionResponse | null>(null);
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

    const fetchToday = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionService.getToday();
            setTodayData(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch today transactions'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
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
        await fetchToday();
        return newItem;
    };

    const cancelItem = async (id: number | string) => {
        const updated = await transactionService.cancel(id);
        await fetchAll();
        await fetchToday();
        return updated;
    };

    return {
        items,
        allItems,
        todayData,
        pagination,
        loading,
        error,
        page,
        setPage,
        limit,
        setLimit,
        refetch: fetchAll,
        refetchToday: fetchToday,
        createItem,
        cancelItem,
    };
};
