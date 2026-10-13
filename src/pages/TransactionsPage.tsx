import { useState, useEffect, useMemo, useRef } from "react";
import { ShoppingCart, Plus, Search, X, Minus } from "lucide-react";
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

  const [showCartModal, setShowCartModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState<Record<number, number>>({});
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

  const fetchDrugs = async () => {
    setLoadingDrugs(true);
    try {
      const drugsData = await medicineService.getAll({ search: searchTerm, status: '1' });
      // Filter out expired medicines
      const validDrugs = drugsData.filter((drug) => {
        const expiryDate = drug.tgl_kadaluarsa ? new Date(drug.tgl_kadaluarsa) : null;
        return !expiryDate || expiryDate >= new Date();
      });
      setDrugs(validDrugs);
    } catch (err: unknown) {
      showErrorToast("Failed to load medicines");
    } finally {
      setLoadingDrugs(false);
    }
  };

  const fetchToday = async () => {
    setLoadingDrugs(true);
    setError(null);
    try {
      const res = await transactionService.getToday();
      setData(res);
      await fetchDrugs();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoadingDrugs(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    fetchDrugs();
  }, [searchTerm]);

  const handleAddToCart = (drug: Drug) => {
    const qty = quantity[drug.id_obat] || 1;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.drug.id_obat === drug.id_obat);
      if (existing) {
        return prev.map((item) =>
          item.drug.id_obat === drug.id_obat
            ? { ...item, quantity: item.quantity + qty, subtotal: item.drug.harga * (item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          drug,
          quantity: qty,
          subtotal: drug.harga * qty,
        },
      ];
    });

    setQuantity((prev) => ({ ...prev, [drug.id_obat]: 1 }));
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
          nama_obat: d.nama_obat || names.get(d.id_obat) || `Obat #${d.id_obat}`,
        })),
      });
    } catch (err) {
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
      await fetchToday();

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

        <div className="flex items-center gap-3">
          {cartItems.length > 0 && (
            <button
              onClick={() => setShowCartModal(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-slate-600" />
              <span>Cart ({cartItems.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowCartModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Open Cart</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Select Medicine</h2>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicine, SKU, or batch..."
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
          <div className="divide-y divide-slate-100">
            {drugsFiltered.map((drug) => {
              const drugQuantity = quantity[drug.id_obat] || 1;
              const totalPrice = drug.harga * drugQuantity;

              return (
                <div key={drug.id_obat} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 text-sm mb-1">
                        {drug.nama_obat}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                          SKU: {drug.barcode || "N/A"}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                          Stock: {drug.stok}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                          {formatCurrency(drug.harga)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity((prev) => ({ ...prev, [drug.id_obat]: Math.max(1, (prev[drug.id_obat] || 1) - 1) }))}
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={drugQuantity}
                          onChange={(e) => setQuantity((prev) => ({ ...prev, [drug.id_obat]: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className="w-16 px-3 py-1.5 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        <button
                          onClick={() => setQuantity((prev) => ({ ...prev, [drug.id_obat]: (prev[drug.id_obat] || 1) + 1 }))}
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right font-medium text-slate-900">
                        {formatCurrency(totalPrice)}
                      </div>

                      <button
                        onClick={() => handleAddToCart(drug)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

          {error && (
            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
              {error}
            </div>
          )}

          {data && (
            <>
              <TransactionSummary
                totalTransactions={data.summary.total_transaksi}
                totalRevenue={data.summary.total_penjualan}
              />

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Transactions</h2>
                <TransactionTable
                  transactions={data.transactions}
                  onViewReceipt={handleViewReceipt}
                  onCancelTransaction={handleCancelTransaction}
                />
              </div>
            </>
          )}
      </div>
    </div>
  );
}