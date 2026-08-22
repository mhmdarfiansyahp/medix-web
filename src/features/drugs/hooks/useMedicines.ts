import { useState, useEffect, useCallback } from 'react';
import type {
    Drug,
    CreateDrugRequest,
    UpdateDrugRequest,
    DrugFilterParams
} from '../types/Drug.types';
import { medicineService } from '../../../services/medicineService';

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export const useMedicines = (initialParams?: DrugFilterParams) => {
    const [items, setItems] = useState<Drug[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<DrugFilterParams | undefined>(initialParams);

    // Fetch data menerima param secara eksplisit
    const fetchAll = useCallback(async (overrideParams?: DrugFilterParams) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = overrideParams ?? params;
            const data = await medicineService.getAll(queryParams);

            if (Array.isArray(data)) {
                setItems(data);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch medicines');
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Refetch otomatis ketika params berubah
    useEffect(() => {
        fetchAll(params);
    }, [params]);

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

    const toggleStatus = async (id: number | string) => {
        const updated = await medicineService.toggleStatus(id);
        await fetchAll(params);
        return updated;
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