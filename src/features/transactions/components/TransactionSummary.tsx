import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../../utils/utils';

interface TransactionSummaryProps {
    totalTransactions: number;
    totalRevenue: number;
    todayDate: Date;
}

export default function TransactionSummary({
    totalTransactions,
    totalRevenue,
    todayDate,
}: TransactionSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Transactions
                    </span>
                    <div className="text-2xl font-bold text-slate-900">
                        {totalTransactions}
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
                        {formatCurrency(totalRevenue)}
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
                        {todayDate.toLocaleDateString('id-ID', {
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
    );
}
