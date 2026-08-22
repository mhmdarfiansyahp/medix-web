export interface DrugCategory {
  id_jenis: number;
  nama_jenis: string;
}

export interface Drug {
  id_obat: number;
  nama_obat: string;
  merk_obat: string | null;
  jenis_obat_id: number | null;
  jenis_obat?: DrugCategory;
  barcode: string | null;
  tgl_kadaluarsa: string;
  harga: number;
  stok: number;
  stok_minimum: number;
  keterangan: string | null;
  status: 1 | 0;
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
  status?: 1 | 0;
  gambar?: string | null;
}

export type UpdateDrugRequest = Partial<CreateDrugRequest>;

export interface DrugFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  jenis_obat_id?: number;
  stock_status?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}