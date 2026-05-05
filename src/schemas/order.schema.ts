import * as z from "zod";

export const OrderSchema = z.object({
  order_deadline: z.string().or(z.date()),
  billing_uuid: z.string().uuid(),
  revenue_uuid: z.string().uuid(),
  client_uuid: z.string().uuid(),
  delivery: z.object({
    delivery_address: z.string(),
    building: z.string(),
    reference: z.string().optional(),
    delivery_observation: z.string().optional(),
  }),
  order_items: z
    .array(
      z.object({
        product_uuid: z.string().uuid(),
        quantity: z.number().int().positive(),
        unit_price: z.number().int().nonnegative(),
        discount_percentage: z.number().nonnegative().optional(),
        ipi: z.number().nonnegative().optional(),
        additional_amount: z.number().int().nonnegative().optional(),
      }),
    )
    .min(1),
});

export const OrderUpdateSchema = OrderSchema.partial();
