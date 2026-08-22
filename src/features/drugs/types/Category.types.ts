export interface TypeDrug {
    id_jenis?: number;
    id?: number;
    nama_jenis: string;
}

export interface CreateTypeDrugRequest {
    nama_jenis: string;
}

export interface UpdateTypeDrugRequest {
    nama_jenis: string;
}

export interface ApiResponse<T> {
    message?: string;
    data?: T;
    error?: string;
}