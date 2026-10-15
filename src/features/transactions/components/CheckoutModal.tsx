import React, { useState } from "react";
import { X, CheckCircle2, Banknote, QrCode, CreditCard, Building2, Wallet } from "lucide-react";

export type PaymentMethod = "tunai" | "qris" | "debit" | "kredit" | "transfer";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirmPayment: (method: PaymentMethod, cashReceived: number) => Promise<void>;
    isLoading: boolean;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "tunai", label: "Cash", icon: <Banknote className="w-5 h-5 text-emerald-600" />, desc: "Pay with cash & calculate change" },
    { id: "qris", label: "QRIS", icon: <QrCode className="w-5 h-5 text-blue-600" />, desc: "Scan QR via GoPay, OVO, BCA, etc." },
    { id: "debit", label: "Debit Card", icon: <CreditCard className="w-5 h-5 text-indigo-600" />, desc: "EDC Debit Card" },
    { id: "kredit", label: "Credit Card", icon: <CreditCard className="w-5 h-5 text-amber-600" />, desc: "EDC Credit Card" },
    { id: "transfer", label: "Bank Transfer", icon: <Building2 className="w-5 h-5 text-violet-600" />, desc: "Direct transfer to pharmacy account" },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    totalAmount,
    onConfirmPayment,
    isLoading,
}) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("tunai");
    const [cashReceived, setCashReceived] = useState<string>("");

    if (!isOpen) return null;

    const cashNum = parseFloat(cashReceived) || 0;
    const changeAmount = cashNum - totalAmount;
    const isCashValid = selectedMethod !== "tunai" || cashNum >= totalAmount;

    const formatIDR = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const handleQuickCash = (amount: number) => {
        setCashReceived(amount.toString());
    };

    const handleConfirm = async () => {
        if (!isCashValid) return;
        await onConfirmPayment(selectedMethod, selectedMethod === "tunai" ? cashNum : totalAmount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Payment Process</h2>
                        <p className="text-xs text-slate-500">Select payment method and confirm transaction</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Amount</span>
                            <div className="text-2xl font-black text-blue-900 mt-0.5">{formatIDR(totalAmount)}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Method</label>
                        <div className="grid grid-cols-1 gap-2.5">
                            {PAYMENT_METHODS.map((method) => {
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                                            isSelected
                                                ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/10"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isSelected ? "bg-white shadow-sm" : "bg-slate-50"}`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{method.label}</div>
                                                <div className="text-xs text-slate-500">{method.desc}</div>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedMethod === "tunai" && (
                        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cash Received</label>
                                <span className="text-xs text-slate-500">Minimum {formatIDR(totalAmount)}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
                                <input
                                    type="number"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {[totalAmount, 50000, 100000, 200000].filter((v, i, arr) => v >= totalAmount && arr.indexOf(v) === i).slice(0, 4).map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => handleQuickCash(amt)}
                                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-sm"
                                    >
                                        {formatIDR(amt)}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600">Change:</span>
                                <span className={`text-sm font-black ${changeAmount >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                    {changeAmount >= 0 ? formatIDR(changeAmount) : "Insufficient " + formatIDR(Math.abs(changeAmount))}
                                </span>
                            </div>
                        </div>
                    )}

                    {selectedMethod === "qris" && (
                        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center animate-in fade-in duration-200">
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Scan QRIS to Pay</div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
                                <div className="w-48 h-48 bg-white flex flex-col items-center justify-center border-2 border-slate-300 rounded-lg mx-auto relative overflow-hidden p-2">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021126660011ID.CO.QRIS.WWW0118936009143000000000303UMI5204599953033605802ID5910MEDIX PHARMACY6007JAKARTA6304`}
                                        alt="QRIS Payment Code"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                                {formatIDR(totalAmount)}
                            </div>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Open your mobile banking or e-wallet app (GoPay, OVO, Dana, BCA, etc.) to scan and complete the payment.
                            </p>
                        </div>
                    )}

                    {selectedMethod === "debit" && (
                        <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center animate-in fade-in duration-200">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">EDC Debit Card Payment</h3>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Insert or tap customer debit card on EDC machine, enter PIN, and wait for approval.
                            </p>
                        </div>
                    )}

                    {selectedMethod === "kredit" && (
                        <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center animate-in fade-in duration-200">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">EDC Credit Card Payment</h3>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Swipe or tap credit card on EDC machine, sign receipt upon successful authorization.
                            </p>
                        </div>
                    )}

                    {selectedMethod === "transfer" && (
                        <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center animate-in fade-in duration-200">
                            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">Bank Transfer Account</h3>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 inline-block shadow-sm">
                                BCA: 123-456-7890 (Apotek Medix Utama)
                            </div>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Verify transfer proof in mobile banking app before confirming.
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading || !isCashValid}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {isLoading ? "Processing..." : "Confirm Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
};
