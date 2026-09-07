export interface DrugCategory {
    id_jenis: number;
    nama_jenis: string;
}

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
    updated_at?: string;
}

export interface CreateDrugRequest {
    nama_obat: string;
    merk_obat?: string | null;
    jenis_obat_id?: number | null;
    barcode?: string | null;
    tgl_kadaluarsa: string;
    harga: number;
    stok: number;
    stok_minimum?: number;
    keterangan?: string | null;
    gambar?: string | null;
}

export type UpdateDrugRequest = Partial<CreateDrugRequest>;

export interface DrugFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    jenis_obat_id?: number;
    status?: string;
    status_stok?: string;
}

export interface LowStockDrug {
    id_obat: number;
    nama_obat: string;
    merk_obat: string | null;
    stok: number;
    stok_minimum: number;
    nama_jenis: string;
}

export interface ExpiringDrug {
    id_obat: number;
    nama_obat: string;
    merk_obat: string | null;
    tgl_kadaluarsa: string;
    sisa_hari: number;
    stok: number;
    nama_jenis: string;
}

export interface AlertSummary {
    total_low_stock: number;
    total_expiring: number;
}
