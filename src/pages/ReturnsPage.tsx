import { useState } from 'react';
import {
  FileText, CheckCircle, XCircle, Clock, User, CreditCard,
  Calendar, Settings, Search, RefreshCw
} from 'lucide-react';
import { useReturns } from '../features/transactions/hooks/useReturns';
import ReturnDetailModal from '../features/transactions/components/ReturnDetailModal';
import { showSuccessToast, showErrorToast } from '../utils/sweetalert';
import type { Return } from '../features/transactions/types/return.types';
import { formatCurrency } from '../utils/utils';

export default function ReturnsPage() {
    const {
        items: returns,
        loading,
        error,
        threshold,
        setThreshold,
        refetch,
        approveReturn,
        rejectReturn,
    } = useReturns();

    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
    const [showThresholdModal, setShowThresholdModal] = useState(false);
    const [newThreshold, setNewThreshold] = useState<string>('');
    const [isUpdatingThreshold, setIsUpdatingThreshold] = useState(false);

    const filteredReturns = returns.filter((retur) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            retur.id_return.toString().includes(searchLower) ||
            retur.id_transaksi.toString().includes(searchLower) ||
            retur.alasan.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'disetujui':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Disetujui
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Menunggu Persetujuan
                    </span>
                );
            default:
                return null;
        }
    };

    const handleViewDetail = (retur: Return) => {
        setSelectedReturn(retur);
        setShowDetailModal(true);
    };

    const handleApprove = async (id: number | string) => {
        try {
            await approveReturn(id);
            showSuccessToast('Retur berhasil disetujui');
            await refetch();
        } catch {
            showErrorToast('Gagal menyetujui retur');
        }
    };

    const handleReject = async (id: number | string, reason: string) => {
        try {
            await rejectReturn(id, reason);
            showSuccessToast('Retur berhasil ditolak');
            await refetch();
        } catch {
            showErrorToast('Gagal menolak retur');
        }
    };

    const handleUpdateThreshold = async () => {
        const thresholdValue = parseFloat(newThreshold);
        if (!thresholdValue || thresholdValue < 0) {
            showErrorToast('Masukkan nilai batas yang valid');
            return;
        }

        setIsUpdatingThreshold(true);
        try {
            await setThreshold(thresholdValue);
            showSuccessToast(`Batas retur berhasil diubah menjadi ${formatCurrency(thresholdValue)}`);
            // Reset input state when modal closes
            setNewThreshold('');
            setShowThresholdModal(false);
        } catch {
            showErrorToast('Gagal mengubah batas retur');
        } finally {
            setIsUpdatingThreshold(false);
        }
    };

    const openThresholdModal = () => {
        setNewThreshold(threshold?.toString() || '');
        setShowThresholdModal(true);
    };

    const canApproveReturn = (retur: Return): boolean => {
        if (retur.status !== 'pending') return false;
        if (!threshold) return true;
        return retur.total_nilai > threshold;
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        Pengelolaan Retur
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola pengajuan retur obat dan berikan persetujuan.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={openThresholdModal}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        title="Atur Batas Retur"
                    >
                        <Settings className="w-4 h-4" />
                        Atur Batas: {threshold ? formatCurrency(threshold) : 'Tidak diatur'}
                    </button>

                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari retur (ID, transaksi, alasan)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600">Memuat data retur...</p>
                        </div>
                    ) : filteredReturns.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada retur ditemukan</h3>
                            <p className="text-sm text-slate-500">
                                {searchTerm
                                    ? 'Tidak ada retur yang cocok dengan pencarian Anda.'
                                    : 'Belum ada retur yang diajukan.'
                                }
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/80 backdrop-blur text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="py-4 px-6">ID Retur</th>
                                    <th className="py-4 px-6">ID Transaksi</th>
                                    <th className="py-4 px-6">Tanggal</th>
                                    <th className="py-4 px-6">Pengaju</th>
                                    <th className="py-4 px-6">Total Nilai</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReturns.map((retur) => (
                                    <tr
                                        key={retur.id_return}
                                        className="hover:bg-blue-50/50 transition-all duration-200 group"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-medium text-xs">
                                                    #{retur.id_return}
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {retur.items?.length || 0} item
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-medium text-slate-900">#{retur.id_transaksi}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-slate-600">
                                                    {new Date(retur.tanggal_retur).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-slate-600">#{retur.diajukan_oleh}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-right">
                                                <div className="font-semibold text-slate-900">
                                                    {formatCurrency(retur.total_nilai)}
                                                </div>
                                                {threshold && retur.total_nilai > threshold && (
                                                    <div className="text-xs text-red-600 font-medium">
                                                        Melebihi batas!
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(retur.status)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(retur)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                                    title="Lihat Detail"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>

                                                {retur.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(retur.id_return)}
                                                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Apakah Anda yakin ingin menolak retur ini? Anda harus memberikan alasan.')) {
                                                                    const reason = window.prompt('Masukkan alasan penolakan:');
                                                                    if (reason) {
                                                                        handleReject(retur.id_return, reason);
                                                                    }
                                                                }
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                                            title="Tolak"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <div>Menampilkan {filteredReturns.length} retur</div>
                    <div>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</div>
                </div>
            </div>

            <ReturnDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                returnData={selectedReturn}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
                threshold={threshold}
                canApprove={selectedReturn ? canApproveReturn(selectedReturn) : false}
            />

            {showThresholdModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-600" />
                                Atur Batas Retur
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Tentukan batas nilai retur yang membutuhkan persetujuan admin.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Nilai Batas (IDR)
                                </label>
                                <input
                                    type="number"
                                    value={newThreshold}
                                    onChange={(e) => setNewThreshold(e.target.value)}
                                    placeholder="50000"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    step="1000"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Retur di bawah batas ini dapat diproses oleh kasir (US-10 di mobile-kasir).
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={() => setShowThresholdModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateThreshold}
                                disabled={isUpdatingThreshold}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUpdatingThreshold ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}