// src/features/dashboard/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import {
    AlertTriangle,
    ArrowUpRight,
    Banknote,
    Clock,
    ShoppingBag,
    MoreVertical,
    AlertCircle,
    Calendar,
} from 'lucide-react';
import { cn, formatCurrency } from '../utils/utils';
import { useAlerts } from '../features/drugs/hooks/useAlerts';
import { useReports } from '../features/reports/hooks/useReports';

// Import komponen-komponen Dashboard
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { MedicationTable } from '../features/dashboard/components/MedicationTable';
import { SalesChart } from '../features/dashboard/components/SalesChart';



export default function DashboardPage() {
    const [currentUserRole] = useState<'ADMIN' | 'OWNER'>('ADMIN');
    const { lowStock, expiring, summary } = useAlerts();
    const { salesSummary, drugRanking, fetchSalesSummary, fetchDrugRanking } = useReports();

    useEffect(() => {
        fetchSalesSummary({ group_by: 'monthly' });
        fetchDrugRanking();
    }, [fetchSalesSummary, fetchDrugRanking]);

    const dashboardAlerts = [
        ...lowStock.slice(0, 2).map(item => ({
            id: String(item.id_obat),
            name: item.nama_obat,
            detail: `${item.stok} units remaining`,
            type: 'LOW_STOCK' as const,
            label: 'LOW STOCK',
        })),
        ...expiring.slice(0, 2).map(item => ({
            id: String(item.id_obat),
            name: item.nama_obat,
            detail: `Expiring in ${item.sisa_hari} days`,
            type: 'EXPIRING' as const,
            label: 'EXPIRING',
        })),
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* 1. Header & Quick Actions (Di-handle oleh komponen DashboardHeader) */}
            <DashboardHeader role={currentUserRole} />

            {/* 2. Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Total Revenue (Today)
                        </span>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(salesSummary?.total_penjualan ?? 0)}</div>
                        <div className="flex items-center text-xs font-medium text-emerald-600 gap-1 pt-1">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>+12% vs yesterday</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Banknote className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Active Orders
                        </span>
                        <div className="text-2xl font-bold text-slate-900">84 Orders</div>
                        <div className="flex items-center text-xs text-slate-500 gap-1 pt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>24 in queue processing</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                            Critical Low Stock
                        </span>
                        <div className="text-2xl font-bold text-rose-700">{summary?.total_low_stock ?? 0} Items</div>
                        <a
                            href="/stock-alerts/low-stock"
                            className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 pt-1"
                        >
                            View Low Stock &rarr;
                        </a>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Chart & Inventory Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SalesChart data={salesSummary?.chart_data ?? []} />

                {/* Inventory Alerts Sidebar */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Stock & Expire Alerts</h3>
                                <p className="text-xs text-slate-500">Automated minimum inventory warnings</p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {dashboardAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'p-3.5 rounded-xl border flex items-center justify-between gap-3',
                                        alert.type === 'LOW_STOCK' && 'bg-rose-50/40 border-rose-100',
                                        alert.type === 'EXPIRING' && 'bg-amber-50/40 border-amber-100'
                                    )}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={cn(
                                                'p-2 rounded-lg shrink-0',
                                                alert.type === 'LOW_STOCK' && 'bg-rose-100 text-rose-600',
                                                alert.type === 'EXPIRING' && 'bg-amber-100 text-amber-600'
                                            )}
                                        >
                                            {alert.type === 'EXPIRING' ? (
                                                <Calendar className="w-4 h-4" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-slate-800 truncate">{alert.name}</p>
                                            <p className="text-[11px] text-slate-500 truncate">{alert.detail}</p>
                                        </div>
                                    </div>

                                    <span
                                        className={cn(
                                            'text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0',
                                            alert.type === 'LOW_STOCK' && 'bg-rose-100 text-rose-700',
                                            alert.type === 'EXPIRING' && 'bg-amber-100 text-amber-700'
                                        )}
                                    >
                                        {alert.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <a
                            href="/stock-alerts/low-stock"
                            className="w-full mt-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-block text-center"
                        >
                            View All Alerts ({lowStock.length + expiring.length} Items)
                        </a>
                </div>
            </div>

            {/* 4. TanStack Medication Performance Table */}
            <MedicationTable 
                topData={drugRanking?.top_medicines ?? []} 
                bottomData={drugRanking?.bottom_medicines ?? []} 
                filterParams={{ group_by: 'monthly' }}
            />
        </div>
    );
}