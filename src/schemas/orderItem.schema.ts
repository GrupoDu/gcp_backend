import * as z from "zod";

export const OrderItemSchema = z.object({
  order_item_uuid: z.string().uuid(),
  product_uuid: z.string().uuid(),
  order_uuid: z.string().uuid(),
  unit_price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const OrderItemCreateSchema = OrderItemSchema.omit({
  order_item_uuid: true,
  total: true,
});
