import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ShoppingCart, Plus, Search, X, Trash2, Minus } from "lucide-react";
import { transactionService } from "../services/transactionService";
import { medicineService } from "../services/medicineService";
import type {
  TodayTransactionResponse,
  Drug,
  CartItem,
  ReceiptData,
} from "../features/transactions/types/transaction.types";
import { formatCurrency } from "../utils/utils";
import CartModal from "../features/transactions/components/CartModal";
import ReceiptModal from "../features/transactions/components/ReceiptModal";
import TransactionSummary from "../features/transactions/components/TransactionSummary";
import TransactionTable from "../features/transactions/components/TransactionTable";
import { showToast, showErrorToast } from "../utils/sweetalert";
import { useReactToPrint } from "react-to-print";

export default function TransactionsPage() {
  const [data, setData] = useState<TodayTransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  const [, setLoadingToday] = useState(false);

  const [showCartModal, setShowCartModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Ref untuk elemen yang akan dicetak
  const receiptRef = useRef<HTMLDivElement>(null);

  // Setup hook react-to-print
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${receiptData?.id_transaksi || "transaction"}`,
  });

  const drugsFiltered = useMemo(() => {
    if (!searchTerm) return drugs;
    return drugs.filter((drug) =>
      drug.nama_obat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [drugs, searchTerm]);

  const fetchDrugs = useCallback(async () => {
    setLoadingDrugs(true);
    try {
      const drugsData = await medicineService.getAll({ search: searchTerm, status: '1' });
      const validDrugs = drugsData.filter((drug) => {
        const expiryDate = drug.tgl_kadaluarsa ? new Date(drug.tgl_kadaluarsa) : null;
        return !expiryDate || expiryDate >= new Date();
      });
      setDrugs(validDrugs);
    } catch {
      showErrorToast("Failed to load medicines");
    } finally {
      setLoadingDrugs(false);
    }
  }, [searchTerm]);

  const fetchToday = useCallback(async () => {
    setLoadingToday(true);
    setError(null);
    try {
      const res = await transactionService.getToday();
      setData(res);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoadingToday(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
    fetchDrugs();
  }, [fetchToday, fetchDrugs]);

  const handleAddToCart = (drug: Drug) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.drug.id_obat === drug.id_obat);
      if (existing) {
        return prev.map((item) =>
          item.drug.id_obat === drug.id_obat
            ? { ...item, quantity: item.quantity + 1, subtotal: item.drug.harga * (item.quantity + 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          drug,
          quantity: 1,
          subtotal: drug.harga * 1,
        },
      ];
    });
  };

  const handleViewReceipt = async (id_transaksi: number) => {
    setShowReceiptModal(true);
    setLoadingReceipt(true);
    try {
      if (drugs.length === 0) await fetchDrugs();
      const detail = await transactionService.getById(id_transaksi);
      const names = new Map(drugs.map((d) => [d.id_obat, d.nama_obat]));
      setReceiptData({
        ...detail,
        details: (detail.details ?? []).map((d) => ({
          ...d,
          nama_obat: d.nama_obat || names.get(d.id_obat) || `Medicine #${d.id_obat}`,
        })),
      });
    } catch {
      showErrorToast("Failed to load transaction details");
    } finally {
      setLoadingReceipt(false);
    }
  };

  const handleCancelTransaction = async (id: number) => {
    try {
      await transactionService.cancel(id);
      showToast('Transaction cancelled');
      await fetchToday();
    } catch (err: unknown) {
      let errorMessage = 'Failed to cancel transaction';
      if (err instanceof Error && err.message.includes('already cancelled')) {
        errorMessage = 'Transaction already cancelled';
      }
      showErrorToast(errorMessage);
    }
  };

  const handleCreateTransaction = async () => {
    if (cartItems.length === 0) {
      showErrorToast("Cart is empty");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        details: cartItems.map((item) => ({
          id_obat: item.drug.id_obat,
          jumlah: item.quantity,
        })),
      };

      const res = await transactionService.create(payload);

      showToast("Transaction completed successfully");
      setCartItems([]);
      setShowCartModal(false);
      await Promise.all([fetchToday(), fetchDrugs()]);

      if (res?.id_transaksi) {
        handleViewReceipt(res.id_transaksi);
      }
    } catch (err: unknown) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to create transaction"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View today's transactions and sales summary.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
          {error}
        </div>
      )}

      {data && (
        <TransactionSummary
          totalTransactions={data.summary.total_transaksi}
          totalRevenue={data.summary.total_penjualan}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">Medicine Inventory</h2>
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search medicines..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-700 transition-all"
                  />
                </div>
              </div>
            </div>

            {loadingDrugs ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-slate-500">Loading medicines...</span>
                </div>
              </div>
            ) : drugsFiltered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <X className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No medicines found</p>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-87.5 overflow-y-auto">
                {drugsFiltered.map((drug) => {
                  return (
                    <div key={drug.id_obat} className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">
                          {drug.nama_obat}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Stock: {drug.stok} | {formatCurrency(drug.harga)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(drug)}
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden h-full flex flex-col sticky top-6">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Shopping Cart</h2>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-3 mx-auto shadow-sm">
                  <ShoppingCart className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Your cart is empty</p>
                <p className="text-xs text-slate-500">Add medicines from the inventory to get started.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 divide-y divide-slate-100 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.drug.nama_obat}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item.drug.harga)} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              setCartItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? { ...i, quantity: Math.max(1, i.quantity - 1), subtotal: i.drug.harga * Math.max(1, i.quantity - 1) }
                                    : i
                                )
                              );
                            }}
                            className="w-7 h-7 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setCartItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? { ...i, quantity: i.quantity + 1, subtotal: i.drug.harga * (i.quantity + 1) }
                                    : i
                                )
                              );
                            }}
                            className="w-7 h-7 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => setCartItems((prev) => prev.filter((i) => i.id !== item.id))}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-slate-200 pt-3 space-y-2 bg-white">
                  <div className="flex justify-between text-sm font-semibold text-slate-900">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        cartItems.reduce((acc, item) => acc + item.subtotal, 0)
                      )}
                    </span>
                  </div>
                  <button
                    onClick={handleCreateTransaction}
                    disabled={isCreating}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50"
                  >
                    {isCreating ? "Processing..." : "Complete Transaction"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Transactions</h2>
          <TransactionTable
            transactions={data.transactions}
            onViewReceipt={handleViewReceipt}
            onCancelTransaction={handleCancelTransaction}
          />
        </div>
      )}

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, qty) => {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, quantity: qty, subtotal: item.drug.harga * qty }
                : item
            )
          );
        }}
        onRemoveItem={(id) => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        }}
        onCreateTransaction={handleCreateTransaction}
        isCreating={isCreating}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptData={receiptData}
        loadingReceipt={loadingReceipt}
        onPrintReceipt={handlePrint}
        ref={receiptRef}
      />
    </div>
  );
}
