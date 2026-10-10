import { apiClient } from './api';
import type {
    Return,
    CreateReturnRequest,
    ReturnResponse,
    ApproveReturnResponse,
    RejectReturnResponse,
    ThresholdResponse,
} from '../features/transactions/types/return.types';
import { encodePathParam, extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/transactions/returns';

export const returnService = {
    getAll: async (): Promise<Return[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Return[];
        }>(ENDPOINT);
        return extractResponseData<Return[]>(res, 'Returns');
    },

    getById: async (id: number | string): Promise<Return> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Return;
        }>(`${ENDPOINT}/${encodePathParam(id)}/view`);
        return extractResponseData<Return>(res, 'Return details');
    },

    approve: async (id: number | string): Promise<ApproveReturnResponse> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: ApproveReturnResponse;
        }>(`${ENDPOINT}/${encodePathParam(id)}/approve`, {});
        return extractResponseData<ApproveReturnResponse>(res, 'Approve return');
    },

    reject: async (id: number | string, reason: string): Promise<RejectReturnResponse> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: RejectReturnResponse;
        }>(`${ENDPOINT}/${encodePathParam(id)}/reject`, { alasan: reason });
        return extractResponseData<RejectReturnResponse>(res, 'Reject return');
    },

    getThreshold: async (): Promise<ThresholdResponse> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: ThresholdResponse;
        }>(`${ENDPOINT}/threshold`);
        return extractResponseData<ThresholdResponse>(res, 'Return threshold');
    },

    setThreshold: async (threshold: number): Promise<ThresholdResponse> => {
        const res = await apiClient.put<{
            status: string;
            message: string;
            data?: ThresholdResponse;
        }>(`${ENDPOINT}/threshold`, { threshold });
        return extractResponseData<ThresholdResponse>(res, 'Set return threshold');
    },
};