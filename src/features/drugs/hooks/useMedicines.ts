import { useState, useEffect, useCallback } from 'react';
import type {
    Drug,
    CreateDrugRequest,
    UpdateDrugRequest,
} from '../types/Drug.types';
import { medicineService } from '../../../services/medicineService';
import { getErrorMessage } from '../../../utils/api-helpers';

export const useMedicines = () => {
    const [allItems, setAllItems] = useState<Drug[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await medicineService.getAll();
            setAllItems(data ?? []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch medicines'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll();
    }, [fetchAll]);

    const createItem = async (payload: CreateDrugRequest) => {
        const newItem = await medicineService.create(payload);
        await fetchAll();
        return newItem;
    };

    const updateItem = async (id: number | string, payload: UpdateDrugRequest) => {
        const updated = await medicineService.update(id, payload);
        await fetchAll();
        return updated;
    };

    const toggleStatus = async (id: number | string, isActive: boolean) => {
        await medicineService.toggleStatus(id, isActive);
        await fetchAll();
    };

    const deleteItem = async (id: number | string) => {
        await medicineService.delete(id);
        await fetchAll();
    };

    const getByBarcode = async (barcode: string) => {
        return await medicineService.getByBarcode(barcode);
    };

    return {
        items: allItems,
        loading,
        error,
        refetch: fetchAll,
        createItem,
        updateItem,
        toggleStatus,
        deleteItem,
        getByBarcode,
    };
};
