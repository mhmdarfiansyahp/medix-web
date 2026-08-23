import { useEffect, useState } from 'react';
import { AlertCircle, Barcode, Calendar, Package, X } from 'lucide-react';
import { cn } from '../../../utils/utils';
import type { Drug } from '../../drugs/types/Drug.types';
import { medicineService } from '../../../services/medicineService';
import { showSuccessToast, showErrorToast } from '../../../utils/sweetalert';

interface AddMedicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories?: { id_jenis: number; nama_jenis: string }[];
    initialData?: Drug | null;
    onSuccess?: () => void;
}

export function AddMedicationModal({
    isOpen,
    onClose,
    categories = [],
    initialData,
    onSuccess,
}: AddMedicationModalProps) {
    const isEditMode = Boolean(initialData);

    const [formData, setFormData] = useState({
        nama_obat: '',
        merk_obat: '',
        jenis_obat_id: '',
        barcode: '',
        tgl_kadaluarsa: '',
        harga: '',
        stok: '0',
        stok_minimum: '10',
        keterangan: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return '';
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }
        return dateString;
    };

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nama_obat: initialData.nama_obat || '',
                    merk_obat: initialData.merk_obat || '',
                    jenis_obat_id: initialData.jenis_obat_id ? String(initialData.jenis_obat_id) : '',
                    barcode: initialData.barcode || '',
                    tgl_kadaluarsa: formatDateForInput(initialData.tgl_kadaluarsa),
                    harga: initialData.harga ? String(initialData.harga) : '',
                    stok: initialData.stok !== undefined ? String(initialData.stok) : '0',
                    stok_minimum: initialData.stok_minimum !== undefined ? String(initialData.stok_minimum) : '10',
                    keterangan: initialData.keterangan || '',
                });
            } else {
                setFormData({
                    nama_obat: '',
                    merk_obat: '',
                    jenis_obat_id: '',
                    barcode: '',
                    tgl_kadaluarsa: '',
                    harga: '',
                    stok: '0',
                    stok_minimum: '10',
                    keterangan: '',
                });
            }
            setErrorMessage(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        if (!formData.nama_obat || !formData.tgl_kadaluarsa || !formData.harga) {
            setErrorMessage('Mohon isi field wajib (Nama Obat, Expiration Date, dan Harga).');
            setIsLoading(false);
            return;
        }

        try {
            const targetId = initialData?.id_obat ?? (initialData as any)?.id;

            const payload = {
                nama_obat: formData.nama_obat,
                merk_obat: formData.merk_obat.trim() !== '' ? formData.merk_obat : null,
                jenis_obat_id: formData.jenis_obat_id ? Number(formData.jenis_obat_id) : null,
                barcode: formData.barcode.trim() !== '' ? formData.barcode : null,
                tgl_kadaluarsa: formData.tgl_kadaluarsa,
                harga: parseFloat(formData.harga) || 0,
                stok: parseInt(formData.stok, 10) || 0,
                stok_minimum: parseInt(formData.stok_minimum, 10) || 0,
                keterangan: formData.keterangan.trim() !== '' ? formData.keterangan : null,
                status: isEditMode && initialData?.status !== undefined ? initialData.status : 1,
            };

            if (isEditMode && targetId) {
                await medicineService.update(targetId, payload);
                showSuccessToast(`Obat berhasil diperbarui.`);
            } else {
                await medicineService.create(payload);
                showSuccessToast(`Obat berhasil ditambahkan.`);
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan data obat.';
            setErrorMessage(msg);
            showErrorToast(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {isEditMode ? 'Edit Medication' : 'Add New Medication'}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {isEditMode
                                    ? 'Update existing medication details in database'
                                    : 'Insert new drug inventory data to database'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMessage && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-700">
                                Medication Name (<span className="text-rose-500">*</span>)
                            </label>
                            <input
                                type="text"
                                name="nama_obat"
                                value={formData.nama_obat}
                                onChange={handleChange}
                                placeholder="e.g. Paracetamol 500mg"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Brand / Merk</label>
                            <input
                                type="text"
                                name="merk_obat"
                                value={formData.merk_obat}
                                onChange={handleChange}
                                placeholder="e.g. Sanbe / Kalbe"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Category / Jenis</label>
                            <select
                                name="jenis_obat_id"
                                value={formData.jenis_obat_id}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id_jenis} value={cat.id_jenis}>
                                        {cat.nama_jenis}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Barcode</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="barcode"
                                    value={formData.barcode}
                                    onChange={handleChange}
                                    placeholder="Scan or type barcode"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">
                                Expiration Date (<span className="text-rose-500">*</span>)
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="tgl_kadaluarsa"
                                    value={formData.tgl_kadaluarsa}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">
                                Price (IDR) (<span className="text-rose-500">*</span>)
                            </label>
                            <input
                                type="number"
                                name="harga"
                                min="0"
                                step="100"
                                value={formData.harga}
                                onChange={handleChange}
                                placeholder="15000"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Current Stock</label>
                                <input
                                    type="number"
                                    name="stok"
                                    min="0"
                                    value={formData.stok}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Min. Stock</label>
                                <input
                                    type="number"
                                    name="stok_minimum"
                                    min="1"
                                    value={formData.stok_minimum}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-700">Description / Note</label>
                            <textarea
                                name="keterangan"
                                rows={2}
                                value={formData.keterangan}
                                onChange={handleChange}
                                placeholder="Optional notes or instructions..."
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20',
                                isLoading && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {isLoading
                                ? 'Saving...'
                                : isEditMode
                                    ? 'Update Medication'
                                    : 'Save Medication'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}