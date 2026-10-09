import { FileText, Trash2, Coins, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency, cn } from '../../../utils/utils';

interface Transaction {
    id_transaksi: number;
    tgl_transaksi: string;
    total_harga: number;
    status: number;
    id_user?: number;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onViewReceipt: (id: number) => void;
    onCancelTransaction: (id: number) => void;
}

export default function TransactionTable({ transactions, onViewReceipt, onCancelTransaction }: TransactionTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
                        <Coins className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions today</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Start creating transactions by adding medicines to the cart. 
                        All daily sales and purchases will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 backdrop-blur text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-4 px-6">Transaction ID</th>
                            <th className="py-4 px-6">Date & Time</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                            <tr
                                key={tx.id_transaksi}
                                className="hover:bg-blue-50/50 transition-all duration-200 group"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-medium text-xs">
                                            #{tx.id_transaksi}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-slate-600 font-medium">
                                            {new Date(tx.tgl_transaksi).toLocaleDateString('id-ID')}
                                        </span>
                                        <span className="text-slate-400 text-xs">
                                            {new Date(tx.tgl_transaksi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="font-bold text-slate-900">
                                            {formatCurrency(tx.total_harga)}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {tx.status === 0 ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            Dibatalkan
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Selesai
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <button
                                            onClick={() => onViewReceipt(tx.id_transaksi)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                            title="View Receipt"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onCancelTransaction(tx.id_transaksi)}
                                            disabled={tx.status === 0}
                                            className={cn(
                                                "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow",
                                                tx.status === 0 && "opacity-50 cursor-not-allowed"
                                            )}
                                            title={tx.status === 0 ? "Transaksi sudah dibatalkan" : "Cancel Transaction"}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <div>Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</div>
                <div>Last updated: {new Date().toLocaleTimeString('id-ID')}</div>
            </div>
        </div>
    );
}
