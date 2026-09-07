import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Package } from 'lucide-react';
import { cn } from '../utils/utils';
import { useAlerts } from '../features/drugs/hooks/useAlerts';

type Tab = 'low-stock' | 'expiring-soon';

const TABS: { id: Tab; label: string; icon: typeof AlertTriangle }[] = [
    { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
    { id: 'expiring-soon', label: 'Expiring Soon', icon: Clock },
];

export default function StockAlertsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { lowStock, expiring, loading, error } = useAlerts();

    const activeTab: Tab = location.pathname.includes('expiring-soon') ? 'expiring-soon' : 'low-stock';
    const isLow = activeTab === 'low-stock';

    const setTab = (tab: Tab) => {
        navigate(`/stock-alerts/${tab}`);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-sm text-slate-400">
                Memuat data alert...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Notifications & Stock
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {isLow
                            ? 'Obat dengan stok di bawah batas minimum.'
                            : 'Obat yang mendekati tanggal kadaluarsa (30 hari).'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {lowStock.length} Low Stock
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {expiring.length} Expiring
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1">
                <div className="flex gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const count = tab.id === 'low-stock' ? lowStock.length : expiring.length;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                <span className={cn(
                                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Data */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {isLow ? (
                    lowStock.length === 0 ? (
                        <EmptyState label="stok menipis" />
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {lowStock.map((item) => (
                                <div key={item.id_obat} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{item.nama_obat}</p>
                                            <p className="text-xs text-slate-500 truncate">{item.merk_obat || '-'} &middot; {item.nama_jenis}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-bold text-rose-600">{item.stok} / {item.stok_minimum}</div>
                                        <p className="text-[11px] text-slate-400">stok / minimum</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    expiring.length === 0 ? (
                        <EmptyState label="kadaluarsa" />
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {expiring.map((item) => (
                                <div key={item.id_obat} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors bg-amber-50/30">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 text-amber-600">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{item.nama_obat}</p>
                                            <p className="text-xs text-slate-500 truncate">{item.merk_obat || '-'} &middot; {item.nama_jenis}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-bold text-amber-600">{item.tgl_kadaluarsa}</div>
                                        <p className="text-[11px] text-slate-400">{item.sisa_hari} hari lagi</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="text-center py-12 text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            Tidak ada data {label}.
        </div>
    );
}
