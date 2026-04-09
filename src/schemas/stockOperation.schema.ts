import * as z from "zod";

export const StockOperationSchema = z.object({
  production_order_id: z.string(),
  product_quantity_title: z.string(),
  event: z.string(),
  inStockIncrementQuantity: z.number(),
  product_id: z.string(),
  validation: z.boolean(),
  producedQuantity: z.number(),
});
