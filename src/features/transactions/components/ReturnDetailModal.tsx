import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ShoppingBag, FileText, User, CreditCard, Package, Clock } from 'lucide-react';
import type { Return } from '../types/return.types';
import { formatCurrency } from '../../../utils/utils';

interface ReturnDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    returnData: Return | null;
    loading: boolean;
    onApprove: (id: number | string) => Promise<void>;
    onReject: (id: number | string, reason: string) => Promise<void>;
    threshold: number | null;
    canApprove: boolean;
}

export default function ReturnDetailModal({
    isOpen,
    onClose,
    returnData,
    loading,
    onApprove,
    onReject,
    threshold,
    canApprove,
}: ReturnDetailModalProps) {
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setRejectReason('');
        setShowRejectForm(false);
        onClose();
    };

    const handleApprove = async () => {
        if (!returnData?.id_return) return;
        setIsSubmitting(true);
        try {
            await onApprove(returnData.id_return);
            handleClose();
        } catch (error) {
            console.error('Error approving return:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!returnData?.id_return || !rejectReason.trim()) return;
        setIsSubmitting(true);
        try {
            await onReject(returnData.id_return, rejectReason);
            handleClose();
        } catch (error) {
            console.error('Error rejecting return:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-8 text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Memuat detail retur...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!returnData) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
                    <div className="p-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Retur Tidak Tersedia</h3>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Detail Retur #{returnData.id_return}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Diajukan pada {new Date(returnData.tanggal_retur).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {getStatusBadge(returnData.status)}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Informasi Pengaju
                            </h3>
                            <p className="text-sm text-slate-600">ID User: #{returnData.diajukan_oleh}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Transaksi Asal
                            </h3>
                            <p className="text-sm text-slate-600">ID Transaksi: #{returnData.id_transaksi}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Alasan
                            </h3>
                            <p className="text-sm text-slate-600">\"\"{returnData.alasan}\"\"</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Total Nilai
                            </h3>
                            <p className="text-lg font-bold text-slate-900">{formatCurrency(returnData.total_nilai)}</p>
                            {threshold && (
                                <div
                                    className={`text-xs mt-1 ${returnData.total_nilai > threshold ? 'text-red-600 font-medium' : 'text-slate-500'}`}
                                    style={{ color: returnData.total_nilai > threshold ? '#dc2626' : '#94a3b8' }}
                                >
                                    Batas approval: {formatCurrency(threshold)}
                                    {returnData.total_nilai > threshold && ' - Melebihi batas'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Item yang Diretur
                        </h3>
                        <div className="space-y-2">
                            {returnData.items?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">{item.nama_obat}</p>
                                        <p className="text-xs text-slate-500">ID: {item.id_obat}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">Jumlah: {item.jumlah}</p>
                                        <p className="text-xs text-slate-500">Stok Kembali: {item.stok_kembali}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Kondisi Layak: {item.kondisi_layak ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Alasan: {item.alasan_item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {returnData.status === 'pending' && canApprove && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-amber-800 mb-3">Aksi Disarankan</h3>
                            {showRejectForm ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-amber-700 mb-1">Alasan Penolakan</label>
                                        <textarea
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            rows={3}
                                            placeholder="Berikan alasan penolakan..."
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleReject}
                                            disabled={!rejectReason.trim() || isSubmitting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? 'Memproses...' : 'Tolak Retur'}
                                        </button>
                                        <button
                                            onClick={() => setShowRejectForm(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleApprove}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {isSubmitting ? 'Memproses...' : 'Setujui Retur'}
                                    </button>
                                    <button
                                        onClick={() => setShowRejectForm(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Tolak Retur
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {returnData.status !== 'pending' && (
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Catatan</h3>
                            <p className="text-xs text-slate-500">
                                Status retur ini sudah {returnData.status}. Perubahan lebih lanjut mungkin tidak diperbolehkan.
                            </p>
                        </div>
                    )}

                    {threshold && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-800 mb-2">Informasi Batas</h3>
                            <p className="text-xs text-blue-700">
                                Retur dengan nilai di atas {formatCurrency(threshold)} membutuhkan persetujuan admin.
                                Retur di bawah batas ini dapat diproses oleh kasir (lihat US-10 di mobile-kasir).
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
                    <button
                        onClick={handleClose}
                        className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
