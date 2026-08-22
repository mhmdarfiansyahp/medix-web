import { fetchClient } from './api';
import type {
    Drug,
    CreateDrugRequest,
    UpdateDrugRequest,
    DrugFilterParams,
    ApiResponse
} from '../features/drugs/types/Drug.types';

const ENDPOINT = '/medicines';

export const medicineService = {
    getAll: async (params?: DrugFilterParams): Promise<Drug[]> => {
        const query = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query.append(key, String(value));
                }
            });
        }

        const queryString = query.toString();
        const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;

        const res = await fetchClient<ApiResponse<Drug[]>>(url);
        return res.data || [];
    },

    getById: async (id: number | string): Promise<Drug> => {
        const res = await fetchClient<ApiResponse<Drug>>(`${ENDPOINT}/${id}`);
        return res.data!;
    },

    getByBarcode: async (barcode: string): Promise<Drug> => {
        const res = await fetchClient<ApiResponse<Drug>>(`${ENDPOINT}/barcode/${barcode}`);
        return res.data!;
    },

    create: async (payload: CreateDrugRequest): Promise<Drug> => {
        const res = await fetchClient<ApiResponse<Drug>>(ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return res.data!;
    },

    update: async (id: number | string, payload: UpdateDrugRequest): Promise<Drug> => {
        const res = await fetchClient<ApiResponse<Drug>>(`${ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        return res.data!;
    },

    toggleStatus: async (id: number | string): Promise<Drug> => {
        const res = await fetchClient<ApiResponse<Drug>>(`${ENDPOINT}/${id}/status`, {
            method: 'PATCH',
        });
        return res.data!;
    },

    delete: async (id: number | string): Promise<void> => {
        await fetchClient<ApiResponse<null>>(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    },

    // Alerts
    getLowStock: async (): Promise<Drug[]> => {
        const res = await fetchClient<ApiResponse<Drug[]>>(`${ENDPOINT}/alerts/low-stock`);
        return res.data || [];
    },

    getExpiring: async (): Promise<Drug[]> => {
        const res = await fetchClient<ApiResponse<Drug[]>>(`${ENDPOINT}/alerts/expiring`);
        return res.data || [];
    },

    getAlertSummary: async (): Promise<{ low_stock_count: number; expiring_count: number }> => {
        const res = await fetchClient<ApiResponse<{ low_stock_count: number; expiring_count: number }>>(`${ENDPOINT}/alerts/summary`);
        return res.data!;
    },
};