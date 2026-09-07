import { useState, useEffect, useCallback } from 'react';
import type { LowStockDrug, ExpiringDrug, AlertSummary } from '../types/Drug.types';
import { medicineService } from '../../../services/medicineService';

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

        const [lowRes, expiringRes, summaryRes] = await Promise.allSettled([
            medicineService.getLowStock(),
            medicineService.getExpiring(),
            medicineService.getAlertSummary(),
        ]);

        setLowStock(lowRes.status === 'fulfilled' ? (lowRes.value ?? []) : []);
        setExpiring(expiringRes.status === 'fulfilled' ? (expiringRes.value ?? []) : []);
        setSummary(summaryRes.status === 'fulfilled' ? (summaryRes.value ?? null) : null);

        const failures = [lowRes, expiringRes, summaryRes].filter((r) => r.status === 'rejected');
        if (failures.length === 3) {
            setError('Failed to fetch alerts');
        } else if (failures.length > 0) {
            console.warn('Some alert endpoints failed:', failures);
        }

        setLoading(false);
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
