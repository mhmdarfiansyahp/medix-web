import { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { SalesChart } from '../features/dashboard/components/SalesChart';
import { MedicationTable } from '../features/dashboard/components/MedicationTable';
import { ExportReportModal } from '../features/dashboard/components/ExportReportModal';
import type { ReportFilterParams } from '../features/reports/types/report.types';

export default function ReportsPage() {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [filterParams, setFilterParams] = useState<ReportFilterParams>({ group_by: 'monthly' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilterChange = (key: keyof ReportFilterParams, value: string | undefined) => {
        setFilterParams(prev => ({ ...prev, [key]: value }));
        if (key === 'start_date' && value) setStartDate(value);
        if (key === 'end_date' && value) setEndDate(value);
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Reports & Export
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Sales summaries, drug rankings, and exportable transaction reports.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsExportOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm shrink-0 self-start sm:self-auto"
                >
                    <FileText className="w-4 h-4 text-slate-500" />
                    Export Report
                </button>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <h3 className="text-lg font-bold text-slate-900">Report Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Period</label>
                        <select
                            value={filterParams.group_by || ''}
                            onChange={(e) => handleFilterChange('group_by', e.target.value as ReportFilterParams['group_by'])}
                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setFilterParams({ group_by: 'monthly' });
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <SalesChart />
            <MedicationTable filterParams={filterParams} />

            <ExportReportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
            />
        </div>
    );
}
