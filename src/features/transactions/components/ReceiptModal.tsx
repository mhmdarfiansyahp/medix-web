import React from "react";
import { Printer, X } from "lucide-react";
import type { ReceiptData, TransactionDetail } from "../types/transaction.types";
import { formatCurrency } from "../../../utils/utils";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  loadingReceipt: boolean;
  onPrintReceipt: () => void;
}

function receiptNo(id: number | string) {
  return `MDX-${String(id).padStart(6, "0")}`;
}

const ReceiptModal = React.forwardRef<HTMLDivElement, ReceiptModalProps>(
  ({ isOpen, onClose, receiptData, loadingReceipt, onPrintReceipt }, ref) => {
    if (!isOpen) return null;

    const printedAt = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-100 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-100/95 backdrop-blur rounded-t-2xl border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Transaction Receipt
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {loadingReceipt ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading receipt...</p>
              </div>
            ) : receiptData ? (
              <div>
                <div className="mx-auto w-full max-w-[340px] bg-white shadow-md rounded-lg overflow-hidden">
                  <div
                    ref={ref}
                    id="printable-receipt"
                    className="w-full max-w-[340px] px-6 py-6 font-mono text-[12px] leading-relaxed text-slate-900"
                  >
                    <div className="text-center">
                      <p className="font-sans text-lg font-extrabold tracking-wide">
                        MEDIX PHARMACY
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Jl. Sehat Selalu No. 45, Jakarta
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Telp: (021) 555-0123
                      </p>
                    </div>

                    <div className="my-4 border-t-2 border-dashed border-slate-300" />

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">No. Struk</span>
                        <span className="font-semibold">
                          {receiptNo(receiptData.id_transaksi)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Tanggal</span>
                        <span className="font-semibold text-right">
                          {new Date(receiptData.tgl_transaksi).toLocaleString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Kasir</span>
                        <span className="font-semibold">
                          #{receiptData.id_user}
                        </span>
                      </div>
                    </div>

                    <div className="my-4 border-t-2 border-dashed border-slate-300" />

                    <div className="space-y-3">
                      {receiptData.details.map((detail: TransactionDetail, index: number) => (
                        <div key={detail.id_detail ?? index}>
                          <p className="font-sans font-semibold text-[12px] truncate">
                            {detail.nama_obat ?? `Obat #${detail.id_obat}`}
                          </p>
                          <div className="flex justify-between gap-3">
                            <span className="text-slate-600">
                              {detail.jumlah} x{" "}
                              {formatCurrency(detail.harga_satuan)}
                            </span>
                            <span className="font-semibold whitespace-nowrap">
                              {formatCurrency(detail.subtotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="my-4 border-t-2 border-dashed border-slate-300" />

                    <div className="flex justify-between items-center font-sans">
                      <span className="text-sm font-bold tracking-wide">
                        TOTAL
                      </span>
                      <span className="text-lg font-extrabold">
                        {formatCurrency(receiptData.total_harga)}
                      </span>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-slate-500">
                      {receiptData.details.reduce(
                        (sum: number, d: TransactionDetail) => sum + (d.jumlah ?? 0),
                        0
                      )}{" "}
                      item
                    </p>

                    <div className="my-4 border-t-2 border-dashed border-slate-300" />

                    <div className="text-center">
                      <p className="font-sans font-semibold text-[12px]">
                        Terima kasih atas kunjungan Anda
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Barang yang sudah dibeli tidak dapat dikembalikan
                      </p>
                      <p className="mt-3 text-[13px] tracking-[0.3em] font-bold">
                        *{receiptData.id_transaksi}*
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Dicetak: {printedAt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onPrintReceipt}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <X className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Failed to load receipt</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ReceiptModal.displayName = "ReceiptModal";

export default ReceiptModal;
