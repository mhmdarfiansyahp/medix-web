import { useState, useCallback } from 'react';
import type {
    ReportFilterParams,
    SalesSummaryResponse,
    DrugRankingResponse,
} from '../types/report.types';
import { reportService } from '../../../services/reportService';
import { getErrorMessage } from '../../../utils/api-helpers';

export interface UseReportsReturn {
    salesSummary: SalesSummaryResponse | null;
    drugRanking: DrugRankingResponse | null;
    loading: boolean;
    error: string | null;
    fetchSalesSummary: (params?: ReportFilterParams) => Promise<void>;
    fetchDrugRanking: (params?: ReportFilterParams) => Promise<void>;
    downloadExcel: (params?: ReportFilterParams) => Promise<void>;
}

export const useReports = (): UseReportsReturn => {
    const [salesSummary, setSalesSummary] = useState<SalesSummaryResponse | null>(null);
    const [drugRanking, setDrugRanking] = useState<DrugRankingResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSalesSummary = useCallback(async (params?: ReportFilterParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await reportService.getSalesSummary(params);
            setSalesSummary(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch sales summary'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDrugRanking = useCallback(async (params?: ReportFilterParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await reportService.getDrugRanking(params);
            setDrugRanking(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch drug ranking'));
        } finally {
            setLoading(false);
        }
    }, []);

    const downloadExcel = useCallback(async (params?: ReportFilterParams) => {
        setError(null);
        try {
            const blob = await reportService.exportExcel(params);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to download report'));
        }
    }, []);

    return {
        salesSummary,
        drugRanking,
        loading,
        error,
        fetchSalesSummary,
        fetchDrugRanking,
        downloadExcel,
    };
};
