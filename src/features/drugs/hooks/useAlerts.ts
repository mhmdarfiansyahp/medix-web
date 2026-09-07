import { useState, useEffect, useCallback } from 'react';
import type { LowStockDrug, ExpiringDrug, AlertSummary } from '../types/Drug.types';
import { medicineService } from '../../../services/medicineService';
import { getErrorMessage } from '../../../utils/api-helpers';

export interface UseAlertsReturn {
    lowStock: LowStockDrug[];
    expiring: ExpiringDrug[];
    summary: AlertSummary | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useAlerts = (): UseAlertsReturn => {
    const [lowStock, setLowStock] = useState<LowStockDrug[]>([]);
    const [expiring, setExpiring] = useState<ExpiringDrug[]>([]);
    const [summary, setSummary] = useState<AlertSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [lowStockData, expiringData, summaryData] = await Promise.all([
                medicineService.getLowStock(),
                medicineService.getExpiring(),
                medicineService.getAlertSummary(),
            ]);

            setLowStock(lowStockData ?? []);
            setExpiring(expiringData ?? []);
            setSummary(summaryData ?? null);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to fetch alerts'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll();
    }, [fetchAll]);

    return {
        lowStock,
        expiring,
        summary,
        loading,
        error,
        refetch: fetchAll,
    };
};
