import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { TypeDrug, CreateTypeDrugRequest } from '../types/Category.types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTypeDrugRequest) => void;
    initialData?: TypeDrug | null;
}

export function CategoryModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: CategoryModalProps) {
    const [namaJenis, setNamaJenis] = useState('');

    useEffect(() => {
        if (initialData) {
            setNamaJenis(initialData.nama_jenis);
        } else {
            setNamaJenis('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!namaJenis.trim()) return;
        onSubmit({
            nama_jenis: namaJenis.trim(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Category Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={50}
                            value={namaJenis}
                            onChange={(e) => setNamaJenis(e.target.value)}
                            placeholder="e.g. Ointment, Tablet, Syrup"
                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                        >
                            {initialData ? 'Save Changes' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}