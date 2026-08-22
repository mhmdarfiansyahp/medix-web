// src/features/dashboard/pages/DashboardPage.tsx
import { useState } from 'react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowUpRight,
    Banknote,
    Calendar,
    CheckCircle2,
    Clock,
    MoreVertical,
    ShoppingBag,
} from 'lucide-react';
import { cn, formatCurrency } from '../utils/utils';

// Import komponen-komponen Dashboard
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { MedicationTable } from '../features/dashboard/components/MedicationTable';
import { SalesChart } from '../features/dashboard/components/SalesChart';
import type {
    InventoryAlert,
    MedicationPerformance,
    SalesTrend,
} from '../features/dashboard/types';

// DUMMY DATA IN ENGLISH
const DUMMY_SALES_TRENDS: SalesTrend[] = [
    { period: 'Day 01', revenue: 3200000, volume: 120 },
    { period: 'Day 05', revenue: 4500000, volume: 180 },
    { period: 'Day 10', revenue: 3800000, volume: 140 },
    { period: 'Day 15', revenue: 5100000, volume: 210 },
    { period: 'Day 20', revenue: 4200000, volume: 160 },
    { period: 'Day 25', revenue: 6000000, volume: 250 },
    { period: 'Day 30', revenue: 5800000, volume: 230 },
];

const DUMMY_TOP_MEDICATIONS: MedicationPerformance[] = [
    { id: '1', name: 'Paracetamol 500mg', sku: 'PRC-500-A1', category: 'Analgesic', unitsSold: 1240, revenue: 15500000, status: 'IN STOCK' },
    { id: '2', name: 'Amoxicillin 250mg', sku: 'AMX-250-B4', category: 'Antibiotic', unitsSold: 856, revenue: 21400000, status: 'LOW STOCK' },
    { id: '3', name: 'Ibuprofen 400mg', sku: 'IBU-400-C2', category: 'NSAID', unitsSold: 742, revenue: 11130000, status: 'IN STOCK' },
    { id: '4', name: 'Omeprazole 20mg', sku: 'OMP-20-D9', category: 'PPI', unitsSold: 610, revenue: 18300000, status: 'IN STOCK' },
    { id: '5', name: 'Azithromycin 250mg', sku: 'AZI-250-E1', category: 'Antibiotic', unitsSold: 430, revenue: 17200000, status: 'OUT OF STOCK' },
];

const DUMMY_BOTTOM_MEDICATIONS: MedicationPerformance[] = [
    { id: '10', name: 'Multivitamin Syrup 60ml', sku: 'VIT-060-S1', category: 'Vitamin', unitsSold: 2, revenue: 90000, status: 'IN STOCK' },
    { id: '11', name: 'Antacid Liquid 100ml', sku: 'ANT-100-L2', category: 'Antacid', unitsSold: 5, revenue: 175000, status: 'IN STOCK' },
    { id: '12', name: 'Cetirizine 10mg', sku: 'CTZ-010-T3', category: 'Antihistamine', unitsSold: 8, revenue: 240000, status: 'LOW STOCK' },
    { id: '13', name: 'Cough Syrup 100ml', sku: 'CGH-100-S4', category: 'Cough', unitsSold: 12, revenue: 480000, status: 'IN STOCK' },
    { id: '14', name: 'Vitamin C 500mg', sku: 'VTC-500-T5', category: 'Vitamin', unitsSold: 15, revenue: 300000, status: 'IN STOCK' },
];

const DUMMY_INVENTORY_ALERTS: InventoryAlert[] = [
    { id: '1', name: 'Amoxicillin 250mg', detail: '12 units remaining', type: 'LOW_STOCK', label: 'LOW STOCK' },
    { id: '2', name: 'Lisinopril 10mg', detail: 'Batch A49B - Expiring in 15 days', type: 'EXPIRING', label: 'EXPIRING' },
    { id: '3', name: 'Atorvastatin 20mg', detail: 'Completely out of stock', type: 'EMPTY', label: 'EMPTY' },
    { id: '4', name: 'Metformin 500mg', detail: '500 units successfully restocked', type: 'RESTOCKED', label: 'RESTOCKED' },
];

export default function DashboardPage() {
    const [currentUserRole] = useState<'ADMIN' | 'OWNER'>('ADMIN');

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
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(4250000)}</div>
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
                        <div className="text-2xl font-bold text-rose-700">12 Items</div>
                        <button
                            type="button"
                            className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 pt-1"
                        >
                            View Low Stock &rarr;
                        </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Chart & Inventory Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SalesChart data={DUMMY_SALES_TRENDS} />

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
                            {DUMMY_INVENTORY_ALERTS.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'p-3.5 rounded-xl border flex items-center justify-between gap-3',
                                        (alert.type === 'LOW_STOCK' || alert.type === 'EMPTY') && 'bg-rose-50/40 border-rose-100',
                                        alert.type === 'EXPIRING' && 'bg-amber-50/40 border-amber-100',
                                        alert.type === 'RESTOCKED' && 'bg-emerald-50/40 border-emerald-100'
                                    )}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={cn(
                                                'p-2 rounded-lg shrink-0',
                                                (alert.type === 'LOW_STOCK' || alert.type === 'EMPTY') && 'bg-rose-100 text-rose-600',
                                                alert.type === 'EXPIRING' && 'bg-amber-100 text-amber-600',
                                                alert.type === 'RESTOCKED' && 'bg-emerald-100 text-emerald-600'
                                            )}
                                        >
                                            {alert.type === 'EXPIRING' ? (
                                                <Calendar className="w-4 h-4" />
                                            ) : alert.type === 'RESTOCKED' ? (
                                                <CheckCircle2 className="w-4 h-4" />
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
                                            (alert.type === 'LOW_STOCK' || alert.type === 'EMPTY') && 'bg-rose-100 text-rose-700',
                                            alert.type === 'EXPIRING' && 'bg-amber-100 text-amber-700',
                                            alert.type === 'RESTOCKED' && 'bg-emerald-100 text-emerald-700'
                                        )}
                                    >
                                        {alert.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full mt-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        View All Alerts (12 Items)
                    </button>
                </div>
            </div>

            {/* 4. TanStack Medication Performance Table */}
            <MedicationTable topData={DUMMY_TOP_MEDICATIONS} bottomData={DUMMY_BOTTOM_MEDICATIONS} />
        </div>
    );
}