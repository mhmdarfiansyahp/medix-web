import { useState } from 'react';
import { FileText } from 'lucide-react';
import { SalesChart } from '../features/dashboard/components/SalesChart';
import { MedicationTable } from '../features/dashboard/components/MedicationTable';
import { ExportReportModal } from '../features/dashboard/components/ExportReportModal';

export default function ReportsPage() {
    const [isExportOpen, setIsExportOpen] = useState(false);

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

            <SalesChart />

            <MedicationTable />

            <ExportReportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
            />
        </div>
    );
}
