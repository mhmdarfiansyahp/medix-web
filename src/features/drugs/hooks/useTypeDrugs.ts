import { useState, useEffect, useCallback } from 'react';
import type { TypeDrug, CreateTypeDrugRequest, UpdateTypeDrugRequest } from '../types/Category.types';
import { typeDrugService } from '../../../services/typeDrugService';
import { getErrorMessage } from '../../../utils/api-helpers';

export const useTypeDrugs = () => {
    const [items, setItems] = useState<TypeDrug[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await typeDrugService.getAll();
            setItems(data ?? []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch drug categories'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll();
    }, [fetchAll]);

    const createItem = async (payload: CreateTypeDrugRequest) => {
        const newItem = await typeDrugService.create(payload);
        await fetchAll();
        return newItem;
    };

    const updateItem = async (id: number, payload: UpdateTypeDrugRequest) => {
        const updated = await typeDrugService.update(id, payload);
        await fetchAll();
        return updated;
    };

    const deleteItem = async (id: number) => {
        await typeDrugService.delete(id);
        await fetchAll();
    };

    return { items, loading, error, fetchAll, createItem, updateItem, deleteItem };
};
