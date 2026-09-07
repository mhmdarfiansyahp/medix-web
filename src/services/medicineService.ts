import { apiClient } from './api';
import type {
    Drug,
    CreateDrugRequest,
    UpdateDrugRequest,
    DrugFilterParams,
    LowStockDrug,
    ExpiringDrug,
    AlertSummary,
} from '../features/drugs/types/Drug.types';
import { encodePathParam, extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/medicines';

export const medicineService = {
    getAll: async (params?: DrugFilterParams): Promise<Drug[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Drug[];
        }>(ENDPOINT, { params: params as Record<string, unknown> });
        return extractResponseData<Drug[]>(res, 'Medicines');
    },

    getById: async (id: number | string): Promise<Drug> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Drug;
        }>(`${ENDPOINT}/${encodePathParam(id)}`);
        return extractResponseData<Drug>(res, 'Medicine');
    },

    getByBarcode: async (barcode: string): Promise<Drug> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Drug;
        }>(`${ENDPOINT}/barcode/${encodePathParam(barcode)}`);
        return extractResponseData<Drug>(res, 'Medicine');
    },

    create: async (payload: CreateDrugRequest): Promise<Drug> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: Drug;
        }>(ENDPOINT, payload);
        return extractResponseData<Drug>(res, 'Created medicine');
    },

    update: async (id: number | string, payload: UpdateDrugRequest): Promise<Drug> => {
        const res = await apiClient.put<{
            status: string;
            message: string;
            data?: Drug;
        }>(`${ENDPOINT}/${encodePathParam(id)}`, payload);
        return extractResponseData<Drug>(res, 'Updated medicine');
    },

    toggleStatus: async (id: number | string, isActive: boolean): Promise<void> => {
        await apiClient.patch<{
            status: string;
            message: string;
            data?: null;
        }>(`${ENDPOINT}/${encodePathParam(id)}/status`, { is_active: isActive });
    },

    delete: async (id: number | string): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${encodePathParam(id)}`);
    },

    getLowStock: async (): Promise<LowStockDrug[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: LowStockDrug[];
        }>(`${ENDPOINT}/alerts/low-stock`);
        return extractResponseData<LowStockDrug[]>(res, 'Low stock alerts');
    },

    getExpiring: async (): Promise<ExpiringDrug[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: ExpiringDrug[];
        }>(`${ENDPOINT}/alerts/expiring`);
        return extractResponseData<ExpiringDrug[]>(res, 'Expiring alerts');
    },

    getAlertSummary: async (): Promise<AlertSummary> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: AlertSummary;
        }>(`${ENDPOINT}/alerts/summary`);
        return extractResponseData<AlertSummary>(res, 'Alert summary');
    },
};
