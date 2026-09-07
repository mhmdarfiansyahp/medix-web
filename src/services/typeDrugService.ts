import { apiClient } from './api';
import type {
    TypeDrug,
    CreateTypeDrugRequest,
    UpdateTypeDrugRequest,
} from '../features/drugs/types/Category.types';
import { encodePathParam, extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/type-drugs';

export const typeDrugService = {
    getAll: async (): Promise<TypeDrug[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: TypeDrug[];
        }>(ENDPOINT);
        return extractResponseData<TypeDrug[]>(res, 'Type drugs');
    },

    getById: async (id: number): Promise<TypeDrug> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: TypeDrug;
        }>(`${ENDPOINT}/${encodePathParam(id)}`);
        return extractResponseData<TypeDrug>(res, 'Type drug');
    },

    create: async (payload: CreateTypeDrugRequest): Promise<TypeDrug> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: TypeDrug;
        }>(ENDPOINT, payload);
        return extractResponseData<TypeDrug>(res, 'Created type drug');
    },

    update: async (id: number, payload: UpdateTypeDrugRequest): Promise<TypeDrug> => {
        const res = await apiClient.put<{
            status: string;
            message: string;
            data?: TypeDrug;
        }>(`${ENDPOINT}/${encodePathParam(id)}`, payload);
        return extractResponseData<TypeDrug>(res, 'Updated type drug');
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${encodePathParam(id)}`);
    },
};
