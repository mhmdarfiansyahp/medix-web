import { ShoppingCart, FileText, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/utils';

interface Transaction {
    id_transaksi: number;
    tgl_transaksi: string;
    total_harga: number;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onViewReceipt: (id: number) => void;
    onCancelTransaction: (id: number) => void;
}

export default function TransactionTable({ transactions, onViewReceipt, onCancelTransaction }: TransactionTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>No transactions today.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-6">Transaction ID</th>
                            <th className="py-3.5 px-6">Date</th>
                            <th className="py-3.5 px-6 text-right">Total</th>
                            <th className="py-3.5 px-6 text-center">Status</th>
                            <th className="py-3.5 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
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
                                <td className="py-4 px-6 text-center space-x-1">
                                    <button
                                        onClick={() => onViewReceipt(tx.id_transaksi)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                        title="View Receipt"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onCancelTransaction(tx.id_transaksi)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                        title="Cancel Transaction"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
