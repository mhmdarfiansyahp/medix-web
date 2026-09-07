import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
    Drug,
    CreateDrugRequest,
    UpdateDrugRequest,
    DrugFilterParams,
} from '../types/Drug.types';
import type { PaginationMeta } from '../../../types/api.types';
import { medicineService } from '../../../services/medicineService';
import { getErrorMessage } from '../../../utils/api-helpers';

const DEFAULT_LIMIT = 10;

export const useMedicines = (initialParams?: DrugFilterParams) => {
    const [allItems, setAllItems] = useState<Drug[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<DrugFilterParams | undefined>(initialParams);

    const fetchAll = useCallback(async (overrideParams?: DrugFilterParams) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = overrideParams ?? params;
            const data = await medicineService.getAll(queryParams);
            setAllItems(data ?? []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch medicines'));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount/filter change.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll(params);
    }, [params, fetchAll]);

    const pagination = useMemo<PaginationMeta>(() => {
        const currentPage = params?.page ?? 1;
        const itemsPerPage = params?.limit ?? DEFAULT_LIMIT;
        const totalItems = allItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        return {
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
        };
    }, [allItems.length, params]);

    const items = useMemo<Drug[]>(() => {
        const currentPage = params?.page ?? 1;
        const itemsPerPage = params?.limit ?? DEFAULT_LIMIT;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return allItems.slice(start, end);
    }, [allItems, params]);

    const createItem = async (payload: CreateDrugRequest) => {
        const newItem = await medicineService.create(payload);
        await fetchAll(params);
        return newItem;
    };

    const updateItem = async (id: number | string, payload: UpdateDrugRequest) => {
        const updated = await medicineService.update(id, payload);
        await fetchAll(params);
        return updated;
    };

    const toggleStatus = async (id: number | string, isActive: boolean) => {
        await medicineService.toggleStatus(id, isActive);
        await fetchAll(params);
    };

    const deleteItem = async (id: number | string) => {
        await medicineService.delete(id);
        await fetchAll(params);
    };

    const getByBarcode = async (barcode: string) => {
        return await medicineService.getByBarcode(barcode);
    };

    return {
        items,
        allItems,
        pagination,
        loading,
        error,
        params,
        setParams,
        refetch: () => fetchAll(params),
        createItem,
        updateItem,
        toggleStatus,
        deleteItem,
        getByBarcode,
    };
};
