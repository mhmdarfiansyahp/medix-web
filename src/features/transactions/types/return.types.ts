export interface ReturnItem {
    id_item: number;
    id_obat: number;
    nama_obat: string;
    jumlah: number;
    alasan_item: string;
    kondisi_layak: boolean;
    stok_kembali: number;
}

export interface Return {
    id_return: number;
    id_transaksi: number;
    alasan: string;
    tanggal_retur: string;
    diajukan_oleh: number;
    status: 'pending' | 'disetujui' | 'ditolak';
    items: ReturnItem[];
    total_nilai: number;
}

export interface CreateReturnRequest {
    id_transaksi: number;
    alasan: string;
    items: {
        id_obat: number;
        jumlah: number;
        alasan_item: string;
        kondisi_layak: boolean;
    }[];
}

export interface ReturnResponse {
    id_return: number;
    id_transaksi: number;
    status: string;
    message: string;
}

export interface ApproveReturnResponse {
    id_return: number;
    status: string;
    message: string;
}

export interface RejectReturnResponse {
    id_return: number;
    status: string;
    message: string;
}

export interface ThresholdResponse {
    threshold: number;
    message: string;
}