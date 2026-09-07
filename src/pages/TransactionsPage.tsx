import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import type { TodayTransactionResponse } from '../features/transactions/types/transaction.types';
import { formatCurrency } from '../utils/utils';

export default function TransactionsPage() {
    const [data, setData] = useState<TodayTransactionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        (async () => {
            setError(null);
            try {
                const res = await transactionService.getToday();
                setData(res);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
            }
        })();
    }, []);

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Transactions
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        View today's transactions and sales summary.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Total Transactions
                                </span>
                                <div className="text-2xl font-bold text-slate-900">
                                    {data.summary.total_transaksi}
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Total Revenue
                                </span>
                                <div className="text-2xl font-bold text-slate-900">
                                    {formatCurrency(data.summary.total_penjualan)}
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Today's Date
                                </span>
                                <div className="text-xl font-bold text-slate-900">
                                    {new Date().toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        {data.transactions.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                No transactions today.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="py-3.5 px-6">Transaction ID</th>
                                            <th className="py-3.5 px-6">Date</th>
                                            <th className="py-3.5 px-6 text-right">Total</th>
                                            <th className="py-3.5 px-6 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.transactions.map((tx) => (
                                            <tr key={tx.id_transaksi} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-4 px-6 font-medium text-slate-900">#{tx.id_transaksi}</td>
                                                <td className="py-4 px-6 text-slate-500">
                                                    {new Date(tx.tgl_transaksi).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-slate-900">
                                                    {formatCurrency(tx.total_harga)}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
