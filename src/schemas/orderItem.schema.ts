import * as z from "zod";

export const OrderItemSchema = z.object({
  order_item_id: z.string(),
  product_id: z.string(),
  order_id: z.string(),
  unit_price: z.number(),
  quantity: z.number(),
});

export const OrderItemCreateSchema = OrderItemSchema.omit({
  order_item_id: true,
});
