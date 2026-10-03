import { apiClient } from './api';
import type {
    ReportFilterParams,
    SalesSummaryResponse,
    DrugRankingResponse,
} from '../features/reports/types/report.types';
import { extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/reports';

export const reportService = {
    getSalesSummary: async (params?: ReportFilterParams): Promise<SalesSummaryResponse> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: SalesSummaryResponse;
        }>(`${ENDPOINT}/sales-summary`, { params: params as Record<string, unknown> });
        return extractResponseData<SalesSummaryResponse>(res, 'Sales summary');
    },

    getDrugRanking: async (params?: ReportFilterParams): Promise<DrugRankingResponse> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: DrugRankingResponse;
        }>(`${ENDPOINT}/drug-ranking`, { params: params as Record<string, unknown> });
        return extractResponseData<DrugRankingResponse>(res, 'Drug ranking');
    },

    exportExcel: async (params?: ReportFilterParams): Promise<Blob> => {
        return apiClient.getBlob(`${ENDPOINT}/export/excel`, { params: params as Record<string, unknown> });
    },
};
