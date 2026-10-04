import React from "react";
import { FileText, X } from "lucide-react";
import type { ReceiptData } from "../types/transaction.types";
import { formatCurrency } from "../../../utils/utils";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  loadingReceipt: boolean;
  onPrintReceipt: () => void;
}

const ReceiptModal = React.forwardRef<HTMLDivElement, ReceiptModalProps>(
  ({ isOpen, onClose, receiptData, loadingReceipt, onPrintReceipt }, ref) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Transaction Receipt
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {loadingReceipt ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading receipt...</p>
              </div>
            ) : receiptData ? (
              <div>
                {/* Pasang ref di elemen struk yang ingin dicetak */}
                <div
                  ref={ref}
                  className="border border-slate-200 rounded-xl p-6 bg-slate-50"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      MEDIX PHARMACY
                    </h3>
                    <p className="text-sm text-slate-500">
                      Receipt #{receiptData.id_transaksi}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(receiptData.tgl_transaksi).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    {receiptData.details.map((detail: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-start pb-2 border-b border-slate-100"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">
                            {detail.nama_obat}
                          </div>
                          <div className="text-xs text-slate-500">
                            {detail.jumlah}x @{" "}
                            {formatCurrency(detail.harga_satuan)}
                          </div>
                        </div>
                        <div className="text-right font-medium">
                          {formatCurrency(detail.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(receiptData.total_harga)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onPrintReceipt}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
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
