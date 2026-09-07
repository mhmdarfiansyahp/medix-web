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

