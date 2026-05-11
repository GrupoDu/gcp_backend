export interface IInOutStockAnalysis {
  in_out_stock_uuid?: string;
  created_at?: Date;
  month: number;
  year: number;
  in_quantity?: number;
  out_quantity?: number;
}
