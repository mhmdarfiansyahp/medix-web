import { useState, useEffect, useCallback } from 'react';
import type { TypeDrug, CreateTypeDrugRequest, UpdateTypeDrugRequest } from '../types/Category.types';
import { typeDrugService } from '../../../services/typeDrugService';

export const useTypeDrugs = () => {
    const [items, setItems] = useState<TypeDrug[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await typeDrugService.getAll();
            setItems(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
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