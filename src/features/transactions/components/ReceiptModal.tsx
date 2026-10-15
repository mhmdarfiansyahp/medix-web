import React, { useState } from "react";
import { Printer, X, Mail, MessageCircle } from "lucide-react";
import type { ReceiptData, TransactionDetail } from "../types/transaction.types";
import { formatCurrency } from "../../../utils/utils";
import { showSuccessToast } from "../../../utils/sweetalert";

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
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showWhatsappInput, setShowWhatsappInput] = useState(false);

    if (!isOpen) return null;

    const handleSendWhatsApp = () => {
      if (!customerPhone.trim()) {
        alert("Please enter customer phone number");
        return;
      }
      if (!receiptData) return;
      const itemsText = receiptData.details
        .map((d) => `- ${d.nama_obat || 'Medicine'} (${d.jumlah}x @${formatCurrency(d.harga_satuan)}) = ${formatCurrency(d.subtotal)}`)
        .join("\n");
      const msg = `*MEDIX PHARMACY RECEIPT*\nReceipt No: ${receiptNo(receiptData.id_transaksi)}\nDate: ${receiptData.tgl_transaksi}\n\n*Items:*\n${itemsText}\n\n*TOTAL: ${formatCurrency(receiptData.total_harga)}*\n\nThank you for your visit!`;
      const url = `https://wa.me/${customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
      setShowWhatsappInput(false);
      showSuccessToast("WhatsApp receipt link generated.");
    };

    const handleSendEmail = () => {
      if (!customerEmail.trim() || !customerEmail.includes("@")) {
        alert("Please enter a valid email address");
        return;
      }
      if (!receiptData) return;
      const subject = encodeURIComponent(`Receipt #${receiptNo(receiptData.id_transaksi)} - Medix Pharmacy`);
      const itemsText = receiptData.details
        .map((d) => `${d.nama_obat || 'Medicine'} (${d.jumlah}x @${formatCurrency(d.harga_satuan)}) = ${formatCurrency(d.subtotal)}`)
        .join("\n");
      const body = encodeURIComponent(`MEDIX PHARMACY\n\nReceipt No: ${receiptNo(receiptData.id_transaksi)}\n\nItems:\n${itemsText}\n\nTOTAL: ${formatCurrency(receiptData.total_harga)}\n\nThank you for your visit!`);
      window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${body}`;
      setShowEmailInput(false);
      showSuccessToast("Email client opened.");
    };

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
                        Phone: (021) 555-0123
                      </p>
                    </div>

                    <div className="my-4 border-t-2 border-dashed border-slate-300" />

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Receipt No.</span>
                        <span className="font-semibold">
                          {receiptNo(receiptData.id_transaksi)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Date</span>
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
                        <span className="text-slate-500">Cashier</span>
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
                            {detail.nama_obat ?? `Medicine #${detail.id_obat}`}
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
                        Thank you for your visit
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Purchased items cannot be returned
                      </p>
                      <p className="mt-3 text-[13px] tracking-[0.3em] font-bold">
                        *{receiptData.id_transaksi}*
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Printed: {printedAt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={onPrintReceipt}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      Print Receipt
                    </button>
                    <button
                      onClick={() => {
                        setShowWhatsappInput(!showWhatsappInput);
                        setShowEmailInput(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        setShowEmailInput(!showEmailInput);
                        setShowWhatsappInput(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors"
                      title="Send via Email"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>

                  {showWhatsappInput && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex gap-2 items-center animate-in fade-in duration-200">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Customer WhatsApp (e.g. 08123456789)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleSendWhatsApp}
                        className="px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {showEmailInput && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex gap-2 items-center animate-in fade-in duration-200">
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Customer Email (e.g. name@example.com)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendEmail}
                        className="px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      Close
                    </button>
                  </div>
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
