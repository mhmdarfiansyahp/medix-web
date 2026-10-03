// src/features/dashboard/components/ExportReportModal.tsx
import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';
import { reportService } from '../../../services/reportService';
import { showSuccessToast, showErrorToast } from '../../../utils/sweetalert';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [range, setRange] = useState('this_month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsLoading(true);

        const today = new Date();
        let start_date: string | undefined;
        let end_date: string | undefined;

        if (range === 'today') {
            start_date = today.toISOString().split('T')[0];
            end_date = start_date;
        } else if (range === 'this_week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            start_date = weekAgo.toISOString().split('T')[0];
            end_date = today.toISOString().split('T')[0];
        } else if (range === 'this_month') {
            start_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
            end_date = today.toISOString().split('T')[0];
        } else if (range === 'custom' && customStart && customEnd) {
            start_date = customStart;
            end_date = customEnd;
        }

        try {
            const blob = await reportService.exportExcel({ start_date, end_date });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showSuccessToast(`Laporan berhasil diunduh (Excel).`);
            onClose();
        } catch (err: unknown) {
            showErrorToast(err instanceof Error ? err.message : 'Gagal mengunduh laporan.');
        } finally {
            setIsLoading(false);
        }
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

                    {range === 'custom' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Start Date</label>
                                <input
                                    type="date"
                                    value={customStart}
                                    onChange={(e) => setCustomStart(e.target.value)}
                                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">End Date</label>
                                <input
                                    type="date"
                                    value={customEnd}
                                    onChange={(e) => setCustomEnd(e.target.value)}
                                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Excel (.xlsx) - Available Format Only</span>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">
                            PDF export is not currently supported. Excel format includes all report data.
                        </p>
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
                        disabled={isLoading}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isLoading ? 'Downloading...' : 'Download Excel'}
                    </button>
                </div>
            </div>
        </div>
    );
}