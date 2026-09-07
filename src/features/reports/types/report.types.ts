export interface ReportFilterParams {
    start_date?: string;
    end_date?: string;
    group_by?: 'daily' | 'weekly' | 'monthly';
}

export interface SalesChartData {
    periode: string;
    total_penjualan: number;
    jumlah_transaksi: number;
}

export interface SalesSummaryResponse {
    total_penjualan: number;
    total_transaksi: number;
    chart_data: SalesChartData[];
}

export interface DrugSalesStat {
    id_obat: number;
    nama_obat: string;
    total_terjual: number;
    total_omset: number;
}

export interface DrugRankingResponse {
    top_medicines: DrugSalesStat[];
    bottom_medicines: DrugSalesStat[];
}
