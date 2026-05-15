import * as z from "zod";

export const OrderSchema = z.object({
  order_deadline: z.string().or(z.date()),
  billing: z.object({
    client_uuid: z.string().uuid(),
    billing_address: z.string(),
    name: z.string().optional(),
  }),
  revenue: z.object({
    revenue_address: z.string(),
    revenue_cnpj: z.string(),
    revenue_phone: z.string(),
    revenue_email: z.string(),
    client_uuid: z.string(),
    revenue_landline: z.string().optional(),
  }),
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
