import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '../../../utils/utils';
import { reportService } from '../../../services/reportService';
import type { ReportFilterParams, DrugSalesStat } from '../../../features/reports/types/report.types';

interface MedicationTableProps {
    topData?: DrugSalesStat[];
    bottomData?: DrugSalesStat[];
    filterParams?: ReportFilterParams;
}

export function MedicationTable({ topData: externalTop, bottomData: externalBottom, filterParams }: MedicationTableProps) {
    const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');

    const [topData, setTopData] = useState<DrugSalesStat[]>(externalTop ?? []);
    const [bottomData, setBottomData] = useState<DrugSalesStat[]>(externalBottom ?? []);

    useEffect(() => {
        if (externalTop || externalBottom) return;

        reportService.getDrugRanking(filterParams)
            .then((res) => {
                setTopData(res.top_medicines ?? []);
                setBottomData(res.bottom_medicines ?? []);
            })
            .catch(() => {
                setTopData([]);
                setBottomData([]);
            });
    }, [externalTop, externalBottom, filterParams]);

    const data = activeTab === 'top' ? topData : bottomData;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Medication Performance</h3>
                    <p className="text-xs text-slate-500">
                        Overview of top and bottom selling medications by volume
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('top')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                                activeTab === 'top'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Top Selling
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('bottom')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                                activeTab === 'bottom'
                                    ? 'bg-white text-rose-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            <TrendingDown className="w-3.5 h-3.5" />
                            Bottom Selling
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-6">Medication Name</th>
                            <th className="py-3.5 px-6 text-right">Units Sold</th>
                            <th className="py-3.5 px-6 text-right">Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-slate-400">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id_obat} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6 font-semibold text-blue-600">{item.nama_obat}</td>
                                    <td className="py-4 px-6 text-right font-semibold text-slate-800">
                                        {item.total_terjual.toLocaleString('en-US')}
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                                        {formatCurrency(item.total_omset)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>
                    Showing {data.length} entries ({activeTab === 'top' ? 'Top Performance' : 'Low Demand'})
                </span>
            </div>
        </div>
    );
}
