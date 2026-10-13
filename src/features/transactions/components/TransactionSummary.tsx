import { FileText, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/utils';

interface TransactionSummaryProps {
    totalTransactions: number;
    totalRevenue: number;
}

export default function TransactionSummary({
    totalTransactions,
    totalRevenue,
}: TransactionSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-medium text-slate-500">
                            Total Transactions
                        </span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {totalTransactions}
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                </div>
            </div>

            <div className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium text-slate-500">
                            Total Revenue
                        </span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {formatCurrency(totalRevenue)}
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
