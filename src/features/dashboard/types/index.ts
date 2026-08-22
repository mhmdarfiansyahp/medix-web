export type StockStatus = 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';

export interface MedicationPerformance {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
  status: StockStatus;
}

export interface InventoryAlert {
  id: string;
  name: string;
  detail: string;
  type: 'LOW_STOCK' | 'EXPIRING' | 'EMPTY' | 'RESTOCKED';
  label: string;
}

export interface SalesTrend {
  period: string;
  revenue: number;
  volume: number;
}