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
import TransactionSummary from "../features/transactions/components/TransactionSummary";
import TransactionTable from "../features/transactions/components/TransactionTable";
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
      const drugsData = await medicineService.getAll({ search: searchTerm, status: '1' });
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
            <TransactionSummary
              totalTransactions={data.summary.total_transaksi}
              totalRevenue={data.summary.total_penjualan}
              todayDate={new Date()}
            />

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Transactions</h2>
              <TransactionTable
                transactions={data.transactions}
                onViewReceipt={handleViewReceipt}
                onCancelTransaction={(id) => {}}
              />
            </div>
          </>
        )}
    </div>
  );
}
