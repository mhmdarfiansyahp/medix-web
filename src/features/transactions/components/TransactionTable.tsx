import { FileText, Coins } from 'lucide-react';
import { formatCurrency } from '../../../utils/utils';

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

export default function TransactionTable({ transactions, onViewReceipt }: TransactionTableProps) {
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
                <div className="max-h-[370px] overflow-y-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/80 backdrop-blur text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 sticky top-0 z-10">
                            <tr>
                                <th className="py-4 px-6">Transaction ID</th>
                                <th className="py-4 px-6">Time</th>
                                <th className="py-4 px-6 text-right">Amount</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center">Detail</th>
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
                                        <span className="text-slate-700 font-medium">
                                            {new Date(tx.tgl_transaksi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <span className="font-bold text-slate-900">
                                        {formatCurrency(tx.total_harga)}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {tx.status === 0 ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            Cancelled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Completed
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => onViewReceipt(tx.id_transaksi)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm"
                                            title="View Detail"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>Detail</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <div>Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</div>
                <div>Last updated: {new Date().toLocaleTimeString('id-ID')}</div>
            </div>
        </div>
    );
}
