import { useState, useEffect, useMemo, useRef } from "react"; // 1. Import useRef
import { ShoppingCart, Plus, Eye } from "lucide-react";
import { transactionService } from "../services/transactionService";
import { medicineService } from "../services/medicineService";
import type {
  TodayTransactionResponse,
  Drug,
  CartItem,
  ReceiptData, // 2. Import ReceiptData type
} from "../features/transactions/types/transaction.types";
import { formatCurrency } from "../utils/utils";
import DrugSelectionModal from "../features/transactions/components/DrugSelectionModal";
import CartModal from "../features/transactions/components/CartModal";
import ReceiptModal from "../features/transactions/components/ReceiptModal"; // 3. Import ReceiptModal
import { showSuccessToast, showErrorToast } from "../utils/sweetalert";
import { useReactToPrint } from "react-to-print";

export default function TransactionsPage() {
  const [data, setData] = useState<TodayTransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);

  const [showDrugSelectionModal, setShowDrugSelectionModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // State Tambahan untuk Modal Receipt & Print
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [quantity, setQuantity] = useState(1);
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
    try {
      const drugsData = await medicineService.getAll({ search: searchTerm });
      setDrugs(drugsData);
    } catch (err: unknown) {
      showErrorToast("Failed to load medicines");
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
    if (showDrugSelectionModal) {
      fetchDrugs();
    }
  }, [showDrugSelectionModal, searchTerm]);

  // Fungsi untuk mengambil detail transaksi dan membuka modal receipt
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
      showErrorToast("Gagal mengambil detail transaksi");
    } finally {
      setLoadingReceipt(false);
    }
  };

  const handleCreateTransaction = async () => {
    if (cartItems.length === 0) {
      showErrorToast("Keranjang masih kosong");
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

      showSuccessToast("Transaction created successfully");
      setCartItems([]);
      setShowCartModal(false);
      await fetchToday();

      // Opsional: Langsung buka receipt setelah transaksi berhasil dibuat
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
              <span>Keranjang ({cartItems.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowDrugSelectionModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Transaksi</span>
          </button>
        </div>
      </div>

      <DrugSelectionModal
        isOpen={showDrugSelectionModal}
        onClose={() => {
          setShowDrugSelectionModal(false);
          setSelectedDrug(null);
          setQuantity(1);
          setSearchTerm("");
        }}
        drugs={drugsFiltered}
        loadingDrugs={loadingDrugs}
        searchTerm={searchTerm}
        selectedDrug={selectedDrug}
        quantity={quantity}
        onSearchTermChange={setSearchTerm}
        onSelectedDrugChange={setSelectedDrug}
        onQuantityChange={setQuantity}
        onAddToCart={(drug, qty) => {
          setCartItems((prev) => {
            const existing = prev.find(
              (item) => item.drug.id_obat === drug.id_obat
            );
            if (existing) {
              return prev.map((item) =>
                item.drug.id_obat === drug.id_obat
                  ? { ...item, quantity: item.quantity + qty }
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

          setShowDrugSelectionModal(false);
          setSelectedDrug(null);
          setQuantity(1);
          setSearchTerm("");
          showSuccessToast(`${drug.nama_obat} added to cart`);
          setShowCartModal(true);
        }}
        creatingTransaction={isCreating}
      />

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

      {/* RENDER RECEIPT MODAL DENGAN REF DARI PARENT */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Transactions
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {data.summary.total_transaksi}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Revenue
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.summary.total_penjualan)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Today's Date
                </span>
                <div className="text-xl font-bold text-slate-900">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {data.transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                No transactions today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Transaction ID</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6 text-right">Total</th>
                      <th className="py-3.5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.transactions.map((tx) => (
                      <tr
                        key={tx.id_transaksi}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-slate-900">
                          #{tx.id_transaksi}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(tx.tgl_transaksi).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900">
                          {formatCurrency(tx.total_harga)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {/* Tombol Lihat Struk / Print */}
                          <button
                            onClick={() => handleViewReceipt(tx.id_transaksi)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Struk
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
