export interface Drug {
    id_obat: number;
    nama_obat: string;
    merk_obat: string | null;
    jenis_obat_id: number | null;
    jenis_obat?: DrugCategory | null;
    barcode: string | null;
    tgl_kadaluarsa: string;
    harga: number;
    stok: number;
    stok_minimum: number;
    keterangan: string | null;
    status: number;
    gambar: string | null;
    created_at?: string;
}

export interface DrugCategory {
    id_jenis: number;
    nama_jenis: string;
}

export interface TransactionDetail {
    id_detail: number;
    id_obat: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
}

export interface CartItem {
    id: string;
    drug: Drug;
    quantity: number;
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
