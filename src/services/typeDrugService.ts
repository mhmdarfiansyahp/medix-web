import { fetchClient } from './api';
import type {
    TypeDrug,
    CreateTypeDrugRequest,
    UpdateTypeDrugRequest,
    ApiResponse
} from '../features/drugs/types/Category.types';

const ENDPOINT = '/type-drugs';

export const typeDrugService = {
    getAll: async (): Promise<TypeDrug[]> => {
        const res = await fetchClient<ApiResponse<TypeDrug[]>>(ENDPOINT);
        return res.data || [];
    },

    getById: async (id: number): Promise<TypeDrug> => {
        const res = await fetchClient<ApiResponse<TypeDrug>>(`${ENDPOINT}/${id}`);
        return res.data!;
    },

    create: async (payload: CreateTypeDrugRequest): Promise<TypeDrug> => {
        const res = await fetchClient<ApiResponse<TypeDrug>>(ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return res.data!;
    },

    update: async (id: number, payload: UpdateTypeDrugRequest): Promise<TypeDrug> => {
        const res = await fetchClient<ApiResponse<TypeDrug>>(`${ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        return res.data!;
    },

    delete: async (id: number): Promise<void> => {
        await fetchClient<ApiResponse<null>>(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    },
};