import * as z from "zod";

export const OrderSchema = z.object({
  order_id: z.string(),
  created_at: z.date,
  order_status: z.string(),
  order_deadline: z.date(),
  order_title: z.string(),
  order_description: z.string().optional(),
  delivery_observation: z.string().optional(),
});

export const OrderUpdateSchema = OrderSchema.partial();
