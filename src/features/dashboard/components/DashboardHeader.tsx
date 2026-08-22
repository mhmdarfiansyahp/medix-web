import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { AddMedicationModal } from './AddMedicationModal';
import { ExportReportModal } from './ExportReportModal';

export function DashboardHeader({ role }: { role: 'ADMIN' | 'OWNER' }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Welcome back, {role === 'ADMIN' ? 'Administrator' : 'Pharmacy Owner'}.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsExportOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <FileText className="w-4 h-4 text-slate-500" />
                        Export Report
                    </button>

                    {role === 'ADMIN' && (
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Medication
                        </button>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddMedicationModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
            <ExportReportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </>
    );
}