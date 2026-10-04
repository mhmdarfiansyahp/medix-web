import { ShoppingCart, Plus, Trash2, X, Minus } from 'lucide-react';
import type { CartItem } from '../types/transaction.types';
import { formatCurrency } from '../../../utils/utils';
import TransactionSubmitButton from './TransactionSubmitButton';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onCreateTransaction: () => Promise<void>;
    isCreating: boolean;
}

export default function CartModal({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCreateTransaction, isCreating }: CartModalProps) {
    if (!isOpen) return null;

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.subtotal, 0);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-end p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Keranjang Belanja</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {cartItems.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>Keranjang kosong</p>
                            <button
                                onClick={onClose}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Obat
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Tambah Obat
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900 text-sm">{item.drug.nama_obat}</h3>
                                    <p className="text-xs text-slate-500">Harga: {formatCurrency(item.drug.harga)}</p>
                                </div>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-12 px-2 py-1 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-right font-medium">
                                    {formatCurrency(item.subtotal)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-200 sticky bottom-0 bg-white space-y-3">
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                    </div>

                    <TransactionSubmitButton
                        onSubmit={onCreateTransaction}
                        disabled={isCreating || cartItems.length === 0}
                        isLoading={isCreating}
                        totalAmount={calculateTotal()}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Lanjutkan Belanja
                    </button>
                </div>
            </div>
        </div>
    );
}
