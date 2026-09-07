export interface TransactionDetail {
    id_detail: number;
    id_obat: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
}

export interface Transaction {
    id_transaksi: number;
    id_user: number;
    tgl_transaksi: string;
    total_harga: number;
    status: number;
    details?: TransactionDetail[];
}

export interface TransactionDetailRequest {
    id_obat: number;
    jumlah: number;
}

export interface CreateTransactionRequest {
    details: TransactionDetailRequest[];
}

export interface CancelTransactionResponse {
    id_transaksi: number;
    status: number;
    total_harga: number;
    message: string;
}

export interface TransactionSummary {
    total_transaksi: number;
    total_penjualan: number;
}

export interface TodayTransactionResponse {
    transactions: Transaction[];
    summary: TransactionSummary;
}

export interface ReceiptData {
    id_transaksi: number;
    tgl_transaksi: string;
    id_user: number;
    details: TransactionDetail[];
    total_harga: number;
}
