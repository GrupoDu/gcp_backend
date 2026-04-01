import * as z from "zod";

export const StockUpdateSchema = z.object({
  id: z.string(),
  product_quantity_title: z.string(),
  event: z.string(),
  date: z.date(),
});

export const StockUpdateRegisterSchema = StockUpdateSchema.omit({
  id: true,
  date: true,
});
