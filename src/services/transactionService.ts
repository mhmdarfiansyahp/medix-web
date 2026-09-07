import { apiClient } from './api';
import type {
    Transaction,
    CreateTransactionRequest,
    CancelTransactionResponse,
    TodayTransactionResponse,
    ReceiptData,
} from '../features/transactions/types/transaction.types';
import { encodePathParam, extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/transactions';

export const transactionService = {
    getAll: async (): Promise<Transaction[]> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Transaction[];
        }>(ENDPOINT);
        return extractResponseData<Transaction[]>(res, 'Transactions');
    },

    getToday: async (): Promise<TodayTransactionResponse> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: TodayTransactionResponse;
        }>(`${ENDPOINT}/today`);
        return extractResponseData<TodayTransactionResponse>(res, 'Today transactions');
    },

    getById: async (id: number | string): Promise<Transaction> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: Transaction;
        }>(`${ENDPOINT}/${encodePathParam(id)}`);
        return extractResponseData<Transaction>(res, 'Transaction');
    },

    create: async (payload: CreateTransactionRequest): Promise<Transaction> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: Transaction;
        }>(ENDPOINT, payload);
        return extractResponseData<Transaction>(res, 'Created transaction');
    },

    cancel: async (id: number | string): Promise<CancelTransactionResponse> => {
        const res = await apiClient.patch<{
            status: string;
            message: string;
            data?: CancelTransactionResponse;
        }>(`${ENDPOINT}/${encodePathParam(id)}/cancel`, {});
        return extractResponseData<CancelTransactionResponse>(res, 'Cancelled transaction');
    },

    getReceipt: async (id: number | string): Promise<ReceiptData> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: ReceiptData;
        }>(`${ENDPOINT}/${encodePathParam(id)}/receipt`);
        return extractResponseData<ReceiptData>(res, 'Transaction receipt');
    },
};
