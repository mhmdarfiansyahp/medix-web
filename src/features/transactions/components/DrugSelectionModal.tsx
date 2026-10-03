import { Save, X } from 'lucide-react';
import type { Drug } from '../types/transaction.types';
import { formatCurrency } from '../../../utils/utils';

interface DrugSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    drugs: Drug[];
    loadingDrugs: boolean;
    searchTerm: string;
    selectedDrug: Drug | null;
    quantity: number;
    onSearchTermChange: (term: string) => void;
    onSelectedDrugChange: (drug: Drug | null) => void;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: (drug: Drug, quantity: number) => void;
    creatingTransaction: boolean;
}

function DrugSelectionModal({
    isOpen,
    onClose,
    drugs,
    loadingDrugs,
    searchTerm,
    selectedDrug,
    quantity,
    onSearchTermChange,
    onSelectedDrugChange,
    onQuantityChange,
    onAddToCart,
    creatingTransaction,
}: DrugSelectionModalProps) {
    if (!isOpen) return null;

    const filteredDrugs = drugs.filter(drug =>
        drug.nama_obat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Create New Transaction</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Drug Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Select Medicine
                        </label>
                        <input
                            type="text"
                            placeholder="Search medicine..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {loadingDrugs ? (
                            <div className="text-center py-4 text-slate-400">
                                Loading medicines...
                            </div>
                        ) : (
                            <div className="mt-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                                {filteredDrugs.map((drug) => (
                                    <div
                                        key={drug.id_obat}
                                        onClick={() => onSelectedDrugChange(drug)}
                                        className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${selectedDrug?.id_obat === drug.id_obat ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                    >
                                        <div className="font-medium text-slate-900">{drug.nama_obat}</div>
                                        <div className="text-sm text-slate-500">
                                            Stok: {drug.stok}, Harga: {formatCurrency(drug.harga)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 px-3 py-2.5 text-center border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => onQuantityChange(quantity + 1)}
                                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Selected Drug Summary */}
                    {selectedDrug && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Selected Medicine</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">{selectedDrug.nama_obat}</div>
                                    <div className="text-sm text-slate-500">
                                        Harga satuan: {formatCurrency(selectedDrug.harga)}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Stok tersedia: {selectedDrug.stok}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">
                                        Total: {formatCurrency(selectedDrug.harga * quantity)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selectedDrug && onAddToCart(selectedDrug, quantity)}
                        disabled={creatingTransaction || !selectedDrug || quantity < 1}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {creatingTransaction ? (
                            <>Creating...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DrugSelectionModal;
