// src/features/dashboard/components/ExportReportModal.tsx
import { useState } from 'react';
import { Download, FileSpreadsheet, X } from 'lucide-react';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
    const [format, setFormat] = useState<'excel' | 'pdf'>('excel');
    const [range, setRange] = useState('this_month');

    if (!isOpen) return null;

    const handleExport = () => {
        console.log(`Exporting report as ${format.toUpperCase()} for ${range}`);
        // Panggil Service API Download di sini
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Export Report</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Date Range</label>
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Format</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormat('excel')}
                                className={`py-2 px-3 border rounded-xl text-xs font-bold ${format === 'excel'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 text-slate-600'
                                    }`}
                            >
                                Excel (.xlsx)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('pdf')}
                                className={`py-2 px-3 border rounded-xl text-xs font-bold ${format === 'pdf'
                                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                                        : 'border-slate-200 text-slate-600'
                                    }`}
                            >
                                PDF (.pdf)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}