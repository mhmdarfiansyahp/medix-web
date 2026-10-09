import { FileText, TrendingUp, Calendar } from 'lucide-react';
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
            <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Total Transactions
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {totalTransactions}
                    </div>
                    <p className="text-xs text-slate-500">Complete transaction records today</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-7 h-7" />
                </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Total Revenue
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {formatCurrency(totalRevenue)}
                    </div>
                    <p className="text-xs text-slate-500">Revenue generated today</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-7 h-7" />
                </div>
            </div>

            <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Today's Date
                        </span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {todayDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                    <p className="text-xs text-slate-500">Business day in progress</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <Calendar className="w-7 h-7" />
                </div>
            </div>
        </div>
    );
}
